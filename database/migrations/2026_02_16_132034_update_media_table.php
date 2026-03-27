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
        if (!Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained()->onDelete('cascade');
                $table->enum('type', ['image', 'video']);
                $table->text('path'); // Pour stocker URL ou chemin
                $table->string('public_id')->nullable(); // Pour Cloudinary
                $table->string('title')->nullable();
                $table->text('description')->nullable();
                $table->integer('width')->nullable();
                $table->integer('height')->nullable();
                $table->bigInteger('size')->nullable(); // Taille en bytes
                $table->integer('order')->default(0); // Pour l'ordre d'affichage
                $table->timestamps();
            });
        } else {
            Schema::table('media', function (Blueprint $table) {
                // Ajouter les colonnes manquantes si nécessaire
                if (!Schema::hasColumn('media', 'order')) {
                    $table->integer('order')->default(0)->after('size');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
