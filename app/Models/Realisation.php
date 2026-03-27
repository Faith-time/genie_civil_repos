<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Realisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'title',
        'description',
        'client_name',
        'location',
        'video_path',
        'date_realisation',
        'is_published',
        'order',
    ];

    protected $casts = [
        'is_published'     => 'boolean',
        'date_realisation' => 'date',
    ];

    protected $appends = ['video_url'];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function getImageUrlAttribute(): string
    {
        $segments = explode('/', $this->image_path);
        $encoded  = array_map('rawurlencode', $segments);
        return asset(implode('/', $encoded));
    }

    public function getVideoUrlAttribute(): ?string
    {
        if (!$this->video_path) return null;

        // Si c'est déjà une URL complète
        if (str_starts_with($this->video_path, 'http')) {
            return $this->video_path;
        }

        // Fichier dans public/videos/...
        return asset($this->video_path);
    }

    // Après la méthode service(), ajoutez :

    public function images()
    {
        return $this->hasMany(RealisationImage::class)->ordered();
    }

    public function mainImage()
    {
        return $this->hasOne(RealisationImage::class)->main();
    }
}
