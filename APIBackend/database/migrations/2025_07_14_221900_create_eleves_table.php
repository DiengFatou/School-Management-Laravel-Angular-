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
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->date('date_naissance')->nullable();
            $table->foreignId('classe_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->foreignId('parent_id')->nullable()->constrained('parent_models')->onDelete('set null');
            $table->boolean('visible')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eleves');
    }
};
