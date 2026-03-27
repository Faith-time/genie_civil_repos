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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['image', 'video'])->default('image');
            $table->string('path'); // URL Cloudinary ou chemin local
            $table->string('public_id')->nullable(); // Public ID Cloudinary pour suppression
            $table->string('title')->nullable(); // Titre/Alt text
            $table->text('description')->nullable(); // Description du média
            $table->integer('width')->nullable(); // Largeur en pixels
            $table->integer('height')->nullable(); // Hauteur en pixels
            $table->integer('size')->nullable(); // Taille en bytes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
