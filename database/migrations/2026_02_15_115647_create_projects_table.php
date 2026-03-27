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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable(); // Description courte pour la grille
            $table->longText('description'); // Description détaillée
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('location')->nullable(); // Localisation du projet
            $table->foreignId('client_id')->nullable()->constrained('users')->onDelete('set null');            $table->decimal('budget', 15, 2)->nullable(); // Budget (optionnel)
            $table->date('date_realisation')->nullable(); // Date de réalisation
            $table->string('cover_image')->nullable(); // Image de couverture
            $table->boolean('is_featured')->default(false); // Projet vedette
            $table->boolean('is_published')->default(true); // Publier/Dépublier
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
