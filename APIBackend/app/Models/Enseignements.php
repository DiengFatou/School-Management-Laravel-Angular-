<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignements extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'enseignements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'enseignant_id',
        'classe_id',
        'matiere_id',
    ];

    /**
     * Get the enseignant that owns the Enseignement.
     */
    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class);
    }

    /**
     * Get the classe that owns the Enseignement.
     */
    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Get the matiere that owns the Enseignement.
     */
    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    // Ajoutez d'autres relations ici si nécessaire, par exemple, si un enseignement
    // peut avoir plusieurs notes ou d'autres entités liées.
}