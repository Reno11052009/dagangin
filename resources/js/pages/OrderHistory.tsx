import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PackageOpen, Clock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

export function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { text: 'Menunggu Pembayaran', color: 'text-orange-600', bg: 'bg-orange-50', icon: <Clock size={14} /> };
            case 'paid': return { text: 'Dibayar', color: 'text-blue-600', bg: 'bg-blue-50', icon: <CheckCircle size={14} /> };
            case 'completed': return { text: 'Selesai', color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={14} /> };
            case 'cancelled': return { text: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={14} /> };
            default: return { text: status, color: 'text-slate-600', bg: 'bg-slate-50', icon: <Clock size={14} /> };
        }
    };

    if (loading) {
        return (
            <div className="py-10 max-w-4xl mx-auto space-y-4">
                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-6"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Pesanan Saya</h1>
            
            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-4">
                        <PackageOpen size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Belum ada pesanan</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Anda belum pernah melakukan pemesanan. Mulai belanja sekarang untuk melihat daftar pesanan Anda di sini.</p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                        Mulai Belanja
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const status = getStatusInfo(order.status);
                        const orderDate = new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        });

                        return (
                            <Link 
                                to={`/orders/${order.uid}`} 
                                key={order.uid}
                                className="block bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.color}`}>
                                                {status.icon} {status.text}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{orderDate}</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-500 mb-1">ID: {order.uid.split('-')[0]}...</div>
                                        <div className="font-extrabold text-lg text-slate-800">
                                            Rp {order.total_price.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div className="text-indigo-600 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Lihat Detail <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
