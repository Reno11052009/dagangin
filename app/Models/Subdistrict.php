<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subdistrict extends Model
{
    protected $guarded = [];

    public $incrementing = false;
    protected $keyType = 'int';

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
