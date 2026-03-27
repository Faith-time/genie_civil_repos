<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientProjectMedia extends Model
{
    use HasFactory;

    protected $table = 'client_project_media';

    protected $fillable = [
        'client_project_id',
        'type',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'description',
        'order',
    ];

    protected $appends = ['url'];

    /**
     * Relations
     */
    public function clientProject(): BelongsTo
    {
        return $this->belongsTo(ClientProject::class);
    }

    /**
     * Scopes
     */
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    public function scopeDocuments($query)
    {
        return $query->where('type', 'document');
    }

    /**
     * Accessors
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->type === 'image') {
            // Génération de vignettes (optionnel, peut utiliser un package comme Intervention Image)
            return $this->url;
        }
        return null;
    }

    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
