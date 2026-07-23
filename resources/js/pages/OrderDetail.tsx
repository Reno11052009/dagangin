import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer, MapPin, Package, Clock, CheckCircle, XCircle, CreditCard, Truck, AlertTriangle } from 'lucide-react';
import { Order } from '../types';
import Button from '../components/Button';

export function OrderDetail() {
    const { uid } = useParams<{ uid: string }>();
    const { search } = useLocation();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/orders/${uid}${search}`)
            .then(res => setOrder(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [uid, search]);

    const handlePrint = () => {
        window.print();
    };

    const handlePayment = () => {
        if (order?.snap_token && window.snap) {
            window.snap.pay(order.snap_token, {
                onSuccess: () => {
                    // Refresh status or reload page
                    window.location.reload();
                },
                onPending: () => {
                    alert('Menunggu pembayaran!');
                },
                onError: () => {
                    alert('Pembayaran gagal!');
                }
            });
        } else {
            alert('Token pembayaran tidak valid atau Midtrans belum dimuat.');
        }
    };

    if (loading) {
        return (
            <div className="py-10 max-w-4xl mx-auto space-y-4">
                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-6"></div>
                <div className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Pesanan tidak ditemukan</h2>
                <Link to="/orders" className="text-indigo-600 hover:underline mt-2 inline-block">Kembali ke Daftar Pesanan</Link>
            </div>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { text: 'Menunggu Pembayaran', color: 'text-orange-600', icon: <Clock size={16} /> };
            case 'paid': return { text: 'Dibayar', color: 'text-blue-600', icon: <CheckCircle size={16} /> };
            case 'completed': return { text: 'Selesai', color: 'text-green-600', icon: <CheckCircle size={16} /> };
            case 'cancelled': return { text: 'Dibatalkan', color: 'text-red-600', icon: <XCircle size={16} /> };
            default: return { text: status, color: 'text-slate-600', icon: <Clock size={16} /> };
        }
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="py-10 max-w-4xl mx-auto print:py-0 print:max-w-full">
            {/* Action Bar - Hidden in print */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Link to="/orders" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition font-medium text-sm">
                    <ArrowLeft size={16} /> Kembali
                </Link>
                <Button 
                    variant="outline" 
                    size="sm" 
                    leftIcon={<Printer size={16} />} 
                    onClick={handlePrint}
                >
                    Cetak Invoice
                </Button>
            </div>

            {/* Printable Invoice Area */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm print:shadow-none print:border-none print:p-0 print:bg-transparent">
                {/* Header Invoice */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-100 print:border-slate-800">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">INVOICE</h1>
                        <div className="text-slate-500 mt-1 font-mono text-sm">#{order.uid.toUpperCase()}</div>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-sm text-slate-500 mb-1">Tanggal Pesanan</div>
                        <div className="font-semibold text-slate-800">{orderDate}</div>
                        
                        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-50 border border-slate-100 print:border-slate-800">
                            Status: <span className={`${statusInfo.color} flex items-center gap-1 ml-1`}>{statusInfo.icon} {statusInfo.text}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="mb-10 p-5 bg-slate-50 rounded-2xl print:bg-transparent print:border print:border-slate-800 print:p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <MapPin size={18} className="text-indigo-600 print:text-black" /> Alamat Pengiriman
                        </div>
                        {order.courier && (
                            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                <Truck size={14} className="text-indigo-500 print:text-black" /> 
                                Kurir: {order.courier.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed print:text-black">
                        {order.address}
                    </p>
                </div>

                {/* Items Table */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Package size={18} className="text-indigo-600 print:text-black" /> Detail Produk
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100 print:border-slate-800 text-slate-500 text-sm">
                                    <th className="py-3 font-semibold w-1/2">Produk</th>
                                    <th className="py-3 font-semibold text-right">Harga</th>
                                    <th className="py-3 font-semibold text-center">Jml</th>
                                    <th className="py-3 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.uid} className="border-b border-slate-50 print:border-slate-300">
                                        <td className="py-4">
                                            <div className="font-semibold text-slate-800 text-sm">
                                                {item.product ? item.product.name : 'Produk Dihapus'}
                                            </div>
                                            {item.product?.store && (
                                                <div className="text-xs text-slate-400 mt-0.5 print:text-slate-600">Toko: {item.product.store.name}</div>
                                            )}
                                        </td>
                                        <td className="py-4 text-right text-sm text-slate-600 print:text-black">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 text-center text-sm text-slate-600 print:text-black">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 text-right font-bold text-slate-800 text-sm">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-1/2 md:w-1/3 bg-slate-50 p-5 rounded-2xl print:bg-transparent print:border print:border-slate-800">
                        <div className="flex justify-between items-center text-slate-600 mb-2">
                            <span className="text-sm font-medium">Subtotal Produk</span>
                            <span className="text-sm font-semibold">Rp {(order.total_price - (order.shipping_cost || 0)).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 mb-4 pb-4 border-b border-slate-200 print:border-slate-400">
                            <span className="text-sm font-medium">Ongkos Kirim</span>
                            <span className="text-sm font-semibold">
                                {order.shipping_cost ? `Rp ${order.shipping_cost.toLocaleString('id-ID')}` : 'Gratis'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-base font-bold text-slate-800">Total Belanja</span>
                            <span className="text-xl font-extrabold text-indigo-600 print:text-black">Rp {order.total_price.toLocaleString('id-ID')}</span>
                        </div>
                        
                        {order.status === 'pending' && order.snap_token && (
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl flex gap-2 items-start print:hidden">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <p>Perhatian: Sistem pembayaran saat ini menggunakan mode <strong>Sandbox (Testing)</strong>. Jangan gunakan uang atau data kartu kredit asli Anda.</p>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 print:hidden"
                                >
                                    <CreditCard size={18} /> Lanjutkan ke Pembayaran
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer Print Only */}
                <div className="hidden print:block mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-600">
                    <p>Terima kasih telah berbelanja di Dagangin!</p>
                    <p className="mt-1 font-mono text-xs">Dicetak pada {new Date().toLocaleString('id-ID')}</p>
                </div>
            </div>
            
            {/* Global CSS injected for printing */}
            <style>{`
                @media print {
                    body { background: white; margin: 0; padding: 0; }
                    header, nav, footer, .print\\:hidden { display: none !important; }
                    #app { padding: 0; }
                }
            `}</style>
        </div>
    );
}

export default OrderDetail;
