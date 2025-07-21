<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    use HasFactory;

    /**
     * Les colonnes autorisées au remplissage en masse
     */
    protected $fillable = [
        'user_id',
        'telephone',
        'adresse',
    ];

    /**
     * Relation : Un parent est lié à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation : Un parent peut avoir plusieurs élèves
     */
    public function eleves()
    {
        return $this->hasMany(Eleve::class, 'parent_id');
    }
}
