<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\LogConnexionController;
use App\Http\Controllers\Api\FichierController;

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

// Routes pour les classes
Route::apiResource('classes', ClasseController::class);

// Routes pour les enseignants
Route::apiResource('enseignants', EnseignantController::class);

// Routes pour les parents
Route::apiResource('parents', ParentModelController::class);
