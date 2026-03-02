<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'family_name', 'is_approved',
    ];

    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['is_approved' => 'boolean', 'email_verified_at' => 'datetime'];

    // ── Relationships ──────────────────
    public function childProfiles()
    {
        return $this->hasMany(ChildProfile::class);
    }

    public function prayerRequests()
    {
        return $this->hasMany(PrayerRequest::class);
    }

    // ── Helpers ────────────────────────
    public function isAdmin(): bool   { return $this->role === 'admin'; }
    public function isParent(): bool  { return $this->role === 'parent'; }
}