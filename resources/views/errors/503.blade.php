<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>503 — Sedang Dalam Pemeliharaan | Dagangin</title>
    <meta name="description" content="Dagangin sedang dalam pemeliharaan. Kami akan segera kembali. Terima kasih atas kesabaranmu.">
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
            /* Warmer amber/orange gradient to distinguish from 404 */
            background: linear-gradient(135deg, #1c1917 0%, #292524 30%, #1e1b4b 100%);
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
        .blob-1 { width: 420px; height: 420px; top: -12%; left: -8%; background: rgba(245,158,11,0.12); animation-duration: 10s; }
        .blob-2 { width: 360px; height: 360px; bottom: -12%; right: -6%; background: rgba(99,102,241,0.14); animation-duration: 12s; animation-delay: 2.5s; }
        .blob-3 { width: 250px; height: 250px; top: 50%; left: 50%; background: rgba(239,68,68,0.08); animation-duration: 8s; animation-delay: 1s; }

        /* Dot grid */
        .dot-grid {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
        }

        /* Floating shapes */
        .shape {
            position: absolute;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(4px);
            animation: float ease-in-out infinite;
        }

        /* Main card */
        .card {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 0 24px;
            max-width: 520px;
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
            background: rgba(245,158,11,0.12);
            border: 1px solid rgba(245,158,11,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(12px);
            box-shadow: 0 0 60px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .icon-ring {
            position: absolute;
            inset: 0;
            border-radius: 28px;
            border: 2px solid rgba(245,158,11,0.25);
            animation: pulseRing 2.5s ease-out infinite;
        }
        .icon-svg {
            width: 52px;
            height: 52px;
            stroke: #fcd34d;
            fill: none;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Spinning gear overlay */
        .gear-spin {
            animation: spin 6s linear infinite;
            transform-origin: center;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 503 number */
        .error-code {
            font-size: clamp(76px, 14vw, 108px);
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #fcd34d 0%, #fb923c 50%, #f87171 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 40px rgba(251,191,36,0.35));
            margin-bottom: 8px;
        }

        h1 {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
        }

        .description {
            color: #d1d5db;
            font-size: 14px;
            line-height: 1.7;
            margin-bottom: 32px;
        }

        /* Status bar */
        .status-bar {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(245,158,11,0.12);
            border: 1px solid rgba(245,158,11,0.2);
            border-radius: 999px;
            padding: 8px 18px;
            font-size: 12px;
            color: #fcd34d;
            backdrop-filter: blur(8px);
            margin-bottom: 32px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #fbbf24;
            animation: statusPulse 1.5s ease-in-out infinite;
            flex-shrink: 0;
        }
        @keyframes statusPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.75); }
        }

        /* Progress bar */
        .progress-wrap {
            background: rgba(255,255,255,0.08);
            border-radius: 999px;
            height: 4px;
            overflow: hidden;
            margin-bottom: 36px;
        }
        .progress-bar {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #fbbf24, #f97316);
            animation: progressAnim 3s ease-in-out infinite alternate;
        }
        @keyframes progressAnim {
            from { width: 20%; }
            to { width: 85%; }
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
        .btn-refresh {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            box-shadow: 0 8px 24px rgba(245,158,11,0.3);
        }
        .btn-refresh:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,158,11,0.4); }
        .btn-refresh:hover .refresh-icon { animation: spinOnce 0.6s ease-in-out; }
        @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .btn-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            color: #d1d5db;
            font-weight: 500;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
        }
        .btn-status:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); color: #fff; }

        /* Auto-retry countdown */
        .retry-hint {
            margin-top: 32px;
            font-size: 11px;
            color: rgba(156,163,175,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .retry-num { color: #fbbf24; font-weight: 600; }

        /* Divider */
        .divider {
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid rgba(255,255,255,0.08);
            font-size: 11px;
            color: rgba(156,163,175,0.5);
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
            0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.35); }
            70% { box-shadow: 0 0 0 14px rgba(245,158,11,0); }
            100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
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
    <div class="shape" style="width:64px;height:64px;top:8%;left:7%;animation-duration:6s;animation-delay:0s;"></div>
    <div class="shape" style="width:90px;height:90px;top:18%;right:7%;animation-duration:9s;animation-delay:1.2s;"></div>
    <div class="shape" style="width:48px;height:48px;top:70%;left:5%;animation-duration:5s;animation-delay:2s;"></div>
    <div class="shape" style="width:72px;height:72px;bottom:14%;right:8%;animation-duration:7s;animation-delay:0.8s;"></div>

    <!-- Main Content -->
    <div class="card">
        <!-- Icon -->
        <div class="icon-wrap">
            <div class="icon-box">
                <div class="icon-ring"></div>
                <!-- Wrench/Tool icon -->
                <svg class="icon-svg" viewBox="0 0 24 24">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
            </div>
        </div>

        <!-- Error Code -->
        <div class="error-code">503</div>

        <!-- Title -->
        <h1>Sedang Dalam Pemeliharaan</h1>

        <!-- Description -->
        <p class="description">
            Kami sedang melakukan pembaruan untuk memberikan pengalaman belanja<br>
            yang lebih baik. Mohon tunggu sebentar, <strong style="color:#fcd34d;">Dagangin</strong> akan segera kembali! 🛠️
        </p>

        <!-- Status Badge -->
        <div style="margin-bottom: 16px;">
            <div class="status-bar">
                <div class="status-dot"></div>
                <span>Sistem sedang dalam pemeliharaan terjadwal</span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-wrap">
            <div class="progress-bar"></div>
        </div>

        <!-- Buttons -->
        <div class="btn-group">
            <button class="btn-refresh" onclick="location.reload()">
                <svg class="refresh-icon" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Coba Lagi
            </button>
            <a href="https://dagangin.com" class="btn-status">
                <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Cek Status Layanan
            </a>
        </div>

        <!-- Auto retry countdown -->
        <div class="retry-hint">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Halaman akan dicoba otomatis dalam
            <span class="retry-num" id="retry-cntd">30</span>
            detik
        </div>

        <!-- Footer -->
        <div class="divider">
            &copy; {{ date('Y') }} Dagangin &nbsp;·&nbsp; Kami mohon maaf atas ketidaknyamanannya
        </div>
    </div>

    <script>
        // Auto-retry countdown (30s)
        let t = 30;
        const el = document.getElementById('retry-cntd');
        const interval = setInterval(() => {
            t--;
            el.textContent = t;
            if (t <= 0) { clearInterval(interval); location.reload(); }
        }, 1000);
    </script>
</body>
</html>
