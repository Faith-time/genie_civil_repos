<?php

namespace App\Http\Controllers;

use App\Models\ClientProject;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)
            ->orderBy('title')
            ->get(['id', 'title']);

        return Inertia::render('Contact', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'email'               => 'required|email|max:255',
            'phone'               => 'nullable|string|max:30',
            'subject'             => 'required|string|max:255',
            'message'             => 'required|string|max:3000',
            'service_id'          => 'nullable|exists:services,id',
            'location'            => 'nullable|string|max:255',
            'budget_estimate_min' => 'nullable|numeric|min:0',
            'budget_estimate_max' => 'nullable|numeric|min:0',
            'desired_start_date'  => 'nullable|date',
            'urgency'             => 'nullable|in:flexible,normal,urgent',
            'media.*'             => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:10240',
        ]);

        // ── Visiteur non connecté ────────────────────────────────────────────
        // On persiste les fichiers temporairement, on sauvegarde les données
        // en session, puis on redirige vers la page de connexion.
        // Après authentification, AuthenticatedSessionController appellera
        // ContactController::createPendingProject() pour finaliser.
        if (! Auth::check()) {
            $tempMedia = [];

            if ($request->hasFile('media')) {
                foreach ($request->file('media') as $file) {
                    $tmpPath = $file->store('tmp-contact', 'public');
                    $tempMedia[] = [
                        'path'      => $tmpPath,
                        'name'      => $file->getClientOriginalName(),
                        'size'      => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                    ];
                }
            }

            session([
                'pending_project' => [
                    'service_id'          => $validated['service_id'] ?? null,
                    'title'               => $validated['subject'],
                    'description'         => $validated['message'],
                    'location'            => $validated['location'] ?? null,
                    'budget_estimate_min' => $validated['budget_estimate_min'] ?? null,
                    'budget_estimate_max' => $validated['budget_estimate_max'] ?? null,
                    'desired_start_date'  => $validated['desired_start_date'] ?? null,
                    'urgency'             => $validated['urgency'] ?? 'normal',
                    'media'               => $tempMedia,
                ],
            ]);

            return redirect()->route('login')
                ->with('info', 'Connectez-vous ou créez un compte pour finaliser la soumission de votre projet.');
        }

        // ── Utilisateur déjà connecté : création immédiate ───────────────────
        self::createProject(Auth::id(), [
            'service_id'          => $validated['service_id'] ?? null,
            'title'               => $validated['subject'],
            'description'         => $validated['message'],
            'location'            => $validated['location'] ?? null,
            'budget_estimate_min' => $validated['budget_estimate_min'] ?? null,
            'budget_estimate_max' => $validated['budget_estimate_max'] ?? null,
            'desired_start_date'  => $validated['desired_start_date'] ?? null,
            'urgency'             => $validated['urgency'] ?? 'normal',
        ], $request);

        return redirect()->route('contact')->with('success', true);
    }

    /**
     * Crée un ClientProject + ses médias pour un utilisateur authentifié.
     *
     * Appelé depuis :
     *   - store()  → utilisateur déjà connecté (fichiers via $request)
     *   - AuthenticatedSessionController::store() après connexion réussie
     *     (fichiers temporaires via $data['media'])
     */
    public static function createProject(int $userId, array $data, $request = null): ClientProject
    {
        $project = ClientProject::create([
            'user_id'             => $userId,
            'service_id'          => $data['service_id'] ?? null,
            'title'               => $data['title'],
            'description'         => $data['description'],
            'location'            => $data['location'] ?? null,
            'budget_estimate_min' => $data['budget_estimate_min'] ?? null,
            'budget_estimate_max' => $data['budget_estimate_max'] ?? null,
            'desired_start_date'  => $data['desired_start_date'] ?? null,
            'urgency'             => $data['urgency'] ?? 'normal',
            'status'              => 'pending',
        ]);

        // Médias depuis la requête en cours (soumission directe)
        if ($request && $request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('client-projects/' . $project->id, 'public');
                $type = str_starts_with($file->getMimeType(), 'image/') ? 'image' : 'document';
                $project->media()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'type'      => $type,
                ]);
            }
        }

        // Médias depuis les fichiers temporaires (post-login)
        if (! empty($data['media'])) {
            foreach ($data['media'] as $tmp) {
                $dest = 'client-projects/' . $project->id . '/' . basename($tmp['path']);
                Storage::disk('public')->move($tmp['path'], $dest);
                $type = str_starts_with($tmp['mime_type'], 'image/') ? 'image' : 'document';
                $project->media()->create([
                    'file_path' => $dest,
                    'file_name' => $tmp['name'],
                    'file_size' => $tmp['size'],
                    'mime_type' => $tmp['mime_type'],
                    'type'      => $type,
                ]);
            }
        }

        return $project;
    }

    /**
     * Appelé juste après une authentification réussie (login ou register)
     * pour finaliser la création du projet mis en attente en session.
     */
    public static function createPendingProject(int $userId): void
    {
        $pending = session('pending_project');

        if ($pending) {
            self::createProject($userId, $pending);
            session()->forget('pending_project');
        }
    }
}
