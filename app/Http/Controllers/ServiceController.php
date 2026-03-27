<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    // ========== PUBLIC ==========

    public function index()
    {
        return Inertia::render('Services/Index', [
            'services' => Service::active()->withCount('projects')->get()
        ]);
    }

    public function show(Service $service)
    {
        // Charger les réalisations avec leurs images (RealisationImage)
        // video_url est un appended attribute sur Realisation, il sera inclus automatiquement
        $service->load(['projects' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(6);
        }, 'projects.images']);

        return Inertia::render('Services/Show', [
            'service' => $service,
        ]);
    }

    // ========== ADMIN ==========

    public function adminIndex()
    {
        return Inertia::render('Services/Index', [
            'services' => Service::withCount('realisations')->latest()->get(),
            'isAdmin'  => true,
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'slug'              => 'nullable|string|unique:services',
            'short_description' => 'nullable|string|max:500',
            'description'       => 'required|string',
            'icon'              => 'nullable|string|max:255',
            'is_active'         => 'boolean',
        ]);

        Service::create($validated);

        return redirect()->route('admin.services.index')->with('success', 'Service créé !');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Edit', ['service' => $service]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'slug'              => 'nullable|string|unique:services,slug,' . $service->id,
            'short_description' => 'nullable|string|max:500',
            'description'       => 'required|string',
            'icon'              => 'nullable|string|max:255',
            'is_active'         => 'boolean',
        ]);

        $service->update($validated);

        return back()->with('success', 'Service mis à jour !');
    }

    public function destroy(Service $service)
    {
        if ($service->projects()->count() > 0) {
            return back()->withErrors(['error' => 'Impossible de supprimer : projets associés.']);
        }

        $service->delete();
        return redirect()->route('admin.services.index')->with('success', 'Service supprimé !');
    }

    public function toggleStatus(Service $service)
    {
        $service->update(['is_active' => !$service->is_active]);
        return back();
    }
}
