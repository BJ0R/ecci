<?php
// database/seeders/ChildProfileSeeder.php

namespace Database\Seeders;

use App\Models\ChildProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeds children for the 3 parent families.
 *
 * Age groups are computed by ChildProfile::ageGroup():
 *   age ≤ 5   → nursery
 *   age ≤ 10  → kids
 *   age > 10  → youth
 *
 * We deliberately spread ages so all three group lessons are testable.
 */
class ChildProfileSeeder extends Seeder
{
    public function run(): void
    {
        // ── Reyes Family (maria@family.test) ─────────────────────────────────
        // Kids + nursery mix
        $reyes = User::where('email', 'maria@family.test')->first();

        ChildProfile::create([
            'user_id'      => $reyes->id,
            'name'         => 'Liam',
            'age'          => 9,       // → kids
            'grade'        => 'Grade 3',
            'avatar_color' => '#6EA8D4',  // sky blue
        ]);

        ChildProfile::create([
            'user_id'      => $reyes->id,
            'name'         => 'Sofia',
            'age'          => 4,       // → nursery
            'grade'        => 'Pre-K',
            'avatar_color' => '#F4A7B9',  // soft pink
        ]);

        // ── Cruz Family (roberto@family.test) ─────────────────────────────────
        // Youth + kids mix
        $cruz = User::where('email', 'roberto@family.test')->first();

        ChildProfile::create([
            'user_id'      => $cruz->id,
            'name'         => 'Miguel',
            'age'          => 13,      // → youth
            'grade'        => 'Grade 7',
            'avatar_color' => '#7EC8A4',  // sage green
        ]);

        ChildProfile::create([
            'user_id'      => $cruz->id,
            'name'         => 'Isabella',
            'age'          => 7,       // → kids
            'grade'        => 'Grade 1',
            'avatar_color' => '#F9C74F',  // gold
        ]);

        // ── Dela Cruz Family (ana@family.test) ────────────────────────────────
        // Three kids: one per group
        $dela = User::where('email', 'ana@family.test')->first();

        ChildProfile::create([
            'user_id'      => $dela->id,
            'name'         => 'Gabriel',
            'age'          => 15,      // → youth
            'grade'        => 'Grade 9',
            'avatar_color' => '#B07CE8',  // purple
        ]);

        ChildProfile::create([
            'user_id'      => $dela->id,
            'name'         => 'Hana',
            'age'          => 8,       // → kids
            'grade'        => 'Grade 2',
            'avatar_color' => '#F4845F',  // orange
        ]);

        ChildProfile::create([
            'user_id'      => $dela->id,
            'name'         => 'Ellie',
            'age'          => 3,       // → nursery
            'grade'        => 'Toddler',
            'avatar_color' => '#A8D8EA',  // light teal
        ]);
    }
}