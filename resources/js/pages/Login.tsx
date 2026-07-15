import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
        <div className="flex justify-center items-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login ke Dagangin</h1>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            // placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            placeholder="min 8 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Belum punya akun? <Link to="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
