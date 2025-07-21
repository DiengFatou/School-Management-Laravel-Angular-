<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note; // Utilisation du modèle Note
use Illuminate\Http\Request; // Utilisation de Request pour la validation directe dans le contrôleur
// use App\Http\Resources\NoteResource; // Commenté, comme dans votre EtudiantController

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Identique à EtudiantController::index()
        return response()->json(Note::all());
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
            'valeur_note' => 'required|numeric|min:0|max:20', // Ex: required, numérique, min/max
            'date_evaluation' => 'nullable|date',             // Ex: nullable, date
            'commentaire' => 'nullable|string|max:500',      // Ex: nullable, string, max
        ]);

        // Création de l'instance du modèle avec les données validées
        $note = Note::create([
            'etudiant_id' => $validated['etudiant_id'],
            'matiere_id' => $validated['matiere_id'],
            'valeur_note' => $validated['valeur_note'],
            'date_evaluation' => $validated['date_evaluation'],
            'commentaire' => $validated['commentaire'],
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