import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

    return (
        <div className="flex justify-center items-center py-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Daftar Dagangin</h1>
                
                {errors?.general && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            // placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors?.name && <span className="text-red-500 text-xs mt-1">{errors.name[0]}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            // placeholder="nama@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors?.email && <span className="text-red-500 text-xs mt-1">{errors.email[0]}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            placeholder="Min. 8 karakter"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors?.password && <span className="text-red-500 text-xs mt-1">{errors.password[0]}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password</label>
                        <input 
                            type="password" 
                            name="password_confirmation"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                            placeholder="Ketik ulang password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-400 mt-2"
                    >
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
