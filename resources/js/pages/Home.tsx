import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Star, Zap, TrendingUp, Package, Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product } from '../types';

interface HomeProps {
    onAddToCart: (uid: string) => void;
}

type SortOption = 'terbaru' | 'terlaris' | 'harga_asc' | 'harga_desc';

const SORT_LABELS: Record<SortOption, string> = {
    terbaru: 'Terbaru',
    terlaris: 'Terpopuler',
    harga_asc: 'Harga: Termurah',
    harga_desc: 'Harga: Termahal',
};

function Home({ onAddToCart }: HomeProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [activeCategory, setActiveCategory] = useState<string>('semua');
    const [sort, setSort] = useState<SortOption>('terbaru');
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/products')
            .then(res => { setProducts(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    // Derive unique categories from loaded products
    const categories = useMemo(() => {
        const seen = new Map<string, string>();
        products.forEach(p => {
            if (p.category?.uid && !seen.has(p.category.uid)) {
                seen.set(p.category.uid, p.category.name);
            }
        });
        return Array.from(seen.entries()).map(([uid, name]) => ({ uid, name }));
    }, [products]);

    // Filter + Sort
    const displayedProducts = useMemo(() => {
        let list = products;

        if (searchQuery) {
            list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (activeCategory !== 'semua') {
            list = list.filter(p => p.category?.uid === activeCategory);
        }

        const sorted = [...list];
        if (sort === 'harga_asc') sorted.sort((a, b) => a.price - b.price);
        else if (sort === 'harga_desc') sorted.sort((a, b) => b.price - a.price);
        else if (sort === 'terlaris') sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        // 'terbaru' → default API order

        return sorted;
    }, [products, searchQuery, activeCategory, sort]);

    return (
        <div className="py-8">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 animate-gradient">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-violet-300/10 rounded-full blur-2xl" />
                </div>
                <div className="relative z-10 px-8 py-14 md:px-16 md:py-16 text-white text-center">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-5 border border-white/20">
                        <Zap size={14} className="text-yellow-300" />
                        Marketplace #1 Pilihan Penjual & Pembeli
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
                        Temukan Barang<br />
                        <span className="text-white">Impianmu</span> di Sini
                    </h1>
                    <p className="text-lg text-indigo-100 mb-0 max-w-xl mx-auto leading-relaxed">
                        Belanja aman, nyaman, dan terpercaya hanya di Dagangin.
                    </p>
                    <div className="flex justify-center gap-8 mt-8">
                        {[
                            { icon: <TrendingUp size={16} />, label: 'Produk Terjual', value: '10K+' },
                            { icon: <Star size={16} />, label: 'Rating Kepuasan', value: '4.9/5' },
                            { icon: <Zap size={16} />, label: 'Penjual Aktif', value: '500+' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="flex items-center justify-center gap-1 text-indigo-200 text-xs mb-0.5">{stat.icon}{stat.label}</div>
                                <div className="text-xl font-extrabold text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
                {/* Category pills */}
                <div className="flex items-center gap-2 flex-wrap flex-grow">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                        <SlidersHorizontal size={13} /> Filter:
                    </span>
                    <button
                        onClick={() => setActiveCategory('semua')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            activeCategory === 'semua'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Semua
                    </button>
                    {loading ? (
                        [...Array(3)].map((_, i) => <div key={i} className="h-7 w-20 bg-slate-100 rounded-xl animate-pulse" />)
                    ) : (
                        categories.map(cat => (
                            <button
                                key={cat.uid}
                                onClick={() => setActiveCategory(cat.uid)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    activeCategory === cat.uid
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))
                    )}
                    {activeCategory !== 'semua' && (
                        <button
                            onClick={() => setActiveCategory('semua')}
                            className="text-slate-400 hover:text-red-500 transition p-0.5"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Sort dropdown */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                    >
                        <TrendingUp size={13} />
                        {SORT_LABELS[sort]}
                        <ChevronDown size={13} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSortOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                            <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden w-44">
                                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setSort(key); setIsSortOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                                            sort === key ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Product count & search label */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">
                        {activeCategory !== 'semua'
                            ? categories.find(c => c.uid === activeCategory)?.name
                            : searchQuery ? `Hasil "${searchQuery}"` : 'Semua Produk'}
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">{displayedProducts.length} produk ditemukan</p>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                            <div className="h-44 bg-slate-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-slate-200 rounded-full" />
                                <div className="h-3 bg-slate-200 rounded-full w-2/3" />
                                <div className="h-4 bg-slate-200 rounded-full w-1/2 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : displayedProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Search size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">Produk Tidak Ditemukan</h3>
                    <p className="text-slate-500 text-sm">
                        {searchQuery ? `Tidak ada produk yang cocok dengan "${searchQuery}"` : 'Belum ada produk dalam kategori ini.'}
                    </p>
                    {activeCategory !== 'semua' && (
                        <button onClick={() => setActiveCategory('semua')} className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
                            Lihat Semua Produk
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {displayedProducts.map((product, index) => (
                        <Link
                            to={`/product/${product.uid}`}
                            key={product.uid}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover group cursor-pointer block shadow-sm"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            <div className="h-44 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                {(product.images && product.images.length > 0) || product.image ? (
                                    <img
                                        src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-300">
                                        <Package size={32} className="mb-1" />
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                                {sort === 'terlaris' && (product.views || 0) > 0 && (
                                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                                        <TrendingUp size={10} /> {product.views}
                                    </span>
                                )}
                                {product.category?.name && (
                                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {product.category.name}
                                    </span>
                                )}
                                {/* Quick add overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <button
                                        onClick={(e) => { e.preventDefault(); onAddToCart(product.uid); }}
                                        className="w-full bg-white text-slate-800 text-xs font-bold py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
                                    >
                                        <ShoppingCart size={13} /> Tambah ke Keranjang
                                    </button>
                                </div>
                            </div>
                            <div className="p-3.5">
                                <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                                <div className="text-base font-extrabold text-indigo-600 mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span className="truncate">{product.store ? product.store.name : 'Toko'}</span>
                                    <span className="text-green-600 font-medium shrink-0 ml-1">Stok {product.stock}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
