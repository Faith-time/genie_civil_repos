<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);
        $this->call([
            ServiceSeeder::class,
        ]);
        $this->call([
            RealisationSeeder::class,
        ]);
        $this->call([
            RealisationImageSeeder::class,
        ]);
        $this->call([
            FixRealisationVideoPathsSeeder::class,
        ]);
    }
}
