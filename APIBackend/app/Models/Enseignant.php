<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enseignement;
use App\Models\Matiere;
use App\Models\Classe;

class Enseignant extends Model
{
    use HasFactory;

    /**
     * Les colonnes autorisées au remplissage en masse
     */
    protected $fillable = [
        'user_id',
        'nom_complet',
    ];

    /**
     * Relation : Un enseignant est lié à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Un enseignant peut avoir plusieurs enseignements
     */
    public function enseignements()
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Relation : Un enseignant peut enseigner plusieurs matières via la table enseignements
     */
    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'enseignements', 'enseignant_id', 'matiere_id')
                    ->withPivot('classe_id')
                    ->withTimestamps();
    }

    /**
     * Relation : Un enseignant peut enseigner dans plusieurs classes via la table enseignements
     */
    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'enseignements', 'enseignant_id', 'classe_id')
                    ->withPivot('matiere_id')
                    ->withTimestamps();
    }
}
