<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin / Pastor ───────────────────────────────────────────────────
        User::create([
            'name'        => 'Pastor Jose Santos',
            'email'       => 'admin@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'admin',
            'family_name' => 'Santos',
            'is_approved' => true,
        ]);

        // ── Parent Families ──────────────────────────────────────────────────
        User::create([
            'name'        => 'Maria Reyes',
            'email'       => 'maria@family.test',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'family_name' => 'Reyes',
            'is_approved' => true,
        ]);

        User::create([
            'name'        => 'Roberto Cruz',
            'email'       => 'roberto@family.test',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'family_name' => 'Cruz',
            'is_approved' => true,
        ]);

        User::create([
            'name'        => 'Ana Dela Cruz',
            'email'       => 'ana@family.test',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'family_name' => 'Dela Cruz',
            'is_approved' => true,
        ]);

        // ── Unapproved family (for testing the pending-approval flow) ────────
        User::create([
            'name'        => 'Pending Parent',
            'email'       => 'pending@family.test',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'family_name' => 'Garcia',
            'is_approved' => false,
        ]);
    }
}