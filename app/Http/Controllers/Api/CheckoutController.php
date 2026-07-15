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
            'address' => 'required|string'
        ]);

        $totalPrice = $cart->items->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        $order = \App\Models\Order::create([
            'user_uid' => $user->uid,
            'total_price' => $totalPrice,
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
                'gross_amount' => $totalPrice,
            ),
            'customer_details' => array(
                'first_name' => $user->name,
                'email' => $user->email,
            ),
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
