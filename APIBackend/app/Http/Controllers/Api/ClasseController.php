<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    /**
     * Afficher la liste de toutes les classes.
     */
    public function index()
    {
        return response()->json(Classe::all(), 200);
    }

    /**
     * Enregistrer une nouvelle classe.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:50',
            'niveau' => 'required|string|max:50',
            'annee_scolaire_id' => 'nullable|exists:annee_scolaires,id',
        ]);

        $classe = Classe::create($validated);

        return response()->json($classe, 201);
    }

    /**
     * Afficher une classe spécifique.
     */
    public function show(string $id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json(['message' => 'Classe non trouvée.'], 404);
        }

        return response()->json($classe);
    }

    /**
     * Mettre à jour une classe spécifique.
     */
    public function update(Request $request, string $id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json(['message' => 'Classe non trouvée.'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:50',
            'niveau' => 'sometimes|required|string|max:50',
            'annee_scolaire_id' => 'nullable|exists:annee_scolaires,id',
        ]);

        $classe->update($validated);

        return response()->json($classe);
    }

    /**
     * Supprimer une classe spécifique.
     */
    public function destroy(string $id)
    {
        $classe = Classe::find($id);

        if (!$classe) {
            return response()->json(['message' => 'Classe non trouvée.'], 404);
        }

        $classe->delete();

        return response()->json(['message' => 'Classe supprimée avec succès.']);
    }
}
