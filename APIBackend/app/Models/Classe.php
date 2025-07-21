<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    /**
     * Les champs autorisés pour le remplissage en masse
     */
    protected $fillable = [
        'nom',
        'niveau',
        'annee_scolaire_id',
    ];

    /**
     * Relation : Une classe appartient à une année scolaire
     */
    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Relation : Une classe a plusieurs élèves
     */
    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }
}
