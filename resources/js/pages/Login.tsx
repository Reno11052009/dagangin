import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

interface AuthProps {
    setToken: (token: string) => void;
}

function Login({ setToken }: AuthProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
                            <Input
                                label="Alamat Email"
                                type="email"
                                required
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={16} />}
                            />
                            
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Min. 8 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock size={16} />}
                                rightIcon={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={loading}
                                leftIcon={<LogIn size={17} />}
                                className="mt-2"
                            >
                                Masuk Sekarang
                            </Button>
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
