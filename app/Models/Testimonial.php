<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'company',
        'content',
        'rating',
        'avatar_url',
        'is_published',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'rating'       => 'integer',
            'is_published' => 'boolean',
            'is_featured'  => 'boolean',
            'created_at'   => 'datetime',
            'updated_at'   => 'datetime',
        ];
    }

    // ── Scopes ──────────────────────────────────────────
    public function scopePublished($query) { return $query->where('is_published', true); }
    public function scopeFeatured($query)  { return $query->where('is_featured', true); }
    public function scopeByRating($query, $min = 4) { return $query->where('rating', '>=', $min); }
    public function scopeRecent($query, $limit = 10) { return $query->orderBy('created_at', 'desc')->limit($limit); }

    // ── Accesseurs ───────────────────────────────────────
    public function getAvatarAttribute(): ?string
    {
        if ($this->avatar_url) {
            if (filter_var($this->avatar_url, FILTER_VALIDATE_URL)) return $this->avatar_url;
            return asset('storage/' . $this->avatar_url);
        }
        return asset('images/default-avatar.png');
    }

    public function getFullNameAttribute(): string
    {
        return implode(' - ', array_filter([$this->name, $this->position, $this->company]));
    }

    public function setRatingAttribute($value): void
    {
        $this->attributes['rating'] = max(1, min(5, (int) $value));
    }
}
