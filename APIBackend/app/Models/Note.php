<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'eleve_id',
        'matiere_id',
        'enseignant_id',
        'trimestre',
        'annee_scolaire_id',
        'note',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'note' => 'decimal:2', // Assure que la note est traitée comme un décimal avec 2 chiffres après la virgule
    ];

    /**
     * Get the eleve that owns the Note.
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Get the matiere that owns the Note.
     */
    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    /**
     * Get the enseignant that owns the Note.
     */
    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class);
    }

    /**
     * Get the anneeScolaire that owns the Note.
     */
    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_Scolaires::class);
    }
}