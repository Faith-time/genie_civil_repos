<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_project_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_project_id')->constrained()->onDelete('cascade');

            $table->enum('type', ['image', 'document']); // image = photo, document = PDF/plans
            $table->string('file_path'); // Chemin du fichier
            $table->string('file_name'); // Nom original
            $table->string('mime_type'); // Type MIME
            $table->unsignedBigInteger('file_size'); // Taille en octets
            $table->text('description')->nullable(); // Description optionnelle
            $table->integer('order')->default(0); // Ordre d'affichage

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_project_media');
    }
};
