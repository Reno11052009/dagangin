import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import { ShoppingCart, LogIn, LogOut, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { CartItemType } from './types';

function App() {
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCart();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setCartItems([]);
        }
    }, [token]);

    const fetchCart = () => {
        axios.get('/api/cart')
            .then(res => setCartItems(res.data.items || []))
            .catch(console.error);
    };

    // Dummy handleLogin dihilangkan, sekarang menggunakan rute /login dan /register

    const handleLogout = () => {
        axios.post('/api/logout').finally(() => {
            localStorage.removeItem('token');
            setToken(null);
        });
    };

    const handleAddToCart = (productUid: string, quantity: number = 1) => {
        if (!token) return Swal.fire('Info', 'Silakan login terlebih dahulu!', 'info');
        axios.post('/api/cart/items', { product_uid: productUid, quantity })
            .then(() => {
                fetchCart();
                setIsCartOpen(true);
            })
            .catch(err => Swal.fire('Error', 'Gagal menambah ke keranjang', 'error'));
    };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold tracking-tight">Dagangin</Link>
                        <nav className="space-x-4 text-sm font-medium flex items-center">
                            <Link to="/" className="hover:text-blue-200 transition">Beranda</Link>
                            <Link to="/seller" className="hover:text-blue-200 transition">Toko Saya</Link>
                            
                            {token ? (
                                <button onClick={handleLogout} className="hover:text-blue-200 transition flex items-center gap-1">
                                    <LogOut size={16} /> Logout
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="hover:text-blue-200 transition flex items-center gap-1">
                                        <LogIn size={16} /> Login
                                    </Link>
                                    <Link to="/register" className="hover:text-blue-200 transition flex items-center gap-1">
                                        <UserPlus size={16} /> Daftar
                                    </Link>
                                </div>
                            )}

                            <button 
                                onClick={() => setIsCartOpen(true)}
                                className="hover:text-blue-200 transition flex items-center gap-1 bg-blue-700 px-3 py-2 rounded-lg relative"
                            >
                                <ShoppingCart size={18} />
                                <span>Keranjang</span>
                                {totalCartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalCartItems}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>
                </header>

                <main className="flex-grow max-w-6xl mx-auto w-full px-4">
                    <Routes>
                        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
                        <Route path="/product/:uid" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/register" element={<Register setToken={setToken} />} />
                        <Route path="/seller" element={<SellerDashboard token={token} />} />
                    </Routes>
                </main>

                <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
                    &copy; {new Date().getFullYear()} Dagangin. All rights reserved.
                </footer>

                {/* Cart Popup */}
                <Cart 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                    cartItems={cartItems} 
                    fetchCart={fetchCart}
                />
            </div>
        </Router>
    );
}

const rootElement = document.getElementById('app');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
