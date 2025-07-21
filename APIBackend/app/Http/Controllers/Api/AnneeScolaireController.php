<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
// Changez de App\Models\Annee_Scolaires à App\Models\AnneeScolaire
use App\Models\AnneeScolaire; // <-- MODIFIÉ ICI
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnneeScolaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Changez de Annee_Scolaires::all() à AnneeScolaire::all()
        return response()->json(AnneeScolaire::all()); // <-- MODIFIÉ ICI
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'libelle' => 'required|string|max:20|unique:annee_scolaires,libelle',
            'active' => 'boolean',
        ]);

        // Changez de Annee_Scolaires::create() à AnneeScolaire::create()
        $anneeScolaire = AnneeScolaire::create($validated); // <-- MODIFIÉ ICI

        return response()->json($anneeScolaire, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Changez de Annee_Scolaires::findOrFail() à AnneeScolaire::findOrFail()
        return response()->json(AnneeScolaire::findOrFail($id)); // <-- MODIFIÉ ICI
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Changez de Annee_Scolaires::findOrFail() à AnneeScolaire::findOrFail()
        $anneeScolaire = AnneeScolaire::findOrFail($id); // <-- MODIFIÉ ICI

        $validated = $request->validate([
            'libelle' => [
                'required',
                'string',
                'max:20',
                Rule::unique('annee_scolaires', 'libelle')->ignore($anneeScolaire->id), 
            ],
            'active' => 'boolean',
        ]);

        $anneeScolaire->update($validated);

        return response()->json([
            'message' => 'Année scolaire mise à jour avec succès',
            'data' => $anneeScolaire
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Changez de Annee_Scolaires::findOrFail() à AnneeScolaire::findOrFail()
        AnneeScolaire::findOrFail($id)->delete(); // <-- MODIFIÉ ICI

        return response()->json(null, 204);
    }
}