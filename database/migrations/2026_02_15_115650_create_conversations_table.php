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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            // POUR VISITEURS NON-AUTHENTIFIÉS
            $table->string('visitor_name')->nullable();
            $table->string('visitor_email')->nullable();
            $table->string('visitor_ip')->nullable();

            // POUR CLIENTS AUTHENTIFIÉS (optionnel)
            $table->foreignId('client_user_id')->nullable()->constrained('users')->onDelete('cascade');

            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamp('last_message_at')->nullable();
            $table->integer('unread_admin_count')->default(0);
            $table->integer('unread_visitor_count')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('last_message_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
