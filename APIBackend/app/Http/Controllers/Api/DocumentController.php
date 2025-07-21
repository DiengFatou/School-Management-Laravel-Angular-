<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Afficher la liste des documents.
     */
    public function index()
    {
        return Document::with(['eleve', 'fichier'])->get();
    }

    /**
     * Enregistrer un nouveau document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'type_document' => 'required|string|max:100',
            'fichier_id' => 'required|exists:fichiers,id',
            'date_upload' => 'required|date',
        ]);

        $document = Document::create($validated);

        return response()->json($document, 201);
    }

    /**
     * Afficher un document spécifique.
     */
    public function show($id)
    {
        $document = Document::with(['eleve', 'fichier'])->findOrFail($id);
        return response()->json($document);
    }

    /**
     * Mettre à jour un document existant.
     */
    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $validated = $request->validate([
            'eleve_id' => 'sometimes|exists:eleves,id',
            'type_document' => 'sometimes|string|max:100',
            'fichier_id' => 'sometimes|exists:fichiers,id',
            'date_upload' => 'sometimes|date',
        ]);

        $document->update($validated);

        return response()->json($document);
    }

    /**
     * Supprimer un document.
     */
    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $document->delete();

        return response()->json(null, 204);
    }
}
