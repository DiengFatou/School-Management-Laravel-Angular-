<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use Illuminate\Http\Request;

class EnseignantController extends Controller
{
    /**
     * Afficher la liste de tous les enseignants.
     */
    public function index()
    {
        return response()->json(Enseignant::all(), 200);
    }

    /**
     * Enregistrer un nouvel enseignant.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nom_complet' => 'required|string|max:100',
        ]);

        $enseignant = Enseignant::create($validated);

        return response()->json($enseignant, 201);
    }

    /**
     * Afficher un enseignant spécifique.
     */
    public function show(string $id)
    {
        $enseignant = Enseignant::find($id);

        if (!$enseignant) {
            return response()->json(['message' => 'Enseignant non trouvé.'], 404);
        }

        return response()->json($enseignant);
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
