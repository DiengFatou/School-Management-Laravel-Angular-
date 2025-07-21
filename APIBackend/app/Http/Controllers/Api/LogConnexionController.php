<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogConnexion;
use Illuminate\Http\Request;

class LogConnexionController extends Controller
{
    /**
     * Afficher tous les logs de connexion.
     */
    public function index()
    {
        return response()->json(LogConnexion::all(), 200);
    }

    /**
     * Enregistrer un nouveau log de connexion.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'       => 'required|exists:users,id',
            'adresse_ip'    => 'required|ip',
            'navigateur'    => 'required|string|max:255',
            'date_connexion'=> 'nullable|date',
        ]);

        $log = LogConnexion::create($validated);

        return response()->json($log, 201);
    }

    /**
     * Afficher un log spécifique.
     */
    public function show(string $id)
    {
        $log = LogConnexion::findOrFail($id);
        return response()->json($log);
    }

    /**
     * Mettre à jour un log de connexion.
     */
    public function update(Request $request, string $id)
    {
        $log = LogConnexion::findOrFail($id);

        $validated = $request->validate([
            'adresse_ip'    => 'sometimes|required|ip',
            'navigateur'    => 'sometimes|required|string|max:255',
            'date_connexion'=> 'nullable|date',
        ]);

        $log->update($validated);

        return response()->json($log);
    }

    /**
     * Supprimer un log.
     */
    public function destroy(string $id)
    {
        $log = LogConnexion::findOrFail($id);
        $log->delete();

        return response()->json(['message' => 'Log supprimé avec succès']);
    }
}
