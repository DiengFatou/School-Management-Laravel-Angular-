<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Les attributs pouvant être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
        'photo_profil',
        'is_active',
    ];

    /**
     * Les attributs à masquer pour les tableaux.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    /**
     * Les attributs à caster.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Spécifie le nom de la colonne pour le mot de passe.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}
