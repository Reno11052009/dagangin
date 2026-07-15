<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Store;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $storeUid = $user->store?->uid;

        $query = Conversation::with(['user', 'store']);
        
        if ($storeUid) {
            $query->where('user_uid', $user->uid)->orWhere('store_uid', $storeUid);
        } else {
            $query->where('user_uid', $user->uid);
        }

        $conversations = $query->get();

        $conversations->each(function ($conv) use ($user) {
            $conv->last_message = $conv->messages()->orderBy('created_at', 'desc')->first();
            $conv->unread_count = $conv->messages()
                ->where('is_read', false)
                ->where('sender_uid', '!=', $user->uid)
                ->count();
        });

        $conversations = $conversations->sortByDesc(function ($conv) {
            return $conv->last_message ? $conv->last_message->created_at : $conv->created_at;
        })->values();

        return response()->json($conversations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_uid' => 'required|exists:stores,uid'
        ]);

        $user = $request->user();
        
        if ($user->store && $user->store->uid === $request->store_uid) {
            return response()->json(['message' => 'Cannot chat with your own store'], 400);
        }

        $conversation = Conversation::firstOrCreate([
            'user_uid' => $user->uid,
            'store_uid' => $request->store_uid
        ]);

        return response()->json($conversation, 201);
    }

    public function getMessages(Request $request, $id)
    {
        $user = $request->user();
        $storeUid = $user->store?->uid;

        $conversation = Conversation::where('uid', $id)
            ->where(function ($query) use ($user, $storeUid) {
                $query->where('user_uid', $user->uid);
                if ($storeUid) {
                    $query->orWhere('store_uid', $storeUid);
                }
            })->firstOrFail();

        Message::where('conversation_uid', $conversation->uid)
            ->where('sender_uid', '!=', $user->uid)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = Message::with('sender')
            ->where('conversation_uid', $conversation->uid)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $user = $request->user();
        $storeUid = $user->store?->uid;

        $conversation = Conversation::where('uid', $id)
            ->where(function ($query) use ($user, $storeUid) {
                $query->where('user_uid', $user->uid);
                if ($storeUid) {
                    $query->orWhere('store_uid', $storeUid);
                }
            })->firstOrFail();

        $message = Message::create([
            'conversation_uid' => $conversation->uid,
            'sender_uid' => $user->uid,
            'message' => $request->message,
            'is_read' => false
        ]);

        broadcast(new \App\Events\MessageSent($message->load('sender')));
        
        $recipientUid = $conversation->user_uid === $user->uid 
            ? $conversation->store->user_uid 
            : $conversation->user_uid;
            
        $recipient = \App\Models\User::find($recipientUid);
        if ($recipient) {
            $recipient->notify(new \App\Notifications\NewMessageNotification($message));
        }

        return response()->json($message, 201);
    }
}
