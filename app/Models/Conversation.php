<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_user_id',
        'visitor_name',
        'visitor_email',
        'visitor_ip',
        'status',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    protected $appends = ['display_name', 'unread_visitor_count', 'unread_admin_count'];

    // Relation avec l'utilisateur client
    public function clientUser()
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    // Relation avec les messages
    public function messages()
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }


    public function clientProject(): BelongsTo
    {
        return $this->belongsTo(ClientProject::class);
    }

    // Attribut pour le nom d'affichage
    public function getDisplayNameAttribute()
    {
        if ($this->client_user_id) {
            return $this->clientUser?->name ?? 'Utilisateur';
        }
        return $this->visitor_name ?? 'Visiteur';
    }

    // Compter les messages non lus pour le visiteur/client
    public function getUnreadVisitorCountAttribute()
    {
        return $this->messages()
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->count();
    }

    // Compter les messages non lus pour l'admin
    public function getUnreadAdminCountAttribute()
    {
        return $this->messages()
            ->whereIn('sender_type', ['client', 'visitor'])
            ->where('is_read', false)
            ->count();
    }
}
