<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom du client
            $table->string('position')->nullable(); // Poste
            $table->string('company')->nullable(); // Entreprise
            $table->text('content'); // Contenu du témoignage
            $table->integer('rating')->default(5); // Note sur 5
            $table->string('avatar_url')->nullable(); // Photo du client
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_published')->default(false); // En attente de validation
            $table->boolean('is_featured')->default(false); // Mettre en avant
            $table->timestamps();

            $table->index('is_published');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
