import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Store, Product, Category } from '../types';
import { Store as StoreIcon, Package, Plus, Save, Loader2, DollarSign, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface SellerDashboardProps {
    token: string | null;
}

export default function SellerDashboard({ token }: SellerDashboardProps) {
    const [loadingStore, setLoadingStore] = useState(true);
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    
    // Create store form state
    const [storeName, setStoreName] = useState('');
    const [storeDesc, setStoreDesc] = useState('');
    const [isCreatingStore, setIsCreatingStore] = useState(false);
    
    // Add product form state
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_uid: ''
    });

    useEffect(() => {
        if (!token) return;
        fetchStore();
        fetchCategories();
    }, [token]);

    const fetchStore = () => {
        setLoadingStore(true);
        axios.get('/api/my-store')
            .then(res => {
                setStore(res.data);
                if (res.data.products) {
                    setProducts(res.data.products);
                }
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    setStore(null);
                } else {
                    console.error('Error fetching store', err);
                }
            })
            .finally(() => setLoadingStore(false));
    };

    const fetchCategories = () => {
        axios.get('/api/categories')
            .then(res => setCategories(res.data))
            .catch(console.error);
    };

    const handleCreateStore = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingStore(true);
        axios.post('/api/stores', { name: storeName, description: storeDesc })
            .then(res => {
                Swal.fire('Sukses', 'Toko berhasil dibuat!', 'success');
                fetchStore();
            })
            .catch(err => {
                Swal.fire('Error', 'Gagal membuat toko: ' + (err.response?.data?.message || err.message), 'error');
            })
            .finally(() => setIsCreatingStore(false));
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingProduct(true);
        axios.post('/api/stores/products', newProduct)
            .then(res => {
                Swal.fire('Sukses', 'Produk berhasil ditambahkan!', 'success');
                setShowAddProduct(false);
                setNewProduct({ name: '', description: '', price: '', stock: '', category_uid: '' });
                fetchStore();
            })
            .catch(err => {
                Swal.fire('Error', 'Gagal menambahkan produk', 'error');
            })
            .finally(() => setIsAddingProduct(false));
    };

    if (!token) {
        return <Navigate to="/register" replace />;
    }

    if (loadingStore) {
        return (
            <div className="py-20 flex justify-center items-center">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (!store) {
        return (
            <div className="py-12 max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                            <StoreIcon size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Buka Toko Anda</h2>
                        <p className="text-slate-500 mt-2">Mulai berjualan di Dagangin dengan membuka toko pertama Anda secara gratis.</p>
                    </div>
                    
                    <form onSubmit={handleCreateStore} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
                            <input 
                                type="text" 
                                required
                                value={storeName}
                                onChange={e => setStoreName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Cth: Dagangin Official Store"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Toko</label>
                            <textarea 
                                required
                                value={storeDesc}
                                onChange={e => setStoreDesc(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={4}
                                placeholder="Jelaskan secara singkat tentang toko Anda..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isCreatingStore}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {isCreatingStore ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            <span>Buka Toko Sekarang</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 animate-in fade-in">
            {/* Store Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <StoreIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{store.name}</h1>
                        <p className="text-slate-500 text-sm mt-1">{store.description}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Add Product Modal/Section */}
            {showAddProduct && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Package size={24} className="text-blue-500" />
                            Tambah Produk Baru
                        </h2>
                        <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                            Batal
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                                <input 
                                    type="text" required
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                <select 
                                    required
                                    value={newProduct.category_uid}
                                    onChange={e => setNewProduct({...newProduct, category_uid: e.target.value})}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map(c => (
                                        <option key={c.uid} value={c.uid}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Produk</label>
                                <textarea 
                                    required rows={4}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <DollarSign size={16} />
                                    </div>
                                    <input 
                                        type="number" required min="0"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Stok</label>
                                <input 
                                    type="number" required min="0"
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isAddingProduct || !newProduct.category_uid}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {isAddingProduct ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>Simpan Produk</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <h3 className="text-xl font-bold text-slate-800 mb-4">Produk Anda</h3>
            
            {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 text-slate-400 rounded-full mb-4">
                        <Package size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-700 mb-1">Belum ada produk</h4>
                    <p className="text-slate-500">Mulai tambahkan produk untuk dijual di toko Anda.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-sm text-slate-600">Produk</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600">Harga</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600">Stok</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.uid} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">{p.name}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1 mt-1">{p.description}</div>
                                        </td>
                                        <td className="p-4 font-medium text-blue-600">
                                            Rp {Number(p.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-slate-600">{p.stock}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit (Coming Soon)">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus (Coming Soon)">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
