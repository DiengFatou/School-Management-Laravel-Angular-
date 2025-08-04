<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enseignement extends Model
{
    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array
     */
    protected $fillable = [
        'enseignant_id',
        'classe_id',
        'matiere_id',
    ];

    /**
     * Relation avec le modèle Enseignant.
     */
    public function enseignant(): BelongsTo
    {
        return $this->belongsTo(Enseignant::class);
    }

    /**
     * Relation avec le modèle Classe.
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Relation avec le modèle Matiere.
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }
}
