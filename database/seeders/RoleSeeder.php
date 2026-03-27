<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Réinitialiser le cache des rôles et permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('🔄 Création des rôles et permissions...');

        // Créer les permissions
        $permissions = [
            'manage projects',
            'manage services',
            'manage testimonials',
            'manage conversations',
            'manage users',
            'manage settings',
            'view analytics',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $this->command->info('✓ Permissions créées');

        // Créer les rôles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $clientRole = Role::firstOrCreate(['name' => 'client']);
        $visiteurRole = Role::firstOrCreate(['name' => 'visiteur']);

        $this->command->info('✓ Rôles créés (admin, client, visiteur)');

        // Assigner toutes les permissions à l'admin
        $adminRole->syncPermissions(Permission::all());

        // Les clients peuvent voir leurs analyses
        $clientRole->syncPermissions(['view analytics']);

        // Les visiteurs n'ont pas de permissions spéciales (juste pour identifier le type d'utilisateur)

        $this->command->info('✓ Permissions assignées aux rôles');
        $this->command->info('✅ Rôles et permissions configurés avec succès!');
    }
}
