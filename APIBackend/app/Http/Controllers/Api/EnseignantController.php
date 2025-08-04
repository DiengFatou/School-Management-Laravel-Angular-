<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnseignantController extends Controller
{
    /**
     * Afficher la liste de tous les enseignants avec leurs relations.
     */
    public function index()
    {
        $enseignants = Enseignant::with([
            'enseignements',
            'enseignements.matiere',
            'enseignements.classe',
            'enseignements.classe.anneeScolaire',
            'matieres',
            'classes',
            'user'
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $enseignants,
            'message' => 'Liste des enseignants récupérée avec succès.'
        ], 200);
    }

    /**
     * Enregistrer un nouvel enseignant.
     */
    public function store(Request $request)
    {
        \Log::info('Début de la création d\'un enseignant', ['request' => $request->all()]);
        
        try {
            // Valider les données de la requête
            $validated = $request->validate([
                'user_id' => 'nullable|exists:users,id',
                'nom_complet' => 'required|string|max:100',
            ]);

            // Nettoyer les données
            $validated['nom_complet'] = trim($validated['nom_complet']);
            
            \Log::info('Données validées et nettoyées', $validated);
            
            // Vérifier si un enseignant avec le même nom existe déjà
            $existingEnseignant = Enseignant::where('nom_complet', $validated['nom_complet'])->first();
            
            if ($existingEnseignant) {
                \Log::warning('Tentative de création d\'un enseignant existant', ['nom_complet' => $validated['nom_complet']]);
                return response()->json([
                    'success' => false,
                    'message' => 'Un enseignant avec ce nom existe déjà.',
                    'data' => $existingEnseignant
                ], 409); // 409 Conflict
            }

            // Valider les données pour l'enseignement
            $enseignementData = $request->validate([
                'classe_id' => 'required|exists:classes,id',
                'matiere_id' => 'required|exists:matieres,id'
            ]);
            
            \Log::info('Tentative de création de l\'enseignant et de son enseignement');
            
            // Utiliser une transaction pour assurer l'intégrité des données
            \DB::beginTransaction();
            
            try {
                // Créer l'enseignant
                $enseignant = Enseignant::create($validated);
                \Log::info('Enseignant créé avec succès', ['enseignant_id' => $enseignant->id]);
                
                // Créer l'enseignement associé
                $enseignement = $enseignant->enseignements()->create([
                    'classe_id' => $enseignementData['classe_id'],
                    'matiere_id' => $enseignementData['matiere_id']
                ]);
                \Log::info('Enseignement créé avec succès', ['enseignement_id' => $enseignement->id]);
                
                // Valider la transaction
                \DB::commit();
                
            } catch (\Exception $e) {
                // Annuler la transaction en cas d'erreur
                \DB::rollBack();
                \Log::error('Erreur lors de la création de l\'enseignant ou de l\'enseignement', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'validated' => $validated,
                    'enseignement_data' => $enseignementData ?? null
                ]);
                throw $e; // Relancer l'exception pour qu'elle soit traitée par le bloc catch global
            }

            // Charger les relations pour la réponse
            $enseignant->load(['enseignements', 'enseignements.matiere', 'enseignements.classe']);

            $response = [
                'success' => true,
                'message' => 'Enseignant créé avec succès.',
                'data' => $enseignant
            ];
            
            \Log::info('Réponse de création d\'enseignant', $response);
            
            return response()->json($response, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Gestion des erreurs de validation
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation des données.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            // Gestion des autres erreurs
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la création de l\'enseignant.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un enseignant spécifique avec ses relations.
     */
    public function show(string $id)
    {
        $enseignant = Enseignant::with([
            'enseignements',
            'enseignements.matiere',
            'enseignements.classe',
            'enseignements.classe.anneeScolaire',
            'matieres',
            'classes',
            'user'
        ])->find($id);

        if (!$enseignant) {
            return response()->json([
                'success' => false,
                'message' => 'Enseignant non trouvé.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $enseignant,
            'message' => 'Détails de l\'enseignant récupérés avec succès.'
        ]);
    }

    /**
     * Mettre à jour un enseignant spécifique.
     */
    public function update(Request $request, string $id)
    {
        $enseignant = Enseignant::find($id);

        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant non trouvé.'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'nom_complet' => 'sometimes|required|string|max:100',
        ]);

        $enseignant->update($validated);

        return response()->json($enseignant);
    }

    /**
     * Supprimer un enseignant spécifique.
     */
    public function destroy(string $id)
    {
        $enseignant = Enseignant::find($id);

        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant non trouvé.'], 404);
        }

        $enseignant->delete();

        return response()->json(['message' => 'Enseignant supprimé avec succès.']);
    }
}
