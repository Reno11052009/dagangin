<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function myStore(Request $request)
    {
        $store = $request->user()->store()->with('products')->first();
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }
        return response()->json($store);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($request->user()->store) {
            return response()->json(['message' => 'User already has a store'], 400);
        }

        $store = $request->user()->store()->create($request->only(['name', 'description']));
        return response()->json($store, 201);
    }

    public function addProduct(Request $request)
    {
        $store = $request->user()->store;
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $request->validate([
            'category_uid' => 'required|exists:categories,uid',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = $store->products()->create($request->all());
        return response()->json($product, 201);
    }
}
