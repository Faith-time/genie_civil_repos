<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'icon',
        'is_active',
    ];

    protected $appends = ['name'];

    protected function casts(): array
    {
        return [
            'is_active'  => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->title);
            }
        });

        static::updating(function ($service) {
            if ($service->isDirty('title') && empty($service->slug)) {
                $service->slug = Str::slug($service->title);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Accessor — expose "name" comme alias de "title"
    | Permet d'utiliser $service->name et service.name en JS
    |--------------------------------------------------------------------------
    */
    public function getNameAttribute(): string
    {
        return $this->title ?? '';
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function projects()
    {
        return $this->hasMany(Realisation::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithProjectCount($query)
    {
        return $query->withCount('projects');
    }

    /*
    |--------------------------------------------------------------------------
    | Route binding par slug
    |--------------------------------------------------------------------------
    */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
