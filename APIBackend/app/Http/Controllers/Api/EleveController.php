<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    /**
     * Afficher la liste de tous les élèves.
     */
    public function index()
    {
        return response()->json(Eleve::all(), 200);
    }

    /**
     * Enregistrer un nouvel élève.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'date_naissance' => 'nullable|date',
            'classe_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:parent_models,id',
            'visible' => 'boolean',
        ]);

        $eleve = Eleve::create($validated);

        return response()->json($eleve, 201);
    }

    /**
     * Afficher un élève spécifique.
     */
    public function show(string $id)
    {
        $eleve = Eleve::find($id);

        if (!$eleve) {
            return response()->json(['message' => 'Élève non trouvé.'], 404);
        }

        return response()->json($eleve);
    }

    /**
     * Mettre à jour un élève existant.
     */
    public function update(Request $request, string $id)
    {
        $eleve = Eleve::find($id);

        if (!$eleve) {
            return response()->json(['message' => 'Élève non trouvé.'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'date_naissance' => 'nullable|date',
            'classe_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:parent_models,id',
            'visible' => 'boolean',
        ]);

        $eleve->update($validated);

        return response()->json($eleve);
    }

    /**
     * Supprimer un élève.
     */
    public function destroy(string $id)
    {
        $eleve = Eleve::find($id);

        if (!$eleve) {
            return response()->json(['message' => 'Élève non trouvé.'], 404);
        }

        $eleve->delete();

        return response()->json(['message' => 'Élève supprimé avec succès.']);
    }
}
