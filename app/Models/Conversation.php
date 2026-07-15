<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Conversation extends Model
{
    use HasUuids;

    protected $primaryKey = 'uid';
    protected $fillable = ['user_uid', 'store_uid'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_uid', 'uid');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_uid', 'uid');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_uid', 'uid');
    }
}
