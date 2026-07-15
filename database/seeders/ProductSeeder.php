<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = \App\Models\User::firstOrCreate(
            ['email' => 'seller1@example.com'],
            ['name' => 'Seller Satu', 'password' => \Illuminate\Support\Facades\Hash::make('password')]
        );

        $store1 = \App\Models\Store::firstOrCreate(
            ['user_uid' => $user1->uid],
            ['name' => 'Toko Gadget Super', 'description' => 'Toko terpercaya untuk segala kebutuhan gadget Anda.']
        );

        $user2 = \App\Models\User::firstOrCreate(
            ['email' => 'seller2@example.com'],
            ['name' => 'Seller Dua', 'password' => \Illuminate\Support\Facades\Hash::make('password')]
        );

        $store2 = \App\Models\Store::firstOrCreate(
            ['user_uid' => $user2->uid],
            ['name' => 'Fashion Kekinian', 'description' => 'Pakaian trendy untuk pria dan wanita.']
        );

        $categories = \App\Models\Category::all();
        if ($categories->isEmpty()) {
            $this->call(CategorySeeder::class);
            $categories = \App\Models\Category::all();
        }

        $elektronik = $categories->where('name', 'Elektronik')->first() ?? $categories->first();
        $pakaian = $categories->where('name', 'Pakaian Pria')->first() ?? $categories->first();

        $products = [
            [
                'store_uid' => $store1->uid,
                'category_uid' => $elektronik->uid,
                'name' => 'Smartphone Keren X1',
                'description' => 'Smartphone terbaru dengan RAM 8GB dan memori 128GB. Garansi resmi 1 tahun.',
                'price' => 2500000,
                'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
            ],
            [
                'store_uid' => $store1->uid,
                'category_uid' => $elektronik->uid,
                'name' => 'Headset Bluetooth Pro',
                'description' => 'Suara jernih dengan fitur noise cancelling. Baterai tahan 24 jam.',
                'price' => 350000,
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            ],
            [
                'store_uid' => $store2->uid,
                'category_uid' => $pakaian->uid,
                'name' => 'Kemeja Flanel Casual',
                'description' => 'Kemeja bahan flanel premium, nyaman dipakai sehari-hari.',
                'price' => 125000,
                'stock' => 30,
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80',
            ],
            [
                'store_uid' => $store2->uid,
                'category_uid' => $pakaian->uid,
                'name' => 'Jaket Denim Pria',
                'description' => 'Jaket denim tebal dan awet. Tampil gaya setiap saat.',
                'price' => 210000,
                'stock' => 20,
                'image' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80',
            ],
            [
                'store_uid' => $store2->uid,
                'category_uid' => $elektronik->uid,
                'name' => 'Smartwatch Ultra Series',
                'description' => 'Tampil elegan dengan smartwatch canggih. Deteksi detak jantung, sleep tracking, dan anti air.',
                'price' => 1500000,
                'stock' => 10,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::create($product);
        }
    }
}
