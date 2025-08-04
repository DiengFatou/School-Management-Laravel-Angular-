<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enseignant;
use App\Models\Enseignement;

class Matiere extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'matieres';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'coefficient',
        'niveau',
    ];

    /**
     * Get the notes for the Matiere.
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    /**
     * Get the enseignements for the Matiere.
     */
    public function enseignements()
    {
        return $this->hasMany(Enseignement::class);
    }

    /**
     * Get the enseignants (professeurs) qui enseignent cette matière.
     */
    public function enseignants()
    {
        return $this->belongsToMany(Enseignant::class, 'enseignements', 'matiere_id', 'enseignant_id')
                   ->withTimestamps();
    }

    // Ajoutez d'autres relations ici si d'autres tables référencent 'matieres'
}