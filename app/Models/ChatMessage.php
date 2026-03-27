<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_type',
        'user_id',
        'message',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    protected $appends = ['sender_name'];

    // Relation avec la conversation
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Attribut pour le nom de l'expéditeur
    public function getSenderNameAttribute()
    {
        if ($this->user_id) {
            return $this->user?->name ?? 'Utilisateur';
        }
        return $this->sender_type === 'admin' ? 'Admin' : 'Visiteur';
    }
}
