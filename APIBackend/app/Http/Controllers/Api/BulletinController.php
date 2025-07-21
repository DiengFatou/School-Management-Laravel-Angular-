<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bulletin; // Importez votre modèle Bulletin
use Illuminate\Http\Request;

class BulletinController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retourne tous les bulletins, en chargeant les relations pour plus de contexte
        return response()->json(Bulletin::with(['eleve', 'anneeScolaire'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données pour la création d'un nouveau bulletin
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'trimestre' => 'required|string|max:20',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'pdf_path' => 'nullable|string|max:255', 
            'moyenne_generale' => 'nullable|numeric|min:0|max:20', 
            'mention' => 'nullable|string|max:50',
            'rang' => 'nullable|integer|min:1',
            'appreciation' => 'nullable|string',
            'date_generation' => 'required|date|before_or_equal:today',
           
        ]);

        // Création du bulletin
        $bulletin = Bulletin::create($validated);

        // Retourne le bulletin créé avec ses relations chargées et un statut 201 (Created)
        return response()->json($bulletin->load(['eleve', 'anneeScolaire']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Trouve un bulletin par son ID ou retourne une erreur 404, en chargeant les relations
        return response()->json(Bulletin::with(['eleve', 'anneeScolaire'])->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Récupération du bulletin à modifier
        $bulletin = Bulletin::findOrFail($id);

        // Validation des données pour la mise à jour
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'trimestre' => 'required|string|max:20',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'pdf_path' => 'nullable|string|max:255',
            'moyenne_generale' => 'nullable|numeric|min:0|max:20',
            'mention' => 'nullable|string|max:50',
            'rang' => 'nullable|integer|min:1',
            'appreciation' => 'nullable|string',
            'date_generation' => 'required|date|before_or_equal:today',
            
        ]);

        // Mettre à jour les champs du bulletin
        $bulletin->update($validated);

        // Retourner le bulletin mis à jour avec ses relations chargées
        return response()->json([
            'message' => 'Bulletin mis à jour avec succès',
            'data' => $bulletin->load(['eleve', 'anneeScolaire'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Supprime le bulletin par son ID ou retourne une erreur 404 si non trouvée
        Bulletin::findOrFail($id)->delete();

        // Retourne une réponse vide avec un statut 204 (No Content) pour indiquer le succès
        return response()->json(null, 204);
    }
}