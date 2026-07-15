<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;

class SellerFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_seller_flow()
    {
        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'icon' => 'zap'
        ]);

        // Register Seller
        $response = $this->postJson('/api/register', [
            'name' => 'Seller',
            'email' => 'seller@test.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ]);
        $token = $response->json('access_token');

        // Create Store
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/stores', [
                             'name' => 'My Awesome Store',
                             'description' => 'Best store ever'
                         ]);
        $response->dump();
        $response->assertStatus(201);

        // Add Product
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/stores/products', [
                             'name' => 'Smartphone',
                             'description' => 'A smart phone',
                             'price' => 5000000,
                             'stock' => 10,
                             'category_uid' => $category->uid
                         ]);
        $response->dump();
        $response->assertStatus(201);
    }
}
