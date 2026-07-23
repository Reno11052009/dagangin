<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_uid', $request->user()->uid)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Display the specified order with details.
     */
    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product', 'items.product.store', 'items.product.category'])
            ->where('uid', $id)
            ->where('user_uid', $request->user()->uid)
            ->firstOrFail();

        // If order is still pending, try to check status from Midtrans if order_id is provided in the query string
        if ($order->status === 'pending' && $request->has('order_id')) {
            try {
                \Midtrans\Config::$serverKey = config('midtrans.server_key');
                \Midtrans\Config::$isProduction = config('midtrans.is_production');
                
                $midtransStatus = \Midtrans\Transaction::status($request->order_id);
                
                if ($midtransStatus && isset($midtransStatus->transaction_status)) {
                    $status = $midtransStatus->transaction_status;
                    if ($status == 'capture' || $status == 'settlement') {
                        $order->update(['status' => 'paid']);
                        $order->status = 'paid';
                    } elseif ($status == 'cancel' || $status == 'deny' || $status == 'expire') {
                        $order->update(['status' => 'cancelled']);
                        $order->status = 'cancelled';
                    }
                }
            } catch (\Exception $e) {
                // Ignore error and just return the order as is
            }
        }

        return response()->json($order);
    }
}
