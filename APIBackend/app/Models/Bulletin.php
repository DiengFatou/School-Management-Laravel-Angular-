<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bulletin extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'bulletins';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'eleve_id',
        'trimestre',
        'annee_scolaire_id',
        'pdf_path',
        'moyenne_generale',
        'mention',
        'rang',
        'appreciation',
        'date_generation',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_generation' => 'date',
        'moyenne_generale' => 'decimal:2', // Assure que la moyenne est traitée comme un décimal avec 2 chiffres après la virgule
    ];

    /**
     * Get the eleve that owns the Bulletin.
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Get the anneeScolaire that owns the Bulletin.
     */
    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_Scolaires::class);
    }
}