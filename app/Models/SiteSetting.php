<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'phone',
        'whatsapp',
        'email_contact',
        'facebook_url',
        'linkedin_url',
        'instagram_url',
        'address',
        'cv_path',
        'about_text',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Récupérer ou créer les paramètres du site (Singleton pattern)
     */
    public static function getSettings()
    {
        return self::firstOrCreate([]);
    }

    /**
     * Vérifier si un CV est téléchargé
     */
    public function hasCv(): bool
    {
        return !empty($this->cv_path) && file_exists(public_path($this->cv_path));
    }

    /**
     * Obtenir l'URL complète du CV
     */
    public function getCvUrlAttribute(): ?string
    {
        return $this->cv_path ? asset($this->cv_path) : null;
    }
}
