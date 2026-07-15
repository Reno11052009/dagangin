import React, { useState } from 'react';
import { Trash2, CreditCard, X, Loader2, ShoppingCart } from 'lucide-react';
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
            .catch(err => Swal.fire('Error', 'Gagal menghapus item', 'error'));
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        axios.post('/api/checkout', { address: 'Alamat Testing 123 (Silakan disesuaikan nanti)' })
            .then(res => {
                setIsCheckingOut(false);
                const snapToken = res.data.snap_token;
                
                if (window.snap) {
                    window.snap.pay(snapToken, {
                        onSuccess: function(result: any) {
                            Swal.fire('Berhasil', 'Pembayaran sukses!', 'success');
                            fetchCart();
                            onClose();
                        },
                        onPending: function(result: any) {
                            Swal.fire('Info', 'Menunggu pembayaran!', 'info');
                        },
                        onError: function(result: any) {
                            Swal.fire('Error', 'Pembayaran gagal!', 'error');
                            setIsCheckingOut(false);
                        },
                        onClose: function() {
                            setIsCheckingOut(false);
                        }
                    });
                } else {
                    Swal.fire('Error', 'Midtrans Snap tidak termuat dengan benar.', 'error');
                }
            })
            .catch(err => {
                setIsCheckingOut(false);
                Swal.fire('Error', 'Checkout gagal: ' + (err.response?.data?.message || err.message), 'error');
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-bold text-slate-800">Keranjang Belanja</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition rounded-full hover:bg-slate-100">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-slate-400 mb-4 flex justify-center">
                                <ShoppingCart size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Keranjang Anda Kosong</h3>
                            <p className="text-slate-500 mb-6">Ayo temukan barang impianmu!</p>
                            <button onClick={onClose} className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700 transition">
                                Lanjut Belanja
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.uid} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 text-xs">
                                        Gambar
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{item.product?.name}</h3>
                                            <div className="text-blue-600 font-bold mt-1 text-sm">Rp {Number(item.product?.price || 0).toLocaleString('id-ID')}</div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-slate-200 rounded-md">
                                                <button className="px-2 py-0.5 hover:bg-slate-50 text-slate-500">-</button>
                                                <span className="px-3 py-0.5 text-sm font-medium">{item.quantity}</span>
                                                <button className="px-2 py-0.5 hover:bg-slate-50 text-slate-500">+</button>
                                            </div>
                                            <button 
                                                onClick={() => handleRemove(item.uid)}
                                                className="text-slate-400 hover:text-red-500 transition p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {cartItems.length > 0 && (
                    <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600">Total Tagihan</span>
                            <span className="font-extrabold text-blue-600 text-xl">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            disabled={isCheckingOut}
                            className={`w-full font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg text-white ${isCheckingOut ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isCheckingOut ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
                            <span>{isCheckingOut ? 'Memproses...' : 'Beli Sekarang'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
