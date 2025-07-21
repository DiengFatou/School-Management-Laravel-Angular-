<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogConnexion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'adresse_ip',
        'navigateur',
        'date_connexion',
    ];

    // Relation vers User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Gestion automatique des types
    protected $casts = [
        'date_connexion' => 'datetime',
    ];
}
