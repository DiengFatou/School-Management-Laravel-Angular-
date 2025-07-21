<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
     * (Optionnel) Relation : Un enseignant peut enseigner plusieurs classes
     */
    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
