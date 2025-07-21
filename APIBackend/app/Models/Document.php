<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'type_document',
        'fichier_id',
        'date_upload',
    ];

    /**
     * Relation : un document appartient à un élève.
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Relation : un document appartient à un fichier (ex. stockage fichier).
     */
    public function fichier()
    {
        return $this->belongsTo(Fichier::class);
    }
}
