<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Changez de Annee_Scolaires à AnneeScolaire
class AnneeScolaire extends Model
{
    use HasFactory;

    protected $table = 'annee_scolaires';

    protected $fillable = [
        'libelle',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class, 'annee_scolaire_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'annee_scolaire_id');
    }
}