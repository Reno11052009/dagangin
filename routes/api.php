<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['access_token' => $token, 'user' => $user]);
    }

    return response()->json(['message' => 'Invalid credentials'], 401);
});

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => \Illuminate\Support\Facades\Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json(['access_token' => $token, 'user' => $user]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    });

    // Store / Seller API
    Route::get('/my-store', [\App\Http\Controllers\Api\StoreController::class, 'myStore']);
    Route::post('/stores', [\App\Http\Controllers\Api\StoreController::class, 'store']);
    Route::post('/stores/products', [\App\Http\Controllers\Api\StoreController::class, 'addProduct']);

    // Cart API
    Route::get('/cart', [\App\Http\Controllers\Api\CartController::class, 'index']);
    Route::post('/cart/items', [\App\Http\Controllers\Api\CartController::class, 'addItem']);
    Route::delete('/cart/items/{id}', [\App\Http\Controllers\Api\CartController::class, 'removeItem']);

    // Checkout API
    Route::post('/checkout', [\App\Http\Controllers\Api\CheckoutController::class, 'process']);
});

Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class)->only(['index', 'show']);
