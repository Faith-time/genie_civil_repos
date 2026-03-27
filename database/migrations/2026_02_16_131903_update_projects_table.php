<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Supprimer la colonne client_id si elle existe
            if (Schema::hasColumn('projects', 'client_id')) {
                $table->dropForeign(['client_id']);
                $table->dropColumn('client_id');
            }

            // Ajouter des colonnes si elles n'existent pas déjà
            if (!Schema::hasColumn('projects', 'client_name')) {
                $table->string('client_name')->nullable()->after('service_id');
            }

            if (!Schema::hasColumn('projects', 'cover_image')) {
                $table->string('cover_image')->nullable()->after('description');
            }

            if (!Schema::hasColumn('projects', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_published');
            }

            if (!Schema::hasColumn('projects', 'budget')) {
                $table->decimal('budget', 10, 2)->nullable()->after('location');
            }

            if (!Schema::hasColumn('projects', 'date_realisation')) {
                $table->date('date_realisation')->nullable()->after('budget');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'client_name',
                'cover_image',
                'is_featured',
                'budget',
                'date_realisation'
            ]);
        });
    }
};
