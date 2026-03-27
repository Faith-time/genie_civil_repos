<?php

namespace App\Http\Controllers;

use App\Models\Realisation;
use App\Models\Service;
use App\Models\Testimonial;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Stats réelles calculées depuis la BD
        $publishedRealisations  = Realisation::published()->count();
        $publishedTestimonials  = Testimonial::published()->count();
        $avgRating              = Testimonial::published()->avg('rating');
        $satisfactionRate       = $publishedTestimonials > 0
            ? round(Testimonial::published()->where('rating', '>=', 4)->count() / $publishedTestimonials * 100)
            : 0;

        return Inertia::render('Home', [
            // Services actifs (max 6)
            'services' => Service::active()
                ->withCount('projects')
                ->limit(6)
                ->get(),

            // 3 réalisations mises en avant avec leurs images
            'featuredRealisations' => Realisation::published()
                ->with(['service', 'images', 'mainImage'])
                ->orderBy('order')
                ->orderByDesc('date_realisation')
                ->limit(3)
                ->get()
                ->each->append('video_url'),

            // Témoignages featured publiés (max 5 pour le carousel)
            'testimonials' => Testimonial::published()
                ->latest()
                ->limit(5)
                ->get(),

            // Stats dynamiques
            'stats' => [
                'projectsCount'     => $publishedRealisations,
                'testimonialsCount' => $publishedTestimonials,
                'avgRating'         => $avgRating ? round($avgRating, 1) : null,
                'satisfactionRate'  => $satisfactionRate,
            ],
        ]);
    }
}
