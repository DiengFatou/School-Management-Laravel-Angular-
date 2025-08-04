<?php

namespace App\Services;

use App\Models\Eleve;
use App\Models\Note;
use App\Models\Bulletin;
use App\Models\Matiere;
use App\Models\Classe;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BulletinService
{
    /**
     * Génère les bulletins pour une classe, un trimestre et une année scolaire donnés
     *
     * @param int $classeId
     * @param int $trimestre
     * @param int $anneeScolaireId
     * @return array
     */
    public function genererBulletins(int $classeId, int $trimestre, int $anneeScolaireId): array
    {
        // Récupérer tous les élèves de la classe
        $eleves = Eleve::where('classe_id', $classeId)->get();
        $bulletinsGeneres = [];

        foreach ($eleves as $eleve) {
            // Calculer la moyenne de l'élève pour chaque matière
            $notesParMatiere = $this->calculerMoyennesParMatiere($eleve->id, $trimestre, $anneeScolaireId);
            
            // Calculer la moyenne générale
            $moyenneGenerale = $this->calculerMoyenneGenerale($notesParMatiere);
            
            // Déterminer la mention
            $mention = $this->determinerMention($moyenneGenerale);
            
            // Créer ou mettre à jour le bulletin
            $bulletin = Bulletin::updateOrCreate(
                [
                    'eleve_id' => $eleve->id,
                    'trimestre' => $trimestre,
                    'annee_scolaire_id' => $anneeScolaireId,
                ],
                [
                    'moyenne_generale' => $moyenneGenerale,
                    'mention' => $mention,
                    'date_generation' => Carbon::now(),
                ]
            );

            // Ajouter les notes au bulletin
            $bulletin->notes()->sync($this->preparerNotesPourSync($notesParMatiere));
            
            $bulletinsGeneres[] = $bulletin->load(['eleve', 'notes.matiere']);
        }

        // Mettre à jour les rangs des élèves
        $this->mettreAJourRangs($classeId, $trimestre, $anneeScolaireId);

        return $bulletinsGeneres;
    }

    /**
     * Calcule les moyennes d'un élève par matière pour un trimestre et une année scolaire donnés
     *
     * @param int $eleveId
     * @param int $trimestre
     * @param int $anneeScolaireId
     * @return array
     */
    private function calculerMoyennesParMatiere(int $eleveId, int $trimestre, int $anneeScolaireId): array
    {
        $matieres = Matiere::whereHas('notes', function($query) use ($eleveId, $trimestre, $anneeScolaireId) {
            $query->where('eleve_id', $eleveId)
                  ->where('trimestre', $trimestre)
                  ->where('annee_scolaire_id', $anneeScolaireId);
        })->with(['notes' => function($query) use ($eleveId, $trimestre, $anneeScolaireId) {
            $query->where('eleve_id', $eleveId)
                  ->where('trimestre', $trimestre)
                  ->where('annee_scolaire_id', $anneeScolaireId);
        }])->get();

        $resultats = [];

        foreach ($matieres as $matiere) {
            $notes = $matiere->notes;
            $moyenne = $notes->avg('note');
            $coefficient = $matiere->coefficient ?? 1;
            $moyennePonderee = $moyenne * $coefficient;
            
            $resultats[] = [
                'matiere_id' => $matiere->id,
                'matiere_nom' => $matiere->nom,
                'coefficient' => $coefficient,
                'notes' => $notes->pluck('note')->toArray(),
                'moyenne' => $moyenne,
                'moyenne_ponderee' => $moyennePonderee,
                'appreciation' => $this->genererAppreciation($moyenne),
                'moyenne_classe' => $this->calculerMoyenneClasse($matiere->id, $trimestre, $anneeScolaireId, $eleveId)
            ];
        }

        return $resultats;
    }

    /**
     * Calcule la moyenne générale à partir des moyennes par matière
     *
     * @param array $notesParMatiere
     * @return float
     */
    private function calculerMoyenneGenerale(array $notesParMatiere): float
    {
        if (empty($notesParMatiere)) {
            return 0;
        }

        $sommePonderee = 0;
        $totalCoefficients = 0;

        foreach ($notesParMatiere as $matiere) {
            $sommePonderee += $matiere['moyenne_ponderee'];
            $totalCoefficients += $matiere['coefficient'];
        }

        return $totalCoefficients > 0 ? $sommePonderee / $totalCoefficients : 0;
    }

    /**
     * Calcule la moyenne de la classe pour une matière donnée
     *
     * @param int $matiereId
     * @param int $trimestre
     * @param int $anneeScolaireId
     * @param int $excludeEleveId
     * @return float
     */
    private function calculerMoyenneClasse(int $matiereId, int $trimestre, int $anneeScolaireId, ?int $excludeEleveId = null): float
    {
        $query = Note::where('matiere_id', $matiereId)
            ->where('trimestre', $trimestre)
            ->where('annee_scolaire_id', $anneeScolaireId);

        if ($excludeEleveId) {
            $query->where('eleve_id', '!=', $excludeEleveId);
        }

        return (float) $query->avg('note');
    }

    /**
     * Détermine la mention en fonction de la moyenne
     *
     * @param float $moyenne
     * @return string
     */
    private function determinerMention(float $moyenne): string
    {
        if ($moyenne >= 16) return 'Très Bien';
        if ($moyenne >= 14) return 'Bien';
        if ($moyenne >= 12) return 'Assez Bien';
        if ($moyenne >= 10) return 'Passable';
        return 'Insuffisant';
    }

    /**
     * Génère une appréciation en fonction de la moyenne
     *
     * @param float $moyenne
     * @return string
     */
    private function genererAppreciation(float $moyenne): string
    {
        if ($moyenne >= 16) return 'Excellente maîtrise des compétences';
        if ($moyenne >= 14) return 'Très bonne maîtrise des compétences';
        if ($moyenne >= 12) return 'Bonne maîtrise des compétences';
        if ($moyenne >= 10) return 'Maîtrise satisfaisante des compétences';
        return 'Maîtrise insuffisante des compétences';
    }

    /**
     * Prépare les notes pour la synchronisation avec le bulletin
     *
     * @param array $notesParMatiere
     * @return array
     */
    private function preparerNotesPourSync(array $notesParMatiere): array
    {
        $resultat = [];
        
        foreach ($notesParMatiere as $note) {
            $resultat[$note['matiere_id']] = [
                'moyenne' => $note['moyenne'],
                'appreciation' => $note['appreciation'],
                'moyenne_classe' => $note['moyenne_classe']
            ];
        }
        
        return $resultat;
    }

    /**
     * Met à jour les rangs des élèves dans la classe pour un trimestre donné
     *
     * @param int $classeId
     * @param int $trimestre
     * @param int $anneeScolaireId
     * @return void
     */
    private function mettreAJourRangs(int $classeId, int $trimestre, int $anneeScolaireId): void
    {
        // Récupérer tous les bulletins de la classe triés par moyenne décroissante
        $bulletins = Bulletin::whereHas('eleve', function($query) use ($classeId) {
                $query->where('classe_id', $classeId);
            })
            ->where('trimestre', $trimestre)
            ->where('annee_scolaire_id', $anneeScolaireId)
            ->orderBy('moyenne_generale', 'desc')
            ->get();

        // Mettre à jour les rangs
        $rang = 1;
        $precedenteMoyenne = null;
        $precedentRang = 1;

        foreach ($bulletins as $bulletin) {
            // Si la moyenne est différente de la précédente, on met à jour le rang
            if ($precedenteMoyenne !== null && $bulletin->moyenne_generale < $precedenteMoyenne) {
                $precedentRang = $rang;
            }
            
            $bulletin->update(['rang' => $precedentRang]);
            $precedenteMoyenne = $bulletin->moyenne_generale;
            $rang++;
        }
    }
}
