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
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->string('trimestre', 20);
            $table->foreignId('annee_scolaire_id')->constrained('annees_scolaires')->onDelete('cascade');
            $table->string('pdf_path', 255)->nullable(); 
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->string('mention', 50)->nullable();
            $table->integer('rang')->nullable();
            $table->text('appreciation')->nullable();
            $table->date('date_generation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletins');
    }
};
