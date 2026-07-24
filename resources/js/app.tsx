import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import Chat from './pages/Chat';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import { ShoppingCart, LogIn, LogOut, UserPlus, MessageSquare, Bell, Store, Menu, X, Search, PackageOpen } from 'lucide-react';
import Swal from 'sweetalert2';
import { CartItemType, NotificationType } from './types';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'ap1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

function SearchBar() {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        navigate(val.trim() ? `/?q=${encodeURIComponent(val.trim())}` : '/', { replace: true });
    };

    if (!isHome) return null;

    return (
        <form onSubmit={handleSubmit} className="hidden md:flex relative w-64 lg:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Cari produk..."
                className="w-full pl-9 pr-4 py-2 bg-white/15 hover:bg-white/20 focus:bg-white/25 border border-white/20 rounded-xl text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
        </form>
    );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`relative flex items-center gap-1.5 px-1 py-1 text-sm font-medium transition-colors duration-200 group ${
                isActive ? 'text-white' : 'text-indigo-200 hover:text-white'
            }`}
        >
            {children}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-white rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
    );
}

function App() {
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [userUid, setUserUid] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasStore, setHasStore] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCart();
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setCartItems([]);
            setUserUid(null);
            setNotifications([]);
            setHasStore(false);
        }
    }, [token]);

    const fetchUser = () => {
        axios.get('/api/user')
            .then(res => {
                setUserUid(res.data.uid);
                setHasStore(!!res.data.store);
                fetchNotifications();
            })
            .catch(console.error);
    };

    const fetchNotifications = () => {
        axios.get('/api/notifications')
            .then(res => setNotifications(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        if (userUid) {
            const channel = window.Echo.private('App.Models.User.' + userUid);
            channel.notification((notification: any) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'info',
                    title: notification.sender_name ? `Pesan dari ${notification.sender_name}` : 'Notifikasi Baru',
                    text: notification.message,
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true,
                    customClass: { popup: 'rounded-2xl shadow-xl' }
                });
                setNotifications(prev => [notification, ...prev]);
            });

            return () => {
                window.Echo.leave('App.Models.User.' + userUid);
            };
        }
    }, [userUid]);

    const markAsRead = (id: string) => {
        axios.post(`/api/notifications/${id}/read`).then(() => {
            fetchNotifications();
            setIsNotifOpen(false);
        });
    };

    const fetchCart = () => {
        axios.get('/api/cart')
            .then(res => setCartItems(res.data.items || []))
            .catch(console.error);
    };

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
            .catch(() => Swal.fire('Error', 'Gagal menambah ke keranjang', 'error'));
    };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-slate-50">
                {/* Header */}
                <header className="sticky top-0 z-40">
                    {/* Top gradient bar */}
                    <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    
                    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                {/* Logo */}
                                <Link to="/" className="flex items-center gap-2.5 group">
                                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all">
                                        <Store size={18} className="text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight">Dagangin</span>
                                </Link>

                                {/* Desktop Nav */}
                                <nav className="hidden md:flex items-center gap-6">
                                    <NavLink to="/">Beranda</NavLink>
                                    <NavLink to="/seller">{hasStore ? 'Toko Saya' : 'Buat Toko'}</NavLink>
                                    {token && (
                                        <>
                                            <NavLink to="/orders"><PackageOpen size={15} /> Pesanan Saya</NavLink>
                                            <NavLink to="/chat"><MessageSquare size={15} /> Chat</NavLink>
                                        </>
                                    )}
                                </nav>

                                {/* Search bar - only on home page */}
                                <SearchBar />

                                {/* Right Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Bell notification */}
                                    {token && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                                className="relative p-2 text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200"
                                            >
                                                <Bell size={20} />
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulse">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </button>

                                            {isNotifOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-fade-in-up">
                                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                                            <h3 className="font-bold text-slate-800">Notifikasi</h3>
                                                            {unreadCount > 0 && <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">{unreadCount} baru</span>}
                                                        </div>
                                                        <div className="max-h-80 overflow-y-auto">
                                                            {notifications.length === 0 ? (
                                                                <div className="p-8 text-center text-slate-500 text-sm">
                                                                    <Bell size={28} className="mx-auto mb-2 text-slate-300" />
                                                                    Tidak ada notifikasi
                                                                </div>
                                                            ) : (
                                                                notifications.map(n => (
                                                                    <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read_at ? 'bg-indigo-50/40' : ''}`}>
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <span className="font-semibold text-sm text-slate-800">{n.data?.sender_name || 'Sistem'}</span>
                                                                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">{n.data?.message}</p>
                                                                        {!n.read_at && (
                                                                            <div className="flex gap-3">
                                                                                {n.data?.conversation_uid && (
                                                                                    <Link to={`/chat?conv_id=${n.data.conversation_uid}`} onClick={() => markAsRead(n.id)} className="text-[11px] text-indigo-600 font-semibold hover:underline">Balas →</Link>
                                                                                )}
                                                                                <button onClick={() => markAsRead(n.id)} className="text-[11px] text-slate-400 hover:text-slate-600">Tandai dibaca</button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Cart */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative p-2 text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200 md:flex items-center gap-1.5 hidden"
                                    >
                                        <ShoppingCart size={20} />
                                        <span className="text-sm font-medium">Keranjang</span>
                                        {totalCartItems > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                                {totalCartItems}
                                            </span>
                                        )}
                                    </button>

                                    {/* Auth */}
                                    <div className="hidden md:flex items-center gap-2">
                                        {token ? (
                                            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200">
                                                <LogOut size={16} /> Keluar
                                            </button>
                                        ) : (
                                            <>
                                                <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200 flex items-center gap-1.5">
                                                    <LogIn size={16} /> Masuk
                                                </Link>
                                                <Link to="/register" className="px-4 py-1.5 text-sm font-semibold bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-sm flex items-center gap-1.5">
                                                    <UserPlus size={15} /> Daftar
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile menu button */}
                                    <button className="md:hidden p-2 text-indigo-200 hover:text-white hover:bg-white/15 rounded-xl transition-all" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu */}
                        {isMobileMenuOpen && (
                            <div className="md:hidden border-t border-white/10 bg-indigo-800/50 backdrop-blur-sm">
                                <div className="px-4 py-3 space-y-1">
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition">Beranda</Link>
                                    <Link to="/seller" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition">{hasStore ? 'Toko Saya' : 'Buat Toko'}</Link>
                                    {token && (
                                        <>
                                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition">Pesanan Saya</Link>
                                            <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition">Chat</Link>
                                        </>
                                    )}
                                    <div className="border-t border-white/10 pt-2 mt-2 flex items-center gap-3">
                                        <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1.5 text-sm text-indigo-200 px-3 py-2">
                                            <ShoppingCart size={16} /> Keranjang {totalCartItems > 0 && `(${totalCartItems})`}
                                        </button>
                                        {token ? (
                                            <button onClick={handleLogout} className="text-sm text-indigo-200 px-3 py-2 flex items-center gap-1.5">
                                                <LogOut size={16} /> Keluar
                                            </button>
                                        ) : (
                                            <>
                                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-indigo-200 px-3 py-2">Masuk</Link>
                                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold bg-white text-indigo-700 px-3 py-2 rounded-lg">Daftar</Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
                        <Route path="/product/:uid" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/register" element={<Register setToken={setToken} />} />
                        <Route path="/seller" element={<SellerDashboard token={token} />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/orders/:uid" element={<OrderDetail />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

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
