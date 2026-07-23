<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ShippingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;
    return response()->json(['access_token' => $token, 'user' => $user]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('store');
    });

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    });

    // Store / Seller API
    Route::get('/my-store', [StoreController::class, 'myStore']);
    Route::post('/stores', [StoreController::class, 'store']);
    Route::post('/stores/products', [StoreController::class, 'addProduct']);

    // Cart API
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);

    // Shipping API
    Route::get('/shipping/provinces', [ShippingController::class, 'getProvinces']);
    Route::get('/shipping/cities/{province}', [ShippingController::class, 'getCities']);
    Route::get('/shipping/subdistricts/{city}', [ShippingController::class, 'getSubdistricts']);
    Route::post('/shipping/cost', [ShippingController::class, 'checkCost']);

    // Checkout API
    Route::post('/checkout', [CheckoutController::class, 'process']);

    // Order API
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Chat API
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::post('/conversations', [ChatController::class, 'store']);
    Route::get('/conversations/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
});

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
