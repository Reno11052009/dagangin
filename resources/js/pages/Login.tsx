import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, Store } from 'lucide-react';

interface AuthProps {
    setToken: (token: string) => void;
}

function Login({ setToken }: AuthProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        axios.post('/api/login', { email, password })
            .then(res => {
                const newToken = res.data.access_token;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                navigate('/');
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Top gradient accent */}
                    <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

                    <div className="p-8">
                        {/* Logo mark */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg mb-4">
                                <Store size={26} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-800">Selamat Datang Kembali</h1>
                            <p className="text-slate-500 text-sm mt-1">Masuk ke akun Dagangin Anda</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-sm mb-5 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">⚠</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="nama@email.com"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all input-glow"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min. 8 karakter"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all input-glow"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <LogIn size={17} />
                                )}
                                {loading ? 'Memproses...' : 'Masuk Sekarang'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                Daftar gratis →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
