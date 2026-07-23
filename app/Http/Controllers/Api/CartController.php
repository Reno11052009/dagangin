<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with('items.product.store')->firstOrCreate([]);
        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_uid' => 'required|exists:products,uid',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $request->user()->cart()->firstOrCreate([]);
        
        $item = $cart->items()->where('product_uid', $request->product_uid)->first();
        if ($item) {
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            $cart->items()->create([
                'product_uid' => $request->product_uid,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json($cart->load('items.product'));
    }

    public function removeItem(Request $request, $itemId)
    {
        $cart = $request->user()->cart;
        if ($cart) {
            $cart->items()->where('uid', $itemId)->delete();
        }
        return response()->json(['message' => 'Item removed']);
    }
}
