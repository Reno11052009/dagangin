import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
    onAddToCart: (uid: string) => void;
}

function ProductDetail({ onAddToCart }: ProductDetailProps) {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`/api/products/${uid}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [uid]);

    const addToCart = () => {
        if (product) {
            onAddToCart(product.uid);
        }
    };

    if (loading) return <div className="text-center py-20">Memuat data produk...</div>;
    if (!product) return <div className="text-center py-20">Produk tidak ditemukan</div>;

    return (
        <div className="py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition">
                <ArrowLeft size={16} />
                <span>Kembali</span>
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-slate-100 flex items-center justify-center min-h-[300px]">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-400">Tidak ada gambar</div>
                    )}
                </div>
                
                <div className="p-8 md:w-1/2 flex flex-col">
                    <div className="text-sm text-blue-600 font-semibold mb-2">
                        {product.category?.name || 'Kategori'}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
                    <div className="text-3xl font-extrabold text-blue-600 mb-6">
                        Rp {product.price.toLocaleString('id-ID')}
                    </div>
                    
                    <div className="prose prose-slate mb-8 flex-grow">
                        <h3 className="font-semibold text-slate-700">Deskripsi</h3>
                        <p className="text-slate-600 whitespace-pre-line">{product.description}</p>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-6 mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-slate-500">
                                Dijual oleh: <span className="font-semibold text-slate-700">{product.store?.name || 'Toko'}</span>
                            </div>
                            <div className="text-slate-500">
                                Stok: <span className="font-semibold text-slate-700">{product.stock}</span>
                            </div>
                        </div>
                        
                        <button onClick={addToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg">
                            <ShoppingCart size={20} />
                            <span>Masukkan Keranjang</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
