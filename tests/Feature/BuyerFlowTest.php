<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Support\Facades\Hash;

class BuyerFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_flow()
    {
        $seller = User::create([
            'name' => 'Seller',
            'email' => 'seller@test.com',
            'password' => Hash::make('password')
        ]);

        $store = Store::create([
            'user_uid' => $seller->uid,
            'name' => 'Test Store',
            'description' => 'A store'
        ]);

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'icon' => 'zap'
        ]);

        $product = Product::create([
            'store_uid' => $store->uid,
            'category_uid' => $category->uid,
            'name' => 'Laptop',
            'description' => 'Fast laptop',
            'price' => 10000000,
            'stock' => 10,
        ]);

        // Register Buyer
        $response = $this->postJson('/api/register', [
            'name' => 'Buyer',
            'email' => 'buyer@test.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ]);
        
        $response->assertStatus(200)->assertJsonStructure(['access_token']);
        $token = $response->json('access_token');

        // Add to Cart
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/cart/items', [
                             'product_uid' => $product->uid,
                             'quantity' => 1
                         ]);
        $response->assertSuccessful();

        // View Cart
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson('/api/cart');
        $response->assertStatus(200);

        // Checkout
        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/checkout', [
                             'address' => 'Test Address'
                         ]);
        $response->assertSuccessful()->assertJsonStructure(['snap_token']);
    }
}
