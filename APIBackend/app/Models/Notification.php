<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titre',
        'contenu',
        'date_envoi',
        'vu',
    ];

    // Relation vers User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Si tu veux gérer le champ 'vu' comme booléen nativement
    protected $casts = [
        'vu' => 'boolean',
        'date_envoi' => 'datetime',
    ];
}
