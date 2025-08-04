<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vérifier si la colonne existe avant de la modifier
        if (Schema::hasColumn('enseignants', 'user_id')) {
            // Pour SQLite, nous allons créer une nouvelle table, copier les données,
            // supprimer l'ancienne table et renommer la nouvelle
            
            // 1. Désactiver temporairement les contraintes de clé étrangère
            Schema::disableForeignKeyConstraints();
            
            // 2. Créer une nouvelle table temporaire avec la structure modifiée
            DB::statement('CREATE TABLE enseignants_temp (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT UNSIGNED NULL,
                nom_complet VARCHAR(100) NOT NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            
            // 3. Copier les données de l'ancienne table vers la nouvelle
            DB::statement('INSERT INTO enseignants_temp (id, user_id, nom_complet, created_at, updated_at) 
                          SELECT id, user_id, nom_complet, created_at, updated_at FROM enseignants');
            
            // 4. Supprimer l'ancienne table
            Schema::dropIfExists('enseignants');
            
            // 5. Renommer la table temporaire
            Schema::rename('enseignants_temp', 'enseignants');
            
            // 6. Réactiver les contraintes de clé étrangère
            Schema::enableForeignKeyConstraints();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('enseignants', 'user_id')) {
            // Désactiver temporairement les contraintes de clé étrangère
            Schema::disableForeignKeyConstraints();
            
            // Créer une table temporaire avec la structure d'origine
            DB::statement('CREATE TABLE enseignants_temp (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT UNSIGNED NOT NULL,
                nom_complet VARCHAR(100) NOT NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )');
            
            // Copier les données en s'assurant que user_id n'est pas null
            // Ici, on met 1 comme valeur par défaut pour user_id (assurez-vous que l'utilisateur 1 existe)
            DB::statement('INSERT INTO enseignants_temp (id, user_id, nom_complet, created_at, updated_at) 
                          SELECT id, IFNULL(user_id, 1), nom_complet, created_at, updated_at FROM enseignants');
            
            // Supprimer l'ancienne table
            Schema::dropIfExists('enseignants');
            
            // Renommer la table temporaire
            Schema::rename('enseignants_temp', 'enseignants');
            
            // Réactiver les contraintes de clé étrangère
            Schema::enableForeignKeyConstraints();
        }
    }
};
