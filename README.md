# Dagangin Marketplace

Dagangin is a modern, lightweight marketplace application built with Laravel and React. It allows users to register, open their own stores, list products, and allows other users to purchase those products.

## Features

- **User Authentication**: Secure registration and login.
- **Store Management (Seller Dashboard)**: Users can easily create a store and manage their product listings.
- **Product Catalog**: Browse and search through all products available on the platform.
- **Shopping Cart**: Add products to a cart and review them before purchasing.
- **Secure Checkout**: Integrated with Midtrans (Sandbox) for processing payments securely.

## Technology Stack

- **Backend**: Laravel (PHP)
- **Frontend**: React (via Vite)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **Payment Gateway**: Midtrans Snap API

## Requirements

- PHP >= 8.2
- Composer
- Node.js & npm
- PostgreSQL

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Reno11052009/dagangin.git
   cd dagangin
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   Copy `.env.example` to `.env` and configure your database and Midtrans credentials:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Run Migrations & Seeders**
   ```bash
   php artisan migrate --seed
   ```

6. **Start the Development Servers**
   You will need two terminal tabs/windows:
   
   For Laravel backend:
   ```bash
   php artisan serve
   ```
   
   For Vite frontend:
   ```bash
   npm run dev
   ```

7. **Access the Application**
   Open your browser and navigate to `http://localhost:8000`.

## API Integration Note (Midtrans)

To test the checkout process, make sure to set up your Midtrans sandbox credentials in your `.env` file:
```env
MIDTRANS_SERVER_KEY="your_sandbox_server_key"
MIDTRANS_CLIENT_KEY="your_sandbox_client_key"
MIDTRANS_IS_PRODUCTION=false
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
