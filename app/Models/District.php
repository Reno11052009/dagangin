<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $guarded = [];

    public $incrementing = false;
    protected $keyType = 'int';

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function subdistricts()
    {
        return $this->hasMany(Subdistrict::class);
    }
}
