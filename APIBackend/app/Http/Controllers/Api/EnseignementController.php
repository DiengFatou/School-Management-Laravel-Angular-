<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignements;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; 

class EnseignementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Enseignements::with(['enseignant', 'classe', 'matiere'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'enseignant_id' => 'required|exists:enseignants,id',
            'classe_id' => 'required|exists:classes,id',     
            'matiere_id' => 'required|exists:matieres,id'
        ]);

        // Create the enseignement record
        $enseignement = Enseignements::create($validated);

           return response()->json($enseignement->load(['enseignant', 'classe', 'matiere']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Enseignements::with(['enseignant', 'classe', 'matiere'])->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $enseignement = Enseignements::findOrFail($id);

        $validated = $request->validate([
            'enseignant_id' => 'required|exists:enseignants,id',
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id'
        ]);

        $enseignement->update($validated);

        return response()->json([
            'message' => 'Enseignement mis à jour avec succès',
            'data' => $enseignement->load(['enseignant', 'classe', 'matiere'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Enseignements::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}