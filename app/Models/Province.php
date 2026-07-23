<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $guarded = [];

    // Jika ID dari RajaOngkir bukan auto increment
    public $incrementing = false;
    protected $keyType = 'int';

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
