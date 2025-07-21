<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annee_Scolaires extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'annee_scolaires'; // Nom correct de la table

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'libelle',
        'active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get the bulletins for the AnneeScolaire.
     */
    public function bulletins()
    {
        return $this->hasMany(Bulletin::class, 'annee_scolaire_id');
    }

    /**
     * Get the notes for the AnneeScolaire.
     * Assuming 'notes' table also has an 'annee_scolaire_id' foreign key
     */
    public function notes()
    {
        return $this->hasMany(Note::class, 'annee_scolaire_id');
    }

}