<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    // ========== EDIT ==========

    public function edit()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => SiteSetting::getSettings(),
        ]);
    }

    // ========== UPDATE ==========

    public function update(Request $request)
    {
        $validated = $request->validate([
            'phone'         => 'nullable|string|max:20',
            'whatsapp'      => 'nullable|string|max:20',
            'email_contact' => 'nullable|email|max:255',
            'facebook_url'  => 'nullable|url|max:255',
            'linkedin_url'  => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'address'       => 'nullable|string',
            'about_text'    => 'nullable|string',
            'cv'            => 'nullable|file|mimes:pdf|max:5120',
        ]);

        $settings = SiteSetting::getSettings();

        // Gestion du fichier CV uploadé depuis l'admin
        if ($request->hasFile('cv')) {
            // Supprime l'ancien fichier storage si existant
            if ($settings->cv_path && Storage::disk('public')->exists($settings->cv_path)) {
                Storage::disk('public')->delete($settings->cv_path);
            }
            $validated['cv_path'] = $request->file('cv')->store('cv', 'public');
        }

        unset($validated['cv']); // ne pas écraser cv_path avec le champ file brut
        $settings->update($validated);

        return back()->with('success', 'Paramètres mis à jour.');
    }

    // ========== DOWNLOAD CV ==========

    public function downloadCv()
    {
        $settings = SiteSetting::getSettings();

        // 1. Priorité : fichier uploadé via l'admin (storage/public)
        if ($settings->cv_path && Storage::disk('public')->exists($settings->cv_path)) {
            return Storage::disk('public')->download(
                $settings->cv_path,
                'CV_Ismaila_SIDIBE.pdf',
                ['Content-Type' => 'application/pdf']
            );
        }

        // 2. Fallback : fichier statique dans public/files/
        $fallback = public_path('files/CV_Ismaila_SIDIBE.pdf');

        if (file_exists($fallback)) {
            return response()->download(
                $fallback,
                'CV_Ismaila_SIDIBE.pdf',
                ['Content-Type' => 'application/pdf']
            );
        }

        abort(404, 'CV non disponible.');
    }
}
