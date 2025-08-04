<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note; // Utilisation du modèle Note
use Illuminate\Http\Request; // Utilisation de Request pour la validation directe dans le contrôleur
use Illuminate\Support\Facades\Log; // Pour le logging des erreurs
// use App\Http\Resources\NoteResource; // Commenté, comme dans votre EtudiantController

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Récupération de toutes les notes avec les relations nécessaires
            $notes = Note::with([
                'eleve.user',           // Informations de l'élève et son utilisateur associé
                'eleve.classe',         // Classe de l'élève
                'eleve.parent.user',    // Parent de l'élève et son utilisateur associé
                'matiere',              // Matière de la note
                'matiere.enseignants.user', // Enseignants de la matière avec leurs infos utilisateur
                'matiere.enseignements' // Enseignements pour les coefficients
            ])
            ->with(['matiere.enseignants' => function($query) {
                // Chargement explicite de la relation enseignants avec l'utilisateur
                $query->with('user');
            }])
            ->get();

            $formattedNotes = $notes->map(function($note) {
                // Vérification des relations pour éviter les erreurs
                $eleve = $note->eleve;
                if (!$eleve) {
                    return null;
                }

                $matiere = $note->matiere;
                // Vérification de l'existence de la relation enseignants
                $enseignant = null;
                if ($matiere && method_exists($matiere, 'enseignants') && $matiere->relationLoaded('enseignants')) {
                    $enseignant = $matiere->enseignants->first();
                }
                $classe = $eleve->classe;
                $parent = $eleve->parent;
                
                $noteData = [
                    'id' => $note->id,
                    'valeur_note' => $note->note,
                    'date_evaluation' => $note->date_evaluation,
                    'commentaire' => $note->commentaire,
                    'eleve' => [
                        'id' => $eleve->id,
                        'nom' => $eleve->nom ?? 'Inconnu',
                        'prenom' => $eleve->prenom ?? '',
                        'matricule' => $eleve->matricule ?? '',
                        'date_naissance' => $eleve->date_naissance ?? null,
                        'classe' => $classe ? [
                            'id' => $classe->id,
                            'nom' => $classe->nom ?? 'Non défini',
                            'niveau' => $classe->niveau ?? ''
                        ] : [
                            'id' => 0,
                            'nom' => 'Non défini',
                            'niveau' => ''
                        ]
                    ],
                    'matiere' => [
                        'id' => $matiere ? $matiere->id : 0,
                        'nom' => $matiere ? $matiere->nom : 'Matière inconnue',
                        'coefficient' => $matiere ? ($matiere->coefficient ?? 1) : 1,
                        'enseignant' => $enseignant && $enseignant->user 
                            ? [
                                'id' => $enseignant->id,
                                'nom' => $enseignant->user->nom ?? 'Inconnu',
                                'prenom' => $enseignant->user->prenom ?? ''
                            ] 
                            : null
                    ]
                ];

                // Ajout des informations du parent si disponible
                if ($parent && $parent->user) {
                    $noteData['parent'] = [
                        'id' => $parent->id,
                        'nom' => $parent->user->nom ?? 'Inconnu',
                        'prenom' => $parent->user->prenom ?? '',
                        'email' => $parent->user->email ?? '',
                        'telephone' => $parent->telephone ?? ''
                    ];
                } else {
                    $noteData['parent'] = null;
                }

                return $noteData;
            })->filter(); // Supprime les entrées null
            
            return response()->json($formattedNotes->values());
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des notes: ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des notes',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // Reçoit Request $request
    {
        // Validation directe dans le contrôleur, comme dans EtudiantController::store()
        $validated = $request->validate([
            'etudiant_id' => 'required|exists:etudiants,id', // Ex: required, existe
            'matiere_id' => 'required|exists:matieres,id',   // Ex: required, existe
            'note' => 'required|numeric|min:0|max:20', // Correction: utiliser 'note' au lieu de 'valeur_note'
            'date_evaluation' => 'nullable|date',             // Ex: nullable, date
            'commentaire' => 'nullable|string|max:500',      // Ex: nullable, string, max
        ]);

        // Création de l'instance du modèle avec les données validées
        $note = Note::create([
            'eleve_id' => $validated['etudiant_id'], // Correction: 'eleve_id' au lieu de 'etudiant_id'
            'matiere_id' => $validated['matiere_id'],
            'note' => $validated['note'], // Correction: 'note' au lieu de 'valeur_note'
            'date_evaluation' => $validated['date_evaluation'] ?? null,
            'commentaire' => $validated['commentaire'] ?? null,
            // Ajout des champs manquants avec des valeurs par défaut
            'enseignant_id' => 1, // À remplacer par la logique appropriée
            'trimestre' => '1er trimestre', // À remplacer par la logique appropriée
            'annee_scolaire_id' => 1, // À remplacer par la logique appropriée
        ]);

        return response()->json($note, 201); // Retourne l'instance créée avec statut 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Identique à EtudiantController::show()
        return response()->json(Note::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) // Reçoit Request $request
    {
        // Récupération de la note à modifier, comme dans EtudiantController::update()
        $note = Note::findOrFail($id);

        // Validation directe dans le contrôleur, comme dans EtudiantController::update()
        // Note: La règle 'unique' n'est généralement pas pertinente pour les notes par ID,
        // mais si vous aviez une contrainte unique composite (ex: unique(etudiant_id, matiere_id)),
        // la logique 'unique:table,column,id' serait utilisée de manière similaire.
        $validated = $request->validate([
            'etudiant_id' => 'required|exists:etudiants,id',
            'matiere_id' => 'required|exists:matieres,id',
            'valeur_note' => 'required|numeric|min:0|max:20',
            'date_evaluation' => 'nullable|date',
            'commentaire' => 'nullable|string|max:500',
        ]);

        // Mettre à jour les champs de la note
        $note->update([
            'etudiant_id' => $validated['etudiant_id'],
            'matiere_id' => $validated['matiere_id'],
            'valeur_note' => $validated['valeur_note'],
            'date_evaluation' => $validated['date_evaluation'],
            'commentaire' => $validated['commentaire'],
        ]);

        return response()->json([
            'message' => 'Note mise à jour avec succès', 
            'data' => $note
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Identique à EtudiantController::destroy()
        Note::findOrFail($id)->delete();
        return response()->json(null, 204); // Retourne une réponse vide avec statut 204
    }
}