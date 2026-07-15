<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasUuids;

    protected $primaryKey = 'uid';

    protected $fillable = ['store_uid', 'category_uid', 'name', 'description', 'price', 'stock', 'image', 'images', 'views'];

    protected function casts(): array
    {
        return [
            'images' => 'array',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_uid', 'uid');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_uid', 'uid');
    }
}
