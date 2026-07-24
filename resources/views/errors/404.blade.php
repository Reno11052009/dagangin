<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 — Halaman Tidak Ditemukan | Dagangin</title>
    <meta name="description" content="Halaman yang kamu cari tidak ditemukan. Kembali ke Dagangin dan temukan produk terbaik.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%);
            position: relative;
        }

        /* Animated blobs */
        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            animation: float ease-in-out infinite;
        }
        .blob-1 { width: 450px; height: 450px; top: -15%; left: -10%; background: rgba(99,102,241,0.18); animation-duration: 9s; }
        .blob-2 { width: 380px; height: 380px; bottom: -12%; right: -8%; background: rgba(139,92,246,0.15); animation-duration: 11s; animation-delay: 2s; }
        .blob-3 { width: 220px; height: 220px; top: 40%; left: 45%; background: rgba(236,72,153,0.10); animation-duration: 7s; animation-delay: 1s; }

        /* Dot grid */
        .dot-grid {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
        }

        /* Floating shapes */
        .shape {
            position: absolute;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(4px);
            animation: float ease-in-out infinite;
        }

        /* Main card */
        .card {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 24px;
            max-width: 500px;
            width: 100%;
            animation: fadeInUp 0.65s ease-out forwards;
        }

        /* Icon box */
        .icon-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 28px;
        }
        .icon-box {
            position: relative;
            width: 112px;
            height: 112px;
            border-radius: 28px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(12px);
            box-shadow: 0 0 60px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .icon-ring {
            position: absolute;
            inset: 0;
            border-radius: 28px;
            border: 2px solid rgba(129,140,248,0.3);
            animation: pulseRing 2.5s ease-out infinite;
        }
        .icon-svg {
            width: 52px;
            height: 52px;
            color: #c7d2fe;
            stroke: currentColor;
            fill: none;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* 404 number */
        .error-code {
            font-size: clamp(80px, 15vw, 112px);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #f0abfc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 40px rgba(167,139,250,0.4));
            margin-bottom: 8px;
        }

        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
        }

        .description {
            color: #a5b4fc;
            font-size: 14px;
            line-height: 1.7;
            margin-bottom: 32px;
        }

        /* Countdown pill */
        .countdown-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 999px;
            padding: 10px 20px;
            font-size: 13px;
            color: #c7d2fe;
            backdrop-filter: blur(8px);
            margin-bottom: 32px;
        }
        .countdown-num {
            font-weight: 700;
            color: #fff;
            background: rgba(99,102,241,0.5);
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-variant-numeric: tabular-nums;
            min-width: 28px;
        }

        /* Buttons */
        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
        }
        @media (min-width: 500px) {
            .btn-group { flex-direction: row; justify-content: center; }
        }
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #fff;
            color: #3730a3;
            font-weight: 600;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
        .btn-primary:hover { background: #eef2ff; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            font-weight: 500;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }

        /* Footer hint */
        .footer-hint {
            margin-top: 40px;
            padding-top: 28px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 11px;
            color: rgba(165,180,252,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        /* Keyframes */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(129,140,248,0.4); }
            70% { box-shadow: 0 0 0 14px rgba(129,140,248,0); }
            100% { box-shadow: 0 0 0 0 rgba(129,140,248,0); }
        }
        @keyframes countdown-tick {
            0% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .tick { animation: countdown-tick 0.3s ease-out; }
    </style>
</head>
<body>
    <!-- Blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <!-- Grid -->
    <div class="dot-grid"></div>
    <!-- Floating shapes -->
    <div class="shape" style="width:64px;height:64px;top:10%;left:8%;animation-duration:6s;animation-delay:0s;"></div>
    <div class="shape" style="width:96px;height:96px;top:20%;right:6%;animation-duration:8s;animation-delay:1s;"></div>
    <div class="shape" style="width:44px;height:44px;top:65%;left:4%;animation-duration:5s;animation-delay:2s;"></div>
    <div class="shape" style="width:80px;height:80px;bottom:18%;right:9%;animation-duration:7s;animation-delay:0.5s;"></div>

    <!-- Main Content -->
    <div class="card">
        <!-- Icon -->
        <div class="icon-wrap">
            <div class="icon-box">
                <div class="icon-ring"></div>
                <svg class="icon-svg" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
            </div>
        </div>

        <!-- Error Code -->
        <div class="error-code">404</div>

        <!-- Title -->
        <h1>Halaman Tidak Ditemukan</h1>

        <!-- Description -->
        <p class="description">
            Ups! Halaman yang kamu cari tidak ada atau mungkin sudah dipindahkan.<br>
            Jangan khawatir, kamu bisa kembali ke Dagangin.
        </p>

        <!-- Countdown -->
        <div class="countdown-pill">
            <span>Kembali otomatis dalam</span>
            <span class="countdown-num" id="cntd">10</span>
            <span>detik</span>
        </div>

        <!-- Buttons -->
        <div class="btn-group">
            <a href="/" class="btn-primary">
                <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Kembali ke Beranda
            </a>
            <a href="javascript:history.back()" class="btn-secondary">
                <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Halaman Sebelumnya
            </a>
        </div>

        <!-- Footer -->
        <div class="footer-hint">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Coba cari produk yang kamu inginkan di beranda
        </div>
    </div>

    <script>
        let t = 10;
        const el = document.getElementById('cntd');
        const interval = setInterval(() => {
            t--;
            el.textContent = t;
            el.classList.remove('tick');
            void el.offsetWidth; // reflow
            el.classList.add('tick');
            if (t <= 0) { clearInterval(interval); window.location.href = '/'; }
        }, 1000);
    </script>
</body>
</html>
