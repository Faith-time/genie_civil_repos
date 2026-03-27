<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_projects', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');

            // Informations du projet
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();

            // Budget
            $table->decimal('budget_estimate_min', 15, 2)->nullable();
            $table->decimal('budget_estimate_max', 15, 2)->nullable();

            // Planning
            $table->date('desired_start_date')->nullable();
            $table->enum('urgency', ['urgent', 'normal', 'flexible'])->default('normal');

            // Statut & workflow
            $table->enum('status', [
                'pending',
                'under_review',
                'quoted',
                'accepted',
                'rejected',
                'in_progress',
                'completed'
            ])->default('pending');

            // Devis
            $table->decimal('quote_amount', 15, 2)->nullable();
            $table->string('quote_file')->nullable(); // Chemin du PDF du devis
            $table->text('admin_notes')->nullable(); // Notes privées de l'ingénieur

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_projects');
    }
};
