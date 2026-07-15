import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HomeProps {
    onAddToCart: (uid: string) => void;
}

function Home({ onAddToCart }: HomeProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        axios.get('/api/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-8">
            <div className="bg-blue-600 rounded-2xl p-10 text-white mb-10 shadow-lg text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Temukan Barang Impianmu</h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Belanja aman, nyaman, dan terpercaya hanya di Dagangin. 
                        Nikmati promo menarik setiap harinya.
                    </p>
                    <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-md">
                        Mulai Belanja
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50 transform -skew-y-3 z-0"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Produk Terbaru</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full md:w-80 pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                    />
                </div>
            </div>
            
            {loading ? (
                <div className="text-center text-slate-500 py-10">Memuat produk...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center text-slate-500 py-10 bg-white rounded-xl shadow-sm border border-slate-100">
                    {searchQuery ? 'Produk tidak ditemukan.' : 'Belum ada produk. Jadilah yang pertama menjual barang di Dagangin!'}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredProducts.map(product => (
                        <Link to={`/product/${product.uid}`} key={product.uid} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden group cursor-pointer block">
                            <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm">No Image</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-slate-800 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                                <div className="text-lg font-bold text-blue-600 mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{product.store ? product.store.name : 'Toko'}</span>
                                    <span>Stok: {product.stock}</span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onAddToCart(product.uid);
                                    }}
                                    className="mt-4 w-full bg-slate-50 hover:bg-blue-50 text-blue-600 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition border border-slate-200 hover:border-blue-200"
                                >
                                    <ShoppingCart size={16} />
                                    <span>Tambah</span>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
