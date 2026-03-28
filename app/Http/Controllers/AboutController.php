<?php

namespace App\Http\Controllers;

use App\Models\Realisation;
use App\Models\Testimonial;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $publishedRealisations  = Realisation::published()->count();
        $publishedTestimonials  = Testimonial::published()->count();
        $avgRating              = Testimonial::published()->avg('rating');
        $satisfactionRate       = $publishedTestimonials > 0
            ? round(Testimonial::published()->where('rating', '>=', 4)->count() / $publishedTestimonials * 100)
            : 0;

        return Inertia::render('About', [
            'stats' => [
                'projectsCount'     => $publishedRealisations,
                'testimonialsCount' => $publishedTestimonials,
                'avgRating'         => $avgRating ? round($avgRating, 1) : null,
                'satisfactionRate'  => $satisfactionRate,
            ],
        ]);
    }
}
