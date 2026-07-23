# Dagangin Marketplace

**Dagangin** is a modern, full-stack marketplace web application (similar to Shopee / Tokopedia) built with **Laravel 12** and **React 19**. It connects sellers and buyers in a single, integrated e-commerce platform with real-time chat, live notifications, and secure payment processing.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register & login with secure token-based auth (Laravel Sanctum) |
| 🏪 **Seller Dashboard** | Open a store, manage product listings with multi-image support |
| 🛍️ **Product Catalog** | Browse all products with category filtering and live search |
| 🔍 **Product Search** | Real-time search from the homepage with URL query sync |
| 🛒 **Shopping Cart** | Add/remove items, view cart totals in a slide-out drawer |
| 💳 **Checkout & Payment** | Integrated with Midtrans Snap (Sandbox) for secure payments |
| 💬 **Live Chat** | Real-time buyer ↔ seller messaging via WebSockets |
| 🔔 **Live Notifications** | Real-time bell notifications and toast popups for new messages |
| 📱 **Responsive Design** | Mobile-first UI with a hamburger menu and responsive layouts |

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Backend | Laravel | 13 |
| Frontend | React | 19 |
| Build Tool | Vite + laravel-vite-plugin | 8.x |
| Language | TypeScript | 7.x |
| Styling | Tailwind CSS | v4 |
| Database | PostgreSQL | — |
| Auth | Laravel Sanctum | — |
| Real-Time | Pusher + Laravel Echo | 8.x / 2.x |
| Payment | Midtrans Snap API | Sandbox |
| HTTP Client | Axios | 1.x |
| Icons | Lucide React | 1.x |
| Alerts | SweetAlert2 | 11.x |

---

## 📋 Requirements

- **PHP** 8.3
- **Composer**
- **Node.js** & **npm**
- **PostgreSQL**
- A [Pusher](https://pusher.com/) account (free tier works)
- A [Midtrans](https://midtrans.com/) Sandbox account

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Reno11052009/dagangin.git
cd dagangin
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and configure the sections below.

### 4. Run migrations

```bash
php artisan migrate --seed
```

### 5. Start the development servers

Open **two** terminal windows:

```bash
# Terminal 1 — Laravel backend
php artisan serve

# Terminal 2 — Vite frontend
npm run dev
```

### 6. Open the app

Navigate to **http://localhost:8000** in your browser.

---

## ⚙️ Environment Configuration

### Database

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=dagangin
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### Midtrans (Payment Gateway)

Get your sandbox keys from the [Midtrans Dashboard](https://dashboard.sandbox.midtrans.com/).

```env
MIDTRANS_SERVER_KEY="your_sandbox_server_key"
MIDTRANS_CLIENT_KEY="your_sandbox_client_key"
MIDTRANS_IS_PRODUCTION=false
```

### Pusher (Real-Time Chat & Notifications)

Get your credentials from the [Pusher Dashboard](https://dashboard.pusher.com/).

```env
BROADCAST_CONNECTION=pusher

PUSHER_APP_ID="your_pusher_app_id"
PUSHER_APP_KEY="your_pusher_app_key"
PUSHER_APP_SECRET="your_pusher_app_secret"
PUSHER_APP_CLUSTER="ap1"

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

---

## 🗂️ Project Structure

```
dagangin/
├── app/
│   ├── Http/Controllers/Api/   # API controllers (Cart, Chat, Checkout, ...)
│   ├── Models/                 # Eloquent models
│   └── Events/                 # Broadcasting events (MessageSent, ...)
├── routes/
│   ├── api.php                 # All REST API endpoints
│   └── web.php                 # SPA entry point
├── resources/
│   ├── js/
│   │   ├── app.tsx             # React root, routing, navbar, Echo setup
│   │   ├── pages/              # Page components (Home, Cart, Chat, ...)
│   │   └── types/              # Shared TypeScript types
│   └── views/
│       └── welcome.blade.php   # Laravel Blade SPA entry (loads React + Midtrans script)
└── vite.config.js              # Vite + Laravel plugin configuration
```

---

## 🔌 API Reference

All protected routes require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/login` | No | Login and receive a token |
| `POST` | `/api/register` | No | Register a new user |
| `POST` | `/api/logout` | ✅ | Revoke the current token |
| `GET` | `/api/user` | ✅ | Get the authenticated user |

### Products & Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | No | List all products |
| `GET` | `/api/products/{id}` | No | Get a single product |
| `GET` | `/api/categories` | No | List all categories |

### Store (Seller)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/my-store` | ✅ | Get the seller's store |
| `POST` | `/api/stores` | ✅ | Create a new store |
| `POST` | `/api/stores/products` | ✅ | Add a product to the store |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cart` | ✅ | Get cart contents |
| `POST` | `/api/cart/items` | ✅ | Add an item to the cart |
| `DELETE` | `/api/cart/items/{id}` | ✅ | Remove an item from the cart |

### Checkout

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/checkout` | ✅ | Create a Midtrans Snap transaction |

### Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/conversations` | ✅ | List all conversations |
| `POST` | `/api/conversations` | ✅ | Start a new conversation |
| `GET` | `/api/conversations/{id}/messages` | ✅ | Get messages in a conversation |
| `POST` | `/api/conversations/{id}/messages` | ✅ | Send a message |

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | ✅ | List all notifications |
| `POST` | `/api/notifications/{id}/read` | ✅ | Mark a notification as read |

---

## 📄 License

This project is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).
