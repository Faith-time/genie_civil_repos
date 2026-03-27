<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Realisation;
use App\Models\Service;

class RealisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les services
        $serviceSuivi = Service::where('slug', 'suivi-et-coordination-de-chantier')->first();
        $serviceEtudeBeton = Service::where('slug', 'etude-beton-et-metallique')->first();
        $serviceEtudeSol = Service::where('slug', 'etude-de-sol')->first();
        $serviceExpertise = Service::where('slug', 'expertise-technique-et-controle-qualite')->first();
        $serviceRealisationPlans = Service::where('slug', 'realisation-de-plans')->first();

        // Tableau des réalisations
        $realisations = [
            // ═══ ABDOU FAYE ═══
            [
                'title' => 'Construction villa R+1 à Mermoz',
                'description' => "Construction d'une villa de standing avec sous-sol, rez-de-chaussée et étage. Surface totale : 320 m². Finitions haut de gamme, piscine intégrée et jardin paysager.",
                'service_id' => $serviceSuivi?->id,
                'client_name' => 'Abdou Faye',
                'location' => 'Mermoz, Dakar',
                'video_path' => 'videos/Abdou faye/vid1.mp4',
                'date_realisation' => '2024-01-15',
                'is_published' => true,
                'order' => 1,
            ],

            // ═══ ASSANE DIOP ═══
            [
                'title' => 'Étude de sol - Terrain résidentiel',
                'description' => "Analyse complète des caractéristiques géotechniques du terrain. Sondages, essais de laboratoire et recommandations pour les fondations. Rapport technique détaillé remis au client.",
                'service_id' => $serviceEtudeSol?->id,
                'client_name' => 'Assane Diop',
                'location' => 'Almadies, Dakar',
                'video_path' => 'videos/assane diop/vid2.mp4',
                'date_realisation' => '2024-02-20',
                'is_published' => true,
                'order' => 2,
            ],

            // ═══ CENTRE COMMERCIAL NIODIOR ═══
            [
                'title' => 'Centre commercial Niodior - Phase 1',
                'description' => "Construction d'un centre commercial moderne de 2500 m². Structure métallique renforcée. 24 boutiques, parking souterrain et espaces communs climatisés.",
                'service_id' => $serviceEtudeBeton?->id,
                'client_name' => 'Centre Commercial Niodior',
                'location' => 'Niodior, Dakar',
                'video_path' => 'videos/Centre commercial niodior/vid3.mp4',
                'date_realisation' => '2023-09-15',
                'is_published' => true,
                'order' => 3,
            ],

            // ═══ CHEIKH TIDIANE SY ═══
            [
                'title' => 'Immeuble R+3 - Façade moderne',
                'description' => "Construction d'un immeuble de 4 niveaux avec 8 appartements standing. Ascenseur, parking privatif, finitions haut de gamme et système de sécurité intégré.",
                'service_id' => $serviceSuivi?->id,
                'client_name' => 'Cheikh Tidiane Sy',
                'location' => 'Sacré-Cœur, Dakar',
                'video_path' => 'videos/cheikh tidiane sy/vid4.mp4',
                'date_realisation' => '2023-12-20',
                'is_published' => true,
                'order' => 4,
            ],
            [
                'title' => 'Escalier intérieur design',
                'description' => "Conception et réalisation d'un escalier intérieur contemporain. Structure en béton avec marches en bois massif et garde-corps en verre sécurit.",
                'service_id' => $serviceRealisationPlans?->id,
                'client_name' => 'Cheikh Tidiane Sy',
                'location' => 'Sacré-Cœur, Dakar',
                'video_path' => 'videos/cheikh tidiane sy/vid5.mp4',
                'date_realisation' => '2024-01-08',
                'is_published' => true,
                'order' => 5,
            ],
            [
                'title' => 'Finitions intérieures premium',
                'description' => "Travaux de finition haut de gamme : faux plafonds avec éclairage LED intégré, revêtements muraux, parquet massif et menuiserie sur mesure.",
                'service_id' => $serviceExpertise?->id,
                'client_name' => 'Cheikh Tidiane Sy',
                'location' => 'Sacré-Cœur, Dakar',
                'video_path' => 'videos/cheikh tidiane sy/vid6.mp4',
                'date_realisation' => '2024-02-14',
                'is_published' => true,
                'order' => 6,
            ],
            [
                'title' => 'Expertise structure existante',
                'description' => "Diagnostic approfondi et vérification de la conformité structurelle. Contrôle qualité des matériaux et recommandations techniques pour mise aux normes.",
                'service_id' => $serviceExpertise?->id,
                'client_name' => 'Cheikh Tidiane Sy',
                'location' => 'Sacré-Cœur, Dakar',
                'video_path' => 'videos/cheikh tidiane sy/vid7.mp4',
                'date_realisation' => '2024-03-22',
                'is_published' => true,
                'order' => 7,
            ],
        ];

        // Créer les réalisations
        foreach ($realisations as $realisationData) {
            Realisation::create($realisationData);
        }

        $this->command->info('✅ ' . count($realisations) . ' réalisations ont été ajoutées avec succès !');
        $this->command->info('📊 Répartition par client :');
        $this->command->info('   - Abdou Faye: 1 projet');
        $this->command->info('   - Assane Diop: 1 projet');
        $this->command->info('   - Centre Commercial Niodior: 1 projet');
        $this->command->info('   - Cheikh Tidiane Sy: 4 projets');
    }
}
