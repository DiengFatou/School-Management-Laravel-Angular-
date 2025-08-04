<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Eleve;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EleveUserController extends Controller
{
    /**
     * Créer un nouvel élève avec un utilisateur associé
     */
    public function store(Request $request)
    {
        // Valider les données de la requête
        $validated = $request->validate([
            'user' => 'required|array',
            'user.nom' => 'required|string|max:255',
            'user.email' => 'required|string|email|max:255|unique:users,email',
            'user.mot_de_passe' => 'required|string|min:6',
            'user.role' => 'required|in:eleve,admin,enseignant,parent',
            'eleve' => 'required|array',
            'eleve.nom' => 'required|string|max:100',
            'eleve.prenom' => 'required|string|max:100',
            'eleve.date_naissance' => 'nullable|date',
            'eleve.classe_id' => 'nullable|exists:classes,id',
            'eleve.parent_id' => 'nullable|exists:parent_models,id',
            'eleve.visible' => 'boolean',
        ]);

        try {
            // Démarrer une transaction pour assurer l'intégrité des données
            return DB::transaction(function () use ($validated, $request) {
                // Créer l'utilisateur
                $userData = $validated['user'];
                
                $user = new User([
                    'nom' => $userData['nom'],
                    'email' => $userData['email'],
                    'mot_de_passe' => Hash::make($userData['mot_de_passe']),
                    'role' => 'eleve', // Forcer le rôle à 'eleve'
                    'is_active' => true,
                ]);
                
                if (!$user->save()) {
                    throw new \Exception("Erreur lors de la création de l'utilisateur");
                }

                // Créer l'élève associé à l'utilisateur
                $eleveData = $validated['eleve'];
                
                $eleve = new Eleve([
                    'user_id' => $user->id,
                    'nom' => $eleveData['nom'],
                    'prenom' => $eleveData['prenom'],
                    'date_naissance' => $eleveData['date_naissance'] ?? null,
                    'classe_id' => isset($eleveData['classe_id']) ? (int)$eleveData['classe_id'] : null,
                    'parent_id' => isset($eleveData['parent_id']) ? (int)$eleveData['parent_id'] : null,
                    'visible' => $eleveData['visible'] ?? true,
                ]);
                
                if (!$eleve->save()) {
                    throw new \Exception("Erreur lors de la création de l'élève");
                }

                // Charger les relations pour la réponse
                $eleve->load('classe', 'parent');
                $eleve->user = $user;

                // Retourner la réponse avec les données créées
                return response()->json([
                    'success' => true,
                    'message' => 'Élève créé avec succès',
                    'data' => $eleve
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'élève: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }
}
