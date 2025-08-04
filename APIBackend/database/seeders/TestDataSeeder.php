<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Désactiver temporairement la vérification des clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Nettoyer les tables existantes dans l'ordre inverse des dépendances
        DB::table('eleves')->truncate();
        DB::table('parent_models')->truncate();
        DB::table('classes')->truncate();
        DB::table('users')->truncate();
        
        // Réactiver la vérification des clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // 1. Créer les utilisateurs (admin, enseignants, parents, élèves)
        $users = [
            // Admin
            [
                'nom' => 'Admin Principal',
                'email' => 'admin@school.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'admin',
                'photo_profil' => null,
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Enseignants
            [
                'nom' => 'Marie Dupont',
                'email' => 'marie.dupont@school.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'enseignant',
                'photo_profil' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Jean Martin',
                'email' => 'jean.martin@school.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'enseignant',
                'photo_profil' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Sophie Bernard',
                'email' => 'sophie.bernard@school.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'enseignant',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Pierre Leroy',
                'email' => 'pierre.leroy@school.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'enseignant',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Parents
            [
                'nom' => 'Michel Dubois',
                'email' => 'michel.dubois@email.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Catherine Moreau',
                'email' => 'catherine.moreau@email.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'François Petit',
                'email' => 'francois.petit@email.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Isabelle Roux',
                'email' => 'isabelle.roux@email.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Laurent Simon',
                'email' => 'laurent.simon@email.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Élèves
            [
                'nom' => 'Lucas Dubois',
                'email' => 'lucas.dubois@student.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'eleve',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Emma Moreau',
                'email' => 'emma.moreau@student.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'eleve',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Thomas Petit',
                'email' => 'thomas.petit@student.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'eleve',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Léa Roux',
                'email' => 'lea.roux@student.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'eleve',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Hugo Simon',
                'email' => 'hugo.simon@student.com',
                'mot_de_passe' => Hash::make('password123'),
                'role' => 'eleve',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insérer les utilisateurs
        $userIds = [];
        foreach ($users as $user) {
            $userIds[] = DB::table('users')->insertGetId($user);
        }

        // 2. Créer les classes
        $classes = [
            [
                'nom' => '6ème A',
                'niveau' => '6ème',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '6ème B',
                'niveau' => '6ème',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '5ème A',
                'niveau' => '5ème',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '4ème A',
                'niveau' => '4ème',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '3ème A',
                'niveau' => '3ème',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insérer les classes
        foreach ($classes as $classe) {
            DB::table('classes')->insert($classe);
        }

        // 3. Créer les parents (parent_models)
        // Les 5 premiers utilisateurs sont admin/enseignants, les 5 suivants sont parents, puis les élèves
        $parentStartIndex = 5; // Index de départ des parents dans le tableau $users
        $parents = [
            [
                'user_id' => $userIds[$parentStartIndex], // Premier parent
                'telephone' => '06 12 34 56 78',
                'adresse' => '123 Rue de la Paix, 75001 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userIds[$parentStartIndex + 1], // Deuxième parent
                'telephone' => '06 23 45 67 89',
                'adresse' => '456 Avenue des Champs, 75008 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userIds[$parentStartIndex + 2], // Troisième parent
                'telephone' => '06 34 56 78 90',
                'adresse' => '789 Boulevard Saint-Germain, 75006 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userIds[$parentStartIndex + 3], // Quatrième parent
                'telephone' => '06 45 67 89 01',
                'adresse' => '321 Rue du Commerce, 75015 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userIds[$parentStartIndex + 4], // Cinquième parent
                'telephone' => '06 56 78 90 12',
                'adresse' => '654 Avenue de la République, 75011 Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insérer les parents
        foreach ($parents as $parent) {
            DB::table('parent_models')->insert($parent);
        }

        // 4. Créer les élèves
        $eleveUserIds = DB::table('users')->where('role', 'eleve')->pluck('id')->toArray();
        $classeIds = DB::table('classes')->pluck('id')->toArray();
        $parentIds = DB::table('parent_models')->pluck('id')->toArray();

        $eleves = [
            [
                'user_id' => $eleveUserIds[0],
                'nom' => 'Dubois',
                'prenom' => 'Lucas',
                'date_naissance' => '2012-03-15',
                'classe_id' => $classeIds[0], // 6ème A
                'parent_id' => $parentIds[0],
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $eleveUserIds[1],
                'nom' => 'Moreau',
                'prenom' => 'Emma',
                'date_naissance' => '2011-07-22',
                'classe_id' => $classeIds[1], // 6ème B
                'parent_id' => $parentIds[1],
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $eleveUserIds[2],
                'nom' => 'Petit',
                'prenom' => 'Thomas',
                'date_naissance' => '2010-11-08',
                'classe_id' => $classeIds[2], // 5ème A
                'parent_id' => $parentIds[2],
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $eleveUserIds[3],
                'nom' => 'Roux',
                'prenom' => 'Léa',
                'date_naissance' => '2009-05-14',
                'classe_id' => $classeIds[3], // 4ème A
                'parent_id' => $parentIds[3],
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $eleveUserIds[4],
                'nom' => 'Simon',
                'prenom' => 'Hugo',
                'date_naissance' => '2008-09-30',
                'classe_id' => $classeIds[4], // 3ème A
                'parent_id' => $parentIds[4],
                'visible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insérer les élèves
        foreach ($eleves as $eleve) {
            DB::table('eleves')->insert($eleve);
        }

        echo "✅ Données de test ajoutées avec succès !\n";
        echo "📊 Résumé :\n";
        echo "   - 1 Admin\n";
        echo "   - 4 Enseignants\n";
        echo "   - 5 Parents\n";
        echo "   - 5 Élèves\n";
        echo "   - 5 Classes\n";
        echo "\n🔑 Identifiants de connexion :\n";
        echo "   - Admin: admin@school.com / password123\n";
        echo "   - Enseignants: marie.dupont@school.com / password123\n";
        echo "   - Parents: michel.dubois@email.com / password123\n";
        echo "   - Élèves: lucas.dubois@student.com / password123\n";
    }
} 