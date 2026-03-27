<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Etude de sol',
                'slug' => 'etude-de-sol',
                'short_description' => 'Analyse complète des caractéristiques géotechniques de votre terrain pour garantir la stabilité de vos constructions.',
                'description' => "L'étude de sol est une étape cruciale avant tout projet de construction. Notre équipe d'experts réalise des analyses approfondies du terrain pour déterminer sa capacité portante, sa nature géologique et les éventuels risques (glissement, tassement, présence d'eau). Nous fournissons des recommandations précises pour adapter les fondations et assurer la pérennité de votre ouvrage. Cette étude permet d'éviter les malfaçons et de réaliser des économies importantes en dimensionnant correctement les fondations.",
                'icon' => 'chart-line', // Icône pour graphique/analyse
                'is_active' => true,
            ],
            [
                'title' => 'Suivi et coordination de chantier',
                'slug' => 'suivi-et-coordination-de-chantier',
                'short_description' => 'Supervision technique complète de vos travaux pour assurer le respect des normes, délais et budget.',
                'description' => "La coordination de chantier est essentielle pour garantir le bon déroulement de votre projet. Nous assurons le suivi technique quotidien, la coordination des différents corps de métier, le contrôle qualité à chaque étape et la gestion des plannings. Notre présence régulière sur site permet d'anticiper les problèmes, de valider la conformité des travaux aux plans et de garantir le respect des délais et du budget. Nous sommes votre interlocuteur privilégié pour tous les aspects techniques du chantier.",
                'icon' => 'clipboard-check', // Icône pour suivi/checklist
                'is_active' => true,
            ],
            [
                'title' => 'Etude béton et métallique',
                'slug' => 'etude-beton-et-metallique',
                'short_description' => 'Conception et dimensionnement des structures en béton armé et charpentes métalliques selon les normes en vigueur.',
                'description' => "Nous réalisons des études de structures complètes pour vos projets en béton armé et charpentes métalliques. Notre bureau d'études calcule et dimensionne tous les éléments porteurs (poteaux, poutres, dalles, fondations) selon les normes Eurocodes en vigueur. Nous prenons en compte toutes les charges (permanentes, d'exploitation, sismiques, vent) et optimisons les sections pour un rapport qualité/coût optimal. Nos plans d'exécution détaillés facilitent la réalisation sur chantier et assurent la conformité de l'ouvrage.",
                'icon' => 'building', // Icône pour structure/bâtiment
                'is_active' => true,
            ],
            [
                'title' => 'Expertise technique et contrôle qualité',
                'slug' => 'expertise-technique-et-controle-qualite',
                'short_description' => 'Diagnostic approfondi et vérification de la conformité de vos ouvrages existants ou en cours de réalisation.',
                'description' => "Notre service d'expertise technique permet d'évaluer l'état de vos constructions existantes ou de contrôler la qualité des travaux en cours. Nous réalisons des diagnostics structurels complets, identifions les pathologies (fissures, tassements, corrosion), évaluons les risques et proposons des solutions de confortement ou de réparation. Pour les chantiers en cours, nous effectuons des contrôles réguliers pour vérifier la conformité des ouvrages aux normes et aux plans. Nos rapports détaillés vous permettent de prendre les bonnes décisions en toute connaissance de cause.",
                'icon' => 'clock', // Icône pour contrôle/expertise
                'is_active' => true,
            ],
            [
                'title' => 'Réalisation de plans',
                'slug' => 'realisation-de-plans',
                'short_description' => 'Conception de plans architecturaux, structurels et en 3D avec devis gratuit pour concrétiser vos projets.',
                'description' => "Nous concevons l'ensemble des plans nécessaires à la réalisation de votre projet : plans architecturaux (plans de masse, façades, coupes), plans techniques (structure, réseaux) et modélisations 3D pour une meilleure visualisation. Nos plans sont conformes aux règles d'urbanisme et aux normes techniques en vigueur. Nous vous accompagnons également dans les démarches administratives (permis de construire, déclaration préalable). Un devis détaillé gratuit vous est fourni pour que vous puissiez budgétiser précisément votre projet.",
                'icon' => 'drafting-compass', // Icône pour plans/conception
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }

        $this->command->info('✅ 5 services créés avec succès !');
    }
}
