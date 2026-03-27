<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Realisation;
use App\Models\RealisationImage;

class RealisationImageSeeder extends Seeder
{
    public function run(): void
    {
        $realisations = Realisation::all();

        $imageMapping = [
            'Madame_Zeinab' => [
                ['path' => 'images/Madame_Zeinab/img1.jpeg', 'order' => 1, 'is_main' => true],
                ['path' => 'images/Madame_Zeinab/img2.jpeg', 'order' => 2, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img3.jpeg', 'order' => 3, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img4.jpeg', 'order' => 4, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img5.jpeg', 'order' => 5, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img6.jpeg', 'order' => 6, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img7.jpeg', 'order' => 7, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img8.jpeg', 'order' => 8, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img9.jpeg', 'order' => 9, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img10.jpeg', 'order' => 10, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img11.jpeg', 'order' => 11, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img12.jpeg', 'order' => 12, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img13.jpeg', 'order' => 13, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img14.jpeg', 'order' => 14, 'is_main' => false],
                ['path' => 'images/Madame_Zeinab/img15.jpeg', 'order' => 15, 'is_main' => false],
            ],
        ];

        $totalImages = 0;

        foreach ($realisations as $realisation) {
            $clientName = $realisation->client_name;

            if (isset($imageMapping[$clientName])) {
                foreach ($imageMapping[$clientName] as $imageData) {
                    RealisationImage::create([
                        'realisation_id' => $realisation->id,
                        'image_path' => $imageData['path'],
                        'order' => $imageData['order'],
                        'is_main' => $imageData['is_main'],
                    ]);
                    $totalImages++;
                }
            } else {
                if (in_array($clientName, ['Abdou Faye', 'Assane Diop'])) {
                    $otherImages = [
                        ['path' => 'images/autres/img16.jpeg', 'order' => 1, 'is_main' => true],
                        ['path' => 'images/autres/img17.jpeg', 'order' => 2, 'is_main' => false],
                    ];

                    foreach ($otherImages as $imageData) {
                        RealisationImage::create([
                            'realisation_id' => $realisation->id,
                            'image_path' => $imageData['path'],
                            'order' => $imageData['order'],
                            'is_main' => $imageData['is_main'],
                        ]);
                        $totalImages++;
                    }
                }
            }
        }

        $this->command->info('✅ ' . $totalImages . ' images ajoutées !');
    }
}
