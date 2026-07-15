import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Store } from 'lucide-react';

interface AuthProps {
    setToken: (token: string) => void;
}

function Register({ setToken }: AuthProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<any>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        axios.post('/api/register', formData)
            .then(res => {
                const newToken = res.data.access_token;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                navigate('/');
            })
            .catch(err => {
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    setErrors({ general: [err.response?.data?.message || 'Registrasi gagal.'] });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fields = [
        { name: 'name', label: 'Nama Lengkap', type: 'text', icon: <User size={16} />, placeholder: 'John Doe' },
        { name: 'email', label: 'Alamat Email', type: 'email', icon: <Mail size={16} />, placeholder: 'nama@email.com' },
        { name: 'password', label: 'Password', type: 'password', icon: <Lock size={16} />, placeholder: 'Min. 8 karakter' },
        { name: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', icon: <Lock size={16} />, placeholder: 'Ketik ulang password' },
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Top gradient accent */}
                    <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

                    <div className="p-8">
                        {/* Logo mark */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                                <Store size={26} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-800">Buat Akun Baru</h1>
                            <p className="text-slate-500 text-sm mt-1">Bergabung bersama ribuan pengguna Dagangin</p>
                        </div>

                        {errors?.general && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-sm mb-5 flex items-start gap-2">
                                <span className="mt-0.5">⚠</span>
                                {errors.general[0]}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            {fields.map(field => (
                                <div key={field.name}>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</span>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            required
                                            placeholder={field.placeholder}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all input-glow"
                                            value={(formData as any)[field.name]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors?.[field.name] && (
                                        <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            ⚠ {errors[field.name][0]}
                                        </span>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <UserPlus size={17} />
                                )}
                                {loading ? 'Membuat Akun...' : 'Daftar Sekarang'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                Masuk di sini →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
