<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Conversation;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function store(Request $request, Conversation $conversation)
    {
        if (!auth()->check()) abort(403);

        $user = auth()->user();

        if (!$user->hasRole('admin') && $conversation->client_user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate(['message' => 'required|string|max:2000']);

        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => $user->hasRole('admin') ? 'admin' : 'client',
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        return back();
    }

    public function destroy(ChatMessage $message)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin') && $message->user_id !== $user->id) {
            abort(403);
        }

        $message->delete();
        return back()->with('success', 'Message supprimé !');
    }
}
