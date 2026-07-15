import React, { useState } from 'react';
import { Trash2, CreditCard, X, Loader2, ShoppingCart, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';
import { CartItemType } from '../types';
import axios from 'axios';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems?: CartItemType[];
    fetchCart: () => void;
}

function Cart({ isOpen, onClose, cartItems = [], fetchCart }: CartProps) {
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const total = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

    const handleRemove = (uid: string) => {
        axios.delete(`/api/cart/items/${uid}`)
            .then(() => fetchCart())
            .catch(() => Swal.fire('Error', 'Gagal menghapus item', 'error'));
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        axios.post('/api/checkout', { address: 'Alamat Testing 123 (Silakan disesuaikan nanti)' })
            .then(res => {
                setIsCheckingOut(false);
                const snapToken = res.data.snap_token;
                if (window.snap) {
                    window.snap.pay(snapToken, {
                        onSuccess: () => { Swal.fire('Berhasil', 'Pembayaran sukses!', 'success'); fetchCart(); onClose(); },
                        onPending: () => Swal.fire('Info', 'Menunggu pembayaran!', 'info'),
                        onError: () => { Swal.fire('Error', 'Pembayaran gagal!', 'error'); setIsCheckingOut(false); },
                        onClose: () => setIsCheckingOut(false)
                    });
                } else {
                    Swal.fire('Error', 'Midtrans Snap tidak termuat.', 'error');
                }
            })
            .catch(err => {
                setIsCheckingOut(false);
                Swal.fire('Error', 'Checkout gagal: ' + (err.response?.data?.message || err.message), 'error');
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <ShoppingBag size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Keranjang Belanja</h2>
                            <p className="text-xs text-slate-500">{cartItems.length} item</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-5 bg-slate-50/50">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-5">
                                <ShoppingCart size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1.5">Keranjang Kosong</h3>
                            <p className="text-slate-500 text-sm mb-6">Yuk, temukan produk favoritmu!</p>
                            <button onClick={onClose} className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm">
                                Mulai Belanja
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item.uid} className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex gap-3.5 group hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                                    <div className="w-18 h-18 bg-slate-50 rounded-xl overflow-hidden shrink-0" style={{ width: 72, height: 72 }}>
                                        {(item.product?.images && item.product.images.length > 0) || item.product?.image ? (
                                            <img
                                                src={(item.product?.images && item.product.images.length > 0) ? item.product.images[0] : item.product?.image}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ShoppingCart size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.product?.name}</h3>
                                            <div className="text-indigo-600 font-bold mt-0.5 text-sm">Rp {Number(item.product?.price || 0).toLocaleString('id-ID')}</div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-0.5 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                                <button className="px-2.5 py-1 hover:bg-slate-100 text-slate-500 text-sm font-bold transition">−</button>
                                                <span className="px-3 py-1 text-sm font-semibold text-slate-700 bg-white border-x border-slate-200">{item.quantity}</span>
                                                <button className="px-2.5 py-1 hover:bg-slate-100 text-slate-500 text-sm font-bold transition">+</button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.uid)}
                                                className="text-slate-300 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-5 bg-white border-t border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600 text-sm">Total Tagihan</span>
                            <span className="font-extrabold text-indigo-600 text-xl">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 active:scale-95"
                        >
                            {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                            {isCheckingOut ? 'Memproses...' : 'Bayar Sekarang'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
