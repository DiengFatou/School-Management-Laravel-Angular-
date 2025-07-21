<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use Illuminate\Http\Request;

class ParentModelController extends Controller
{
    /**
     * Afficher la liste de tous les parents.
     */
    public function index()
    {
        return response()->json(ParentModel::all(), 200);
    }

    /**
     * Enregistrer un nouveau parent.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
        ]);

        $parent = ParentModel::create($validated);

        return response()->json($parent, 201);
    }

    /**
     * Afficher un parent spécifique.
     */
    public function show(string $id)
    {
        $parent = ParentModel::find($id);

        if (!$parent) {
            return response()->json(['message' => 'Parent non trouvé.'], 404);
        }

        return response()->json($parent);
    }

    /**
     * Mettre à jour un parent spécifique.
     */
    public function update(Request $request, string $id)
    {
        $parent = ParentModel::find($id);

        if (!$parent) {
            return response()->json(['message' => 'Parent non trouvé.'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
        ]);

        $parent->update($validated);

        return response()->json($parent);
    }

    /**
     * Supprimer un parent spécifique.
     */
    public function destroy(string $id)
    {
        $parent = ParentModel::find($id);

        if (!$parent) {
            return response()->json(['message' => 'Parent non trouvé.'], 404);
        }

        $parent->delete();

        return response()->json(['message' => 'Parent supprimé avec succès.']);
    }
}
