<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ClientProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'title',
        'description',
        'location',
        'budget_estimate_min',
        'budget_estimate_max',
        'desired_start_date',
        'urgency',
        'status',
        'quote_amount',
        'quote_file',
        'admin_notes',
    ];

    protected $casts = [
        'budget_estimate_min' => 'decimal:2',
        'budget_estimate_max' => 'decimal:2',
        'quote_amount' => 'decimal:2',
        'desired_start_date' => 'date',
    ];

    /**
     * Relations
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ClientProjectMedia::class);
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', 'under_review');
    }

    public function scopeQuoted($query)
    {
        return $query->where('status', 'quoted');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'under_review' => 'En cours d\'examen',
            'quoted' => 'Devis envoyé',
            'accepted' => 'Accepté',
            'rejected' => 'Rejeté',
            'in_progress' => 'En cours',
            'completed' => 'Terminé',
            default => $this->status,
        };
    }

    public function getQuoteFileUrlAttribute(): ?string
    {
        return $this->quote_file
            ? asset('storage/' . $this->quote_file)
            : null;
    }

    public function conversation(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\Conversation::class, 'client_project_id');
    }
}
