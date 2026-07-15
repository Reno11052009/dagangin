<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Message extends Model
{
    use HasUuids;

    protected $primaryKey = 'uid';
    protected $fillable = ['conversation_uid', 'sender_uid', 'message', 'is_read'];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_uid', 'uid');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_uid', 'uid');
    }
}
