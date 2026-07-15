<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Elektronik',
            'Pakaian Pria',
            'Pakaian Wanita',
            'Handphone & Aksesoris',
            'Komputer & Aksesoris',
            'Perlengkapan Rumah',
            'Kesehatan',
            'Kecantikan',
            'Olahraga & Outdoor',
            'Otomotif'
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create([
                'name' => $category,
                'slug' => \Illuminate\Support\Str::slug($category)
            ]);
        }
    }
}
