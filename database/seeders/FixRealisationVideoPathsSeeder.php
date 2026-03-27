<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Realisation;

class FixRealisationVideoPathsSeeder extends Seeder
{
    public function run(): void
    {
        // Mapping des IDs vers les bons chemins
        $videoPaths = [
            1 => 'videos/Abdou faye/vid1.mp4',
            2 => 'videos/assane diop/vid2.mp4',
            3 => 'videos/Centre commercial niodior/vid3.mp4',
            4 => 'videos/cheikh tidiane sy/vid4.mp4',
            5 => 'videos/cheikh tidiane sy/vid5.mp4',
            6 => 'videos/cheikh tidiane sy/vid6.mp4',
            7 => 'videos/cheikh tidiane sy/vid7.mp4',
        ];

        foreach ($videoPaths as $id => $path) {
            $realisation = Realisation::find($id);
            if ($realisation) {
                $realisation->video_path = $path;
                $realisation->save();
                $this->command->info("✅ Réalisation #{$id} mise à jour: {$path}");
            }
        }

        $this->command->info('🎉 Tous les chemins vidéos ont été corrigés !');
    }
}
