<?php

use App\Http\Controllers\Api\AnneeScolaireController;
use App\Http\Controllers\Api\BulletinController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\NoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\EnseignantController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\LogConnexionController;
use App\Http\Controllers\Api\FichierController;
use App\Http\Controllers\Api\ParentModelController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EleveUserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes pour les documents
Route::apiResource('documents', DocumentController::class);

// Routes pour les notifications
Route::apiResource('notifications', NotificationController::class);

// Routes pour les logs de connexion
Route::apiResource('log-connexions', LogConnexionController::class);

// Routes pour les fichiers
Route::apiResource('fichiers', FichierController::class);

// Routes pour les élèves
Route::apiResource('eleves', EleveController::class);

// Route pour créer un élève avec un utilisateur associé
Route::post('eleves/with-user', [EleveUserController::class, 'store']);

// Routes pour les classes
Route::apiResource('classes', ClasseController::class);

// Routes pour les enseignants
Route::apiResource('enseignants', EnseignantController::class);

// Routes pour les parents
Route::apiResource('parents', ParentModelController::class);
Route::apiResource('notes', NoteController::class);

// Routes pour les matières
Route::apiResource('matieres', MatiereController::class);
Route::apiResource('annee-scolaires', AnneeScolaireController::class);
Route::apiResource('enseignements', EnseignantController::class);
Route::apiResource('matieres', MatiereController::class);
// Routes pour les bulletins
Route::apiResource('bulletins', BulletinController::class);
Route::post('bulletins/generer', [BulletinController::class, 'genererBulletins']);
Route::get('bulletins/{id}/telecharger', [BulletinController::class, 'telechargerPdf']);
Route::post('bulletins/telecharger-tous', [BulletinController::class, 'telechargerTousBulletins']);
Route::apiResource('users', UserController::class);