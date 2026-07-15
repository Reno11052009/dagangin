import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, MessageSquare, Tag, Package, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
    onAddToCart: (uid: string) => void;
}

function ProductDetail({ onAddToCart }: ProductDetailProps) {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [activeImgIdx, setActiveImgIdx] = useState(0);

    useEffect(() => {
        axios.get(`/api/products/${uid}`)
            .then(res => {
                setProduct(res.data);
                const imgs = res.data.images && res.data.images.length > 0 ? res.data.images : (res.data.image ? [res.data.image] : []);
                setMainImage(imgs[0] || null);
                setActiveImgIdx(0);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [uid]);

    const allImages = product ? (product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])) : [];

    const prevImage = () => {
        const idx = (activeImgIdx - 1 + allImages.length) % allImages.length;
        setActiveImgIdx(idx);
        setMainImage(allImages[idx]);
    };
    const nextImage = () => {
        const idx = (activeImgIdx + 1) % allImages.length;
        setActiveImgIdx(idx);
        setMainImage(allImages[idx]);
    };

    const addToCart = () => { if (product) onAddToCart(product.uid); };

    const handleChatPenjual = async () => {
        if (!product || !product.store) return;
        try {
            await axios.post('/api/conversations', { store_uid: product.store.uid });
            navigate('/chat');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) navigate('/login');
            else alert(err.response?.data?.message || 'Gagal memulai chat');
        }
    };

    if (loading) return (
        <div className="py-10 animate-pulse">
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
                <div className="md:w-1/2 bg-slate-200 min-h-[380px]" />
                <div className="md:w-1/2 p-8 space-y-4">
                    <div className="h-4 bg-slate-200 rounded-full w-1/4" />
                    <div className="h-8 bg-slate-200 rounded-full" />
                    <div className="h-8 bg-slate-200 rounded-full w-2/3" />
                    <div className="h-24 bg-slate-200 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="py-20 text-center">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Produk tidak ditemukan</h2>
        </div>
    );

    return (
        <div className="py-8 animate-fade-in-up">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-all group hover:-translate-x-1"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Kembali
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                {/* Image section */}
                <div className="md:w-1/2 p-5 flex flex-col gap-3">
                    {/* Main image */}
                    <div className="relative bg-slate-50 rounded-2xl overflow-hidden min-h-[340px] flex items-center justify-center group">
                        {mainImage ? (
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out" />
                        ) : (
                            <div className="text-slate-300 flex flex-col items-center gap-2">
                                <Package size={48} />
                                <span className="text-sm">Tidak ada gambar</span>
                            </div>
                        )}
                        {/* Nav arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10">
                                    <ChevronLeft size={18} className="text-slate-700" />
                                </button>
                                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10">
                                    <ChevronRight size={18} className="text-slate-700" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {allImages.map((_, i) => (
                                        <button key={i} onClick={() => { setActiveImgIdx(i); setMainImage(allImages[i]); }}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImgIdx ? 'bg-white w-4' : 'bg-white/60'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setActiveImgIdx(idx); setMainImage(img); }}
                                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === activeImgIdx ? 'border-indigo-500 shadow-md shadow-indigo-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className="p-8 md:w-1/2 flex flex-col">
                    {/* Category badge */}
                    {product.category?.name && (
                        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                            <Tag size={11} />
                            {product.category.name}
                        </div>
                    )}

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 leading-tight">{product.name}</h1>

                    <div className="text-3xl font-extrabold text-indigo-600 mb-6">
                        Rp {product.price.toLocaleString('id-ID')}
                    </div>

                    <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Store size={16} className="text-indigo-500" />
                            <span className="font-medium">{product.store?.name || 'Toko'}</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-2 text-slate-600">
                            <Package size={16} className="text-green-500" />
                            <span>Stok: <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock}</span></span>
                        </div>
                    </div>

                    <div className="mb-8 flex-grow">
                        <h3 className="font-bold text-slate-700 mb-2">Deskripsi Produk</h3>
                        <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{product.description || 'Belum ada deskripsi untuk produk ini.'}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-slate-100">
                        <button
                            onClick={handleChatPenjual}
                            className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                        >
                            <MessageSquare size={18} className="text-indigo-500" />
                            Chat Penjual
                        </button>
                        <button
                            onClick={addToCart}
                            className="flex-[2] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-95"
                        >
                            <ShoppingCart size={18} />
                            Masukkan Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
