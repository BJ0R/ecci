<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Order matters — foreign keys must exist before dependent rows are inserted.
     *
     * Run with:  php artisan db:seed
     * Fresh run: php artisan migrate:fresh --seed
     */
    public function run(): void
    {
        $this->call([
            // ── 1. Core users ────────────────────────────────────────────────
            UserSeeder::class,

            // ── 2. Child profiles (depend on users) ──────────────────────────
            ChildProfileSeeder::class,

            // ── 3. Badges (independent) ──────────────────────────────────────
            BadgeSeeder::class,

            // ── 4. Lessons + content ─────────────────────────────────────────
            LessonSeeder::class,

            // ── 5. Activities + questions (depend on lessons) ─────────────────
            ActivitySeeder::class,

            // ── 6. Memory verses (independent) ───────────────────────────────
            MemoryVerseSeeder::class,

            // ── 7. Announcements (depend on admin user) ───────────────────────
            AnnouncementSeeder::class,

            // ── 8. Sample interaction data (progress, submissions, etc.) ──────
            //    Depends on everything above — run last
            SampleProgressSeeder::class,
        ]);
    }
}