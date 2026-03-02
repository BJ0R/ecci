<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@eccii.com', // Change this to your actual email
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Change this immediately after login
            'role' => 'admin',
            'family_name' => 'ECCII Staff',
            'is_approved' => true, // Crucial: Admins must be pre-approved
        ]);
    }
}