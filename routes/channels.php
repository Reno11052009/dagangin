<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversation_uid}', function ($user, $conversation_uid) {
    $conversation = \App\Models\Conversation::find($conversation_uid);
    if (!$conversation) return false;
    $storeUid = $user->store?->uid;
    return $user->uid === $conversation->user_uid || $storeUid === $conversation->store_uid;
});
