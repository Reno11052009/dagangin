<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->count() === 0) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $request->validate([
            'address' => 'required|string',
            'shipping_cost' => 'required|numeric',
            'courier' => 'required|string'
        ]);

        $totalPrice = $cart->items->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        $grossAmount = $totalPrice + $request->shipping_cost;

        $order = \App\Models\Order::create([
            'user_uid' => $user->uid,
            'total_price' => $grossAmount,
            'shipping_cost' => $request->shipping_cost,
            'courier' => $request->courier,
            'address' => $request->address,
            'status' => 'pending'
        ]);

        foreach ($cart->items as $item) {
            \App\Models\OrderItem::create([
                'order_uid' => $order->uid,
                'product_uid' => $item->product_uid,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);
        }

        // Setup Midtrans
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

        $params = array(
            'transaction_details' => array(
                'order_id' => $order->uid . '-' . time(), // Unique order id
                'gross_amount' => $grossAmount,
            ),
            'customer_details' => array(
                'first_name' => $user->name,
                'email' => $user->email,
            ),
            'callbacks' => array(
                'finish' => url('/orders/' . $order->uid),
            )
        );

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $order->update(['snap_token' => $snapToken]);
            
            // Clear cart
            $cart->items()->delete();

            return response()->json([
                'order' => $order,
                'snap_token' => $snapToken
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
