import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Frown } from 'lucide-react';

const floatingShapes = [
    { size: 60, top: '10%', left: '8%', delay: '0s', duration: '6s', opacity: 0.06 },
    { size: 100, top: '20%', right: '5%', delay: '1s', duration: '8s', opacity: 0.05 },
    { size: 40, top: '60%', left: '3%', delay: '2s', duration: '5s', opacity: 0.07 },
    { size: 80, bottom: '15%', right: '10%', delay: '0.5s', duration: '7s', opacity: 0.05 },
    { size: 50, bottom: '30%', left: '15%', delay: '1.5s', duration: '9s', opacity: 0.06 },
];

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute rounded-full bg-indigo-500 blur-3xl"
                    style={{ width: 400, height: 400, top: '-10%', left: '-10%', opacity: 0.15, animation: 'float 8s ease-in-out infinite' }}
                />
                <div
                    className="absolute rounded-full bg-violet-500 blur-3xl"
                    style={{ width: 350, height: 350, bottom: '-10%', right: '-5%', opacity: 0.12, animation: 'float 10s ease-in-out infinite 2s' }}
                />
                <div
                    className="absolute rounded-full bg-pink-500 blur-3xl"
                    style={{ width: 200, height: 200, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.08, animation: 'float 6s ease-in-out infinite 1s' }}
                />
                {/* Floating geometric shapes */}
                {floatingShapes.map((s, i) => (
                    <div
                        key={i}
                        className="absolute rounded-2xl border border-white/10 bg-white/5"
                        style={{
                            width: s.size, height: s.size,
                            top: (s as any).top, bottom: (s as any).bottom,
                            left: (s as any).left, right: (s as any).right,
                            opacity: s.opacity,
                            animation: `float ${s.duration} ease-in-out infinite ${s.delay}`,
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                ))}
            </div>

            {/* Dot grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-lg mx-auto" style={{ animation: 'fade-in-up 0.6s ease-out forwards' }}>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div
                            className="w-28 h-28 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm"
                            style={{ boxShadow: '0 0 60px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                        >
                            <Frown size={52} className="text-indigo-200" strokeWidth={1.5} />
                        </div>
                        {/* Pulse ring */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-indigo-400/30" style={{ animation: 'pulse-ring 2.5s ease-out infinite' }} />
                    </div>
                </div>

                {/* 404 Number */}
                <div className="mb-3 relative">
                    <span
                        className="block text-[7rem] font-black leading-none tracking-tighter"
                        style={{
                            background: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #f0abfc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 40px rgba(167,139,250,0.4))',
                        }}
                    >
                        404
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-3">
                    Halaman Tidak Ditemukan
                </h1>

                {/* Description */}
                <p className="text-indigo-300 text-sm leading-relaxed mb-8">
                    Ups! Halaman yang kamu cari tidak ada atau mungkin sudah dipindahkan.<br />
                    Jangan khawatir, kamu bisa kembali ke beranda.
                </p>

                {/* Countdown */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-5 py-2.5 text-sm text-indigo-200 backdrop-blur-sm">
                        <span>Kembali otomatis dalam</span>
                        <span
                            className="font-bold text-white bg-indigo-500/50 rounded-full w-7 h-7 flex items-center justify-center text-sm tabular-nums"
                            style={{ minWidth: 28 }}
                        >
                            {countdown}
                        </span>
                        <span>detik</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Home size={17} />
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/15 transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5"
                    >
                        <ArrowLeft size={17} />
                        Halaman Sebelumnya
                    </button>
                </div>

                {/* Search suggestion */}
                <div className="mt-10 pt-8 border-t border-white/10">
                    <p className="text-xs text-indigo-400/70 flex items-center justify-center gap-1.5">
                        <Search size={12} />
                        Coba cari produk yang kamu inginkan di beranda
                    </p>
                </div>
            </div>
        </div>
    );
}
