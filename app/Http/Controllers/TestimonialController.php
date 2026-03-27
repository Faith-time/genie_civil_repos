<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    // ========== PUBLIC ==========

    public function index(Request $request)
    {
        $query = Testimonial::published();  // ← plus de ->with('project')

        if ($request->rating) {
            $query->where('rating', (int) $request->rating);
        }

        $allPublished = Testimonial::published()->get();
        $stats = [
            'count'     => $allPublished->count(),
            'avgRating' => $allPublished->count() ? round($allPublished->avg('rating'), 1) : null,
        ];

        return Inertia::render('Testimonials/Index', [
            'testimonials' => $query->latest()->paginate(12),
            'filters'      => $request->only(['rating']),
            'stats'        => $stats,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $this->authorize('role', 'admin');

        $query = Testimonial::query();  // ← plus de ->with('project')
        if ($request->has('is_published')) {
            $query->where('is_published', $request->is_published);
        }

        return Inertia::render('Admin/Testimonials', [
            'testimonials' => $query->latest()->paginate(15)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'company'  => 'nullable|string|max:255',
            'content'  => 'required|string|max:1000',
            'rating'   => 'required|integer|min:1|max:5',
            'avatar'   => 'nullable|image|max:2048',
            // ← project_id supprimé
        ]);

        $validated['is_published'] = false;

        if ($request->hasFile('avatar')) {
            $validated['avatar_url'] = $request->file('avatar')->store('testimonials/avatars', 'public');
        }

        Testimonial::create($validated);

        return back()->with('success', 'Témoignage soumis ! Sera publié après validation.');
    }

    // Pages/About.jsx (contient formulaire de témoignage)
    public function about()
    {
        return Inertia::render('About');
    }


    // ========== ADMIN ==========


    public function edit(Testimonial $testimonial)
    {
        $this->authorize('role', 'admin');
        return Inertia::render('Admin/TestimonialEdit', ['testimonial' => $testimonial]);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $this->authorize('role', 'admin');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'avatar' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            if ($testimonial->avatar_url) Storage::disk('public')->delete($testimonial->avatar_url);
            $validated['avatar_url'] = $request->file('avatar')->store('testimonials/avatars', 'public');
        }

        $testimonial->update($validated);

        return back()->with('success', 'Témoignage mis à jour !');
    }

    public function destroy(Testimonial $testimonial)
    {
        $this->authorize('role', 'admin');
        if ($testimonial->avatar_url) Storage::disk('public')->delete($testimonial->avatar_url);
        $testimonial->delete();

        return redirect()->route('admin.testimonials')->with('success', 'Témoignage supprimé !');
    }

    public function togglePublish(Testimonial $testimonial)
    {
        $this->authorize('role', 'admin');
        $testimonial->update(['is_published' => !$testimonial->is_published]);
        return back();
    }

    public function toggleFeatured(Testimonial $testimonial)
    {
        $this->authorize('role', 'admin');
        $testimonial->update(['is_featured' => !$testimonial->is_featured]);
        return back();
    }
}
