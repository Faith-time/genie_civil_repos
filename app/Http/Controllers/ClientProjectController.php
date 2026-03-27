<?php

namespace App\Http\Controllers;

use App\Models\ClientProject;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    // ─── Constantes ────────────────────────────────────────────────────────────

    const PER_PAGE = 10;

    const ALLOWED_STATUSES = [
        'pending', 'under_review', 'quoted',
        'accepted', 'rejected', 'in_progress', 'completed',
    ];

    // ─── CLIENT : liste de SES projets ────────────────────────────────────────

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $projects = ClientProject::query()
            // Le client ne voit QUE ses propres projets
            ->where('user_id', Auth::id())
            ->with(['user', 'service', 'media', 'conversation'])
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('Admin/ClientProjects/Index', [
            'projects' => $projects,
            'filters'  => $filters,
        ]);
    }

    // ─── CLIENT : formulaire de soumission ───────────────────────────────────

    public function create()
    {
        $services = Service::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('ClientProjects/Create', [
            'services' => $services,
        ]);
    }

    // ─── CLIENT : enregistrement ──────────────────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                => ['required', 'string', 'max:255'],
            'description'          => ['required', 'string'],
            'service_id'           => ['nullable', 'exists:services,id'],
            'location'             => ['nullable', 'string', 'max:255'],
            'desired_start_date'   => ['nullable', 'date'],
            'budget_estimate_min'  => ['nullable', 'numeric', 'min:0'],
            'budget_estimate_max'  => ['nullable', 'numeric', 'min:0'],
            'urgency'              => ['nullable', 'in:flexible,normal,urgent'],
            'files.*'              => ['nullable', 'file', 'max:20480'],
        ]);

        $project = ClientProject::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status'  => 'pending',
        ]);

        // Médias joints par le client
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('client-projects/' . $project->id, 'public');
                $type = str_starts_with($file->getMimeType(), 'image/') ? 'image' : 'document';

                $project->media()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'type'      => $type,
                ]);
            }
        }

        return redirect()
            ->route('client-projects.index')
            ->with('success', 'Votre projet a bien été soumis.');
    }

    // ─── CLIENT : détail d'UN de ses projets ─────────────────────────────────

    public function show(ClientProject $clientProject)
    {
        abort_unless($clientProject->user_id === Auth::id(), 403);

        $clientProject->load(['user', 'service', 'media']);

        $conversation = \App\Models\Conversation::where('client_project_id', $clientProject->id)
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
            ->first();

        return Inertia::render('Admin/ClientProjects/Show', [
            'project'      => $clientProject,
            'conversation' => $conversation,
        ]);
    }

// ─── ADMIN : détail d'un projet ───────────────────────────────────────────

    public function adminShow(ClientProject $clientProject)
    {
        $clientProject->load(['user', 'service', 'media']);

        $conversation = \App\Models\Conversation::where('client_project_id', $clientProject->id)
            ->with(['messages' => fn($q) => $q->latest()->limit(1)])
            ->first();

        return Inertia::render('Admin/ClientProjects/Show', [
            'project'      => $clientProject,
            'conversation' => $conversation,
        ]);
    }

    // ─── CLIENT : suppression ─────────────────────────────────────────────────

    public function destroy(ClientProject $clientProject)
    {
        // Admin OU propriétaire
        $user = Auth::user();
        abort_unless(
            $user->hasRole('admin') || $clientProject->user_id === $user->id,
            403
        );

        // Suppression des fichiers stockés
        foreach ($clientProject->media as $media) {
            Storage::disk('public')->delete($media->file_path);
        }

        if ($clientProject->quote_file) {
            Storage::disk('public')->delete($clientProject->quote_file);
        }

        $clientProject->delete();

        return redirect()
            ->route('client-projects.index')
            ->with('success', 'Projet supprimé.');
    }

    // ─── ADMIN : liste de TOUS les projets ───────────────────────────────────

    public function adminIndex(Request $request)
    {
        $filters = $request->only(['search', 'status']);

        $projects = ClientProject::query()
            ->with(['user', 'service', 'media', 'conversation'])
            ->when($filters['search'] ?? null, function ($q, $s) {
                $q->where(function ($sub) use ($s) {
                    $sub->where('title', 'like', "%{$s}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$s}%"));
                });
            })
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('Admin/ClientProjects/Index', [
            'projects' => $projects,
            'filters'  => $filters,
        ]);
    }
    // ─── ADMIN : mise à jour statut + devis ───────────────────────────────────

    public function updateStatus(Request $request, ClientProject $clientProject)
    {
        $validated = $request->validate([
            'status'      => ['required', 'in:' . implode(',', self::ALLOWED_STATUSES)],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
            'quote_file'  => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx', 'max:20480'],
        ]);

        // Upload du document devis si fourni
        if ($request->hasFile('quote_file')) {
            // Suppression de l'ancien fichier
            if ($clientProject->quote_file) {
                Storage::disk('public')->delete($clientProject->quote_file);
            }

            $path = $request->file('quote_file')->store(
                'client-projects/' . $clientProject->id . '/quotes',
                'public'
            );

            $validated['quote_file'] = $path;
        }

        $clientProject->update($validated);

        return redirect()
            ->route('admin.client-projects.show', $clientProject)
            ->with('success', 'Demande mise à jour.');
    }
}
