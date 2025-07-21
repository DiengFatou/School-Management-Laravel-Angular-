<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere; // Importez votre modèle Matiere
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Importez Rule pour la validation unique en update

class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retourne toutes les matières
        return response()->json(Matiere::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données pour la création d'une nouvelle matière
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:matieres,nom', // Le nom de la matière doit être unique
            'coefficient' => 'required|integer|min:1', // Le coefficient doit être un entier positif
            'niveau' => 'required|string|max:50', // Le niveau est une chaîne de caractères
        ]);

        // Création de la matière
        $matiere = Matiere::create($validated);

        // Retourne la matière créée avec un statut 201 (Created)
        return response()->json($matiere, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Trouve une matière par son ID ou retourne une erreur 404
        return response()->json(Matiere::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Récupération de la matière à modifier
        $matiere = Matiere::findOrFail($id);

        // Validation des données pour la mise à jour
        $validated = $request->validate([
            'nom' => [
                'required',
                'string',
                'max:100',
                Rule::unique('matieres', 'nom')->ignore($matiere->id), // Ignore l'ID actuel pour l'unicité du nom
            ],
            'coefficient' => 'required|integer|min:1',
            'niveau' => 'required|string|max:50',
        ]);

        // Mettre à jour les champs de la matière
        $matiere->update($validated);

        // Retourner la matière mise à jour
        return response()->json([
            'message' => 'Matière mise à jour avec succès',
            'data' => $matiere
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Supprime la matière par son ID ou retourne une erreur 404 si non trouvée
        Matiere::findOrFail($id)->delete();

        // Retourne une réponse vide avec un statut 204 (No Content) pour indiquer le succès
        return response()->json(null, 204);
    }
}