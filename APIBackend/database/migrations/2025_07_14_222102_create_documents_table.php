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
        Schema::create('documents', function (Blueprint $table) {
            $table->id(); // id INT PRIMARY KEY AUTO_INCREMENT
            $table->unsignedBigInteger('eleve_id'); // eleve_id INT
            $table->string('type_document', 100); // type_document VARCHAR(100)
            $table->unsignedBigInteger('fichier_id'); // fichier_id INT
            $table->date('date_upload'); // date_upload DATE

            $table->timestamps(); // created_at et updated_at

            // Clés étrangères
            $table->foreign('eleve_id')->references('id')->on('eleves')->onDelete('cascade');
            $table->foreign('fichier_id')->references('id')->on('fichiers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
