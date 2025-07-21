<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Afficher la liste des notifications.
     */
    public function index()
    {
        return response()->json(Notification::all(), 200);
    }

    /**
     * Enregistrer une nouvelle notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'    => 'required|exists:users,id',
            'titre'      => 'required|string|max:255',
            'contenu'    => 'required|string',
            'date_envoi' => 'required|date',
            'vu'         => 'boolean',
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification, 201);
    }

    /**
     * Afficher une notification spécifique.
     */
    public function show(string $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }

        return response()->json($notification);
    }

    /**
     * Mettre à jour une notification.
     */
    public function update(Request $request, string $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }

        $validated = $request->validate([
            'user_id'    => 'sometimes|exists:users,id',
            'titre'      => 'sometimes|string|max:255',
            'contenu'    => 'sometimes|string',
            'date_envoi' => 'sometimes|date',
            'vu'         => 'sometimes|boolean',
        ]);

        $notification->update($validated);

        return response()->json($notification);
    }

    /**
     * Supprimer une notification.
     */
    public function destroy(string $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification supprimée avec succès.']);
    }
}
