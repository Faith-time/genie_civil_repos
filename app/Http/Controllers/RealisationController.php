<?php

namespace App\Http\Controllers;

use App\Models\Realisation;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class RealisationController extends Controller
{
    public function index()
    {
        // 1. Réalisations vidéo depuis la base de données
        $dbRealisations = Realisation::with(['service', 'images', 'mainImage'])
            ->where('is_published', true)
            ->orderBy('order')
            ->orderByDesc('date_realisation')
            ->get()
            ->each->append('video_url');

        // Les réalisations vidéo ne reçoivent JAMAIS d'images statiques
        // (les images de public/images/ appartiennent à d'autres clients)
        $videoRealisations = $dbRealisations->filter(fn($r) => $r->video_path)->values();

        // 2. Réalisations photo depuis les dossiers public/images/
        // Ces clients n'ont PAS de vidéo et ne sont PAS en base de données
        $photoRealisations = $this->buildPhotoRealisationsFromFolders();

        // 3. Fusionner : vidéos d'abord, puis photos
        $realisations = $videoRealisations->concat($photoRealisations);

        return Inertia::render('ClientProjects/Index', [
            'realisations' => $realisations,
        ]);
    }

    public function show(Realisation $realisation)
    {
        if (!$realisation->is_published) {
            abort(404);
        }

        $realisation->append('video_url');

        if (!$realisation->video_path && $realisation->images->isEmpty()) {
            $staticImages = $this->getStaticImagesForRealisation($realisation->client_name);
            $realisation->setRelation('images', collect($staticImages));
        }

        // ✅ Bon dossier + bonne prop
        return Inertia::render('ClientProjects/RealisationShow', [
            'realisation' => $realisation,
        ]);
    }

// Ajouter pour les dossiers photo virtuels
    public function showFolder(string $folder)
    {
        $folderName = str_replace(' ', '_', $folder);
        $clientName = str_replace('_', ' ', $folderName);
        $images     = $this->scanImageFolder($folderName);

        if (empty($images)) abort(404);

        $realisation = (object) [
            'id'               => 'img_' . $folderName,
            'title'            => $clientName,
            'description'      => null,
            'client_name'      => $clientName,
            'location'         => null,
            'video_url'        => null,
            'date_realisation' => null,
            'service'          => null,
            'images'           => collect($images),
        ];

        return Inertia::render('ClientProjects/RealisationShow', [
            'realisation' => $realisation,
        ]);
    }
    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Parcourt public/images/ et crée un objet "réalisation virtuelle"
     * par dossier client (Madame_Zeinab, autres, etc.)
     * Ces réalisations n'ont PAS de vidéo — uniquement des photos.
     */
    private function buildPhotoRealisationsFromFolders(): \Illuminate\Support\Collection
    {
        $imagesPath = public_path('images');
        if (!File::exists($imagesPath)) return collect();

        $result = collect();

        foreach (File::directories($imagesPath) as $folder) {
            $folderName  = basename($folder);
            $clientName  = str_replace('_', ' ', $folderName); // "Madame_Zeinab" → "Madame Zeinab"
            $images      = $this->scanImageFolder($folderName);

            if (empty($images)) continue;

            // Objet stdClass qui imite la structure d'un Model Realisation
            $virtual = (object) [
                'id'               => 'img_' . $folderName,  // id unique fictif
                'title'            => $clientName,
                'description'      => null,
                'client_name'      => $clientName,
                'location'         => null,
                'video_path'       => null,
                'video_url'        => null,
                'date_realisation' => null,
                'is_published'     => true,
                'order'            => 999,
                'service'          => null,
                'images'           => collect($images),
            ];

            $result->push($virtual);
        }

        return $result;
    }

    private function getStaticImagesForRealisation(?string $clientName): array
    {
        if (!$clientName) return $this->scanImageFolder('autres');

        $imagesPath = public_path('images');
        if (!File::exists($imagesPath)) return [];

        foreach (File::directories($imagesPath) as $folder) {
            $folderName       = basename($folder);
            $normalizedFolder = strtolower(str_replace([' ', '_'], '', $folderName));
            $normalizedClient = strtolower(str_replace([' ', '_'], '', $clientName));

            if ($normalizedFolder === $normalizedClient) {
                return $this->scanImageFolder($folderName);
            }
        }

        return [];
    }

    private function scanImageFolder(string $folderName): array
    {
        $folderPath = public_path('images/' . $folderName);
        if (!File::exists($folderPath)) return [];

        $images     = [];
        $extensions = ['jpeg', 'jpg', 'png', 'webp'];

        foreach ($extensions as $ext) {
            foreach (File::glob($folderPath . '/*.' . $ext) as $file) {
                $filename = basename($file);
                $safeName = str_replace(' ', '_', $folderName);
                $images[] = [
                    'id'         => $filename,
                    'image_url'  => asset('images/' . $safeName . '/' . $filename),
                    'image_path' => 'images/' . $safeName . '/' . $filename,
                    'title'      => pathinfo($filename, PATHINFO_FILENAME),
                    'is_main'    => count($images) === 0,
                    'order'      => count($images),
                ];
            }
        }

        return $images;
    }

    public function adminIndex()
    {
        $this->authorizeAdmin();

        $realisations = Realisation::with(['service', 'images', 'mainImage'])
            ->orderBy('order')
            ->orderByDesc('date_realisation')
            ->get()
            ->each->append('video_url');

        return Inertia::render('Admin/ClientProjects/Index', [
            'projects' => $realisations,
        ]);
    }

    public function create()
    {
        $this->authorizeAdmin();

        $videos = $this->scanVideosDirectory();

        return Inertia::render('Admin/ClientProjects/Create', [
            'services' => Service::where('is_active', true)->get(),
            'videos'   => $videos,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'service_id'       => 'nullable|exists:services,id',
            'client_name'      => 'nullable|string|max:255',
            'location'         => 'nullable|string|max:255',
            'video_path'       => 'required|string',
            'date_realisation' => 'nullable|date',
            'is_published'     => 'boolean',
            'order'            => 'nullable|integer|min:0',
        ]);

        $validated['is_published'] = $validated['is_published'] ?? false;

        Realisation::create($validated);

        return redirect()
            ->route('admin.realisations.index')
            ->with('success', 'Réalisation ajoutée avec succès.');
    }

    public function destroy(Realisation $realisation)
    {
        $this->authorizeAdmin();
        $realisation->delete();
        return back()->with('success', 'Réalisation supprimée.');
    }

    public function togglePublish(Realisation $realisation)
    {
        $this->authorizeAdmin();
        $realisation->update(['is_published' => !$realisation->is_published]);
        return back()->with('success', 'Statut mis à jour.');
    }

    private function authorizeAdmin()
    {
        if (!Auth::user()?->hasRole('admin')) {
            abort(403);
        }
    }
}
