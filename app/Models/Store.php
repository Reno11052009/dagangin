<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Store extends Model
{
    use HasUuids;

    protected $primaryKey = 'uid';

    protected $fillable = ['user_uid', 'name', 'description', 'province_id', 'city_id', 'subdistrict_id', 'address'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_uid', 'uid');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'store_uid', 'uid');
    }
}
