<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fichier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FichierController extends Controller
{
    /**
     * Afficher la liste des fichiers.
     */
    public function index()
    {
        return response()->json(Fichier::all(), 200);
    }

    /**
     * Enregistrer un nouveau fichier.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file|max:10240', // max 10MB
        ]);

        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $nom = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $taille = $file->getSize();
            $path = $file->store('fichiers', 'public');

            $fichier = Fichier::create([
                'nom_du_fichier' => $nom,
                'path' => $path,
                'extension' => $extension,
                'taille' => $taille,
            ]);

            return response()->json($fichier, 201);
        }

        return response()->json(['error' => 'Aucun fichier trouvé'], 400);
    }

    /**
     * Afficher un fichier spécifique.
     */
    public function show(string $id)
    {
        $fichier = Fichier::find($id);

        if (!$fichier) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }

        return response()->json($fichier);
    }

    /**
     * Mettre à jour les informations d’un fichier (sauf le contenu du fichier).
     */
    public function update(Request $request, string $id)
    {
        $fichier = Fichier::find($id);

        if (!$fichier) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }

        $request->validate([
            'nom_du_fichier' => 'sometimes|string',
        ]);

        $fichier->update($request->only(['nom_du_fichier']));

        return response()->json($fichier);
    }

    /**
     * Supprimer un fichier (et son contenu).
     */
    public function destroy(string $id)
    {
        $fichier = Fichier::find($id);

        if (!$fichier) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }

        // Supprimer le fichier du stockage
        Storage::disk('public')->delete($fichier->path);

        // Supprimer l’entrée en base
        $fichier->delete();

        return response()->json(['message' => 'Fichier supprimé avec succès']);
    }
}
