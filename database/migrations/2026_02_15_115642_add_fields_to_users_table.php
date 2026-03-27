<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Cette migration modifie la table users existante pour :
     * 1. Ajouter les champs nécessaires pour JWT
     * 2. Préparer pour Spatie Permission
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter une colonne pour l'avatar (optionnel)
            $table->string('avatar')->nullable()->after('email');

            // Ajouter une colonne pour le numéro de téléphone
            $table->string('phone')->nullable()->after('avatar');

            // Ajouter une colonne pour le statut actif/inactif
            $table->boolean('is_active')->default(true)->after('phone');

            // Ajouter une colonne pour la dernière connexion
            $table->timestamp('last_login_at')->nullable()->after('is_active');

            // Index pour optimiser les requêtes
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'phone', 'is_active', 'last_login_at']);
        });
    }
};
