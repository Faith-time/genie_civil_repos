<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class RealisationImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'realisation_id',
        'image_path',
        'title',
        'description',
        'order',
        'is_main',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'order'   => 'integer',
    ];

    protected $appends = ['image_url'];

    public function realisation(): BelongsTo
    {
        return $this->belongsTo(Realisation::class);
    }

    /**
     * Génère l'URL publique de l'image.
     *
     * Stratégie :
     *  1. Si image_path est déjà une URL complète (http/https) → retourner tel quel
     *  2. Si le fichier existe dans le disk 'public' (storage/app/public/) → Storage::url()
     *  3. Sinon → asset() pour les fichiers dans public/ directement
     */
    public function getImageUrlAttribute(): string
    {
        $path = $this->image_path;

        if (!$path) {
            return '';
        }

        // Cas 1 : URL absolue déjà formée
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Cas 2 : fichier dans storage/app/public/ (disk public)
        // Enlever le préfixe "storage/" si présent pour éviter le doublon
        $storagePath = preg_replace('#^storage/#', '', $path);
        if (Storage::disk('public')->exists($storagePath)) {
            return Storage::disk('public')->url($storagePath);
        }

        // Cas 3 : fichier dans public/ directement (ex: public/images/...)
        return asset($path);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }

    public function scopeMain($query)
    {
        return $query->where('is_main', true);
    }
}
