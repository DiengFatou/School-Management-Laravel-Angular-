<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'date_naissance',
        'classe_id',
        'parent_id',
        'visible',
    ];

    /**
     * Un élève appartient à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un élève appartient à une classe
     */
    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Un élève appartient à un parent
     */
    public function parent()
    {
        return $this->belongsTo(ParentModel::class, 'parent_id');
    }
}
