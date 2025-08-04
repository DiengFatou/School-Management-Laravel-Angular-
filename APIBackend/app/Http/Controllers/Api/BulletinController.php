<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use App\Models\Classe;
use App\Services\BulletinService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class BulletinController extends Controller
{
    protected $bulletinService;

    public function __construct(BulletinService $bulletinService)
    {
        $this->bulletinService = $bulletinService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Vérifier si des filtres sont présents
        if ($request->has(['annee_scolaire_id', 'trimestre', 'classe_id'])) {
            $bulletins = Bulletin::with(['eleve', 'anneeScolaire', 'notes.matiere'])
                ->where('annee_scolaire_id', $request->annee_scolaire_id)
                ->where('trimestre', $request->trimestre)
                ->whereHas('eleve', function($query) use ($request) {
                    $query->where('classe_id', $request->classe_id);
                })
                ->orderBy('moyenne_generale', 'desc')
                ->get();

            return response()->json([
                'bulletins' => $bulletins,
                'total_eleves' => $bulletins->count()
            ]);
        }

        // Retourner tous les bulletins si pas de filtres
        return response()->json(Bulletin::with(['eleve', 'anneeScolaire', 'notes.matiere'])->get());
    }

    /**
     * Génère les bulletins pour une classe, un trimestre et une année scolaire donnés
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function genererBulletins(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'trimestre' => 'required|integer|min:1|max:3',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
        ]);

        try {
            // Générer les bulletins
            $bulletins = $this->bulletinService->genererBulletins(
                $validated['classe_id'],
                $validated['trimestre'],
                $validated['annee_scolaire_id']
            );

            return response()->json([
                'message' => 'Bulletins générés avec succès',
                'data' => $bulletins
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la génération des bulletins',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données pour la création d'un nouveau bulletin
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'trimestre' => 'required|integer|min:1|max:3',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'pdf_path' => 'nullable|string|max:255',
            'date_generation' => 'required|date|before_or_equal:today',
        ]);

        // Calculer les moyennes et générer le bulletin via le service
        $bulletin = $this->bulletinService->genererBulletin(
            $validated['eleve_id'],
            $validated['trimestre'],
            $validated['annee_scolaire_id']
        );

        return response()->json($bulletin->load(['eleve', 'anneeScolaire', 'notes.matiere']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Trouve un bulletin par son ID ou retourne une erreur 404, en chargeant les relations
        return response()->json(Bulletin::with([
            'eleve',
            'anneeScolaire',
            'notes.matiere',
            'eleve.classe'
        ])->findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Récupération du bulletin à modifier
        $bulletin = Bulletin::findOrFail($id);

        // Validation des données pour la mise à jour
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'trimestre' => 'required|string|max:20',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'pdf_path' => 'nullable|string|max:255',
            'moyenne_generale' => 'nullable|numeric|min:0|max:20',
            'mention' => 'nullable|string|max:50',
            'rang' => 'nullable|integer|min:1',
            'appreciation' => 'nullable|string',
            'date_generation' => 'required|date|before_or_equal:today',
            
        ]);

        // Mettre à jour les champs du bulletin
        $bulletin->update($validated);

        // Retourner le bulletin mis à jour avec ses relations chargées
        return response()->json([
            'message' => 'Bulletin mis à jour avec succès',
            'data' => $bulletin->load(['eleve', 'anneeScolaire'])
        ]);
    }

    /**
     * Télécharge le bulletin au format PDF
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function telechargerPdf($id)
    {
        $bulletin = Bulletin::with([
            'eleve',
            'anneeScolaire',
            'notes.matiere',
            'eleve.classe'
        ])->findOrFail($id);

        $pdf = Pdf::loadView('bulletins.pdf', compact('bulletin'));
        
        // Si vous voulez sauvegarder le PDF
        $filename = "bulletin-{$bulletin->eleve->nom}-{$bulletin->trimestre}-{$bulletin->anneeScolaire->annee}.pdf";
        $path = "bulletins/{$filename}";
        Storage::put($path, $pdf->output());
        
        // Mettre à jour le chemin du PDF
        $bulletin->update(['pdf_path' => $path]);
        
        return $pdf->download($filename);
    }

    /**
     * Télécharge tous les bulletins d'une classe au format ZIP
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function telechargerTousBulletins(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'trimestre' => 'required|integer|min:1|max:3',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
        ]);

        $classe = Classe::findOrFail($validated['classe_id']);
        $bulletins = Bulletin::with(['eleve', 'notes.matiere'])
            ->whereHas('eleve', function($query) use ($validated) {
                $query->where('classe_id', $validated['classe_id']);
            })
            ->where('trimestre', $validated['trimestre'])
            ->where('annee_scolaire_id', $validated['annee_scolaire_id'])
            ->get();

        $zip = new \ZipArchive();
        $zipFileName = "bulletins-{$classe->nom}-T{$validated['trimestre']}-{$validated['annee_scolaire_id']}.zip";
        $zipPath = storage_path('app/temp/' . $zipFileName);
        
        // Créer le répertoire s'il n'existe pas
        if (!file_exists(dirname($zipPath))) {
            mkdir(dirname($zipPath), 0777, true);
        }

        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($bulletins as $bulletin) {
                $pdf = Pdf::loadView('bulletins.pdf', ['bulletin' => $bulletin]);
                $pdfContent = $pdf->output();
                $filename = "Bulletin-{$bulletin->eleve->nom}-{$bulletin->eleve->prenom}-T{$bulletin->trimestre}.pdf";
                $zip->addFromString($filename, $pdfContent);
            }
            $zip->close();
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bulletin = Bulletin::findOrFail($id);
        
        // Supprimer le fichier PDF associé s'il existe
        if ($bulletin->pdf_path && Storage::exists($bulletin->pdf_path)) {
            Storage::delete($bulletin->pdf_path);
        }
        
        // Supprimer les notes associées
        $bulletin->notes()->detach();
        
        // Supprimer le bulletin
        $bulletin->delete();

        return response()->json(null, 204);
    }
}