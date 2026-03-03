<?php
// database/seeders/BadgeSeeder.php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            // ── First steps ──────────────────────────────────────────────────
            [
                'name'         => 'First Quiz',
                'icon'         => '🧠',
                'description'  => 'Completed your very first quiz!',
                'trigger_rule' => ['type' => 'quiz_count', 'threshold' => 1],
            ],
            [
                'name'         => 'First Lesson',
                'icon'         => '📖',
                'description'  => 'Completed your first full lesson.',
                'trigger_rule' => ['type' => 'lesson_count', 'threshold' => 1],
            ],
            [
                'name'         => 'Scripture Star',
                'icon'         => '⭐',
                'description'  => 'Memorized your first verse!',
                'trigger_rule' => ['type' => 'verse_count', 'threshold' => 1],
            ],

            // ── Consistency ──────────────────────────────────────────────────
            [
                'name'         => 'Quiz Warrior',
                'icon'         => '⚔️',
                'description'  => 'Completed 5 quizzes.',
                'trigger_rule' => ['type' => 'quiz_count', 'threshold' => 5],
            ],
            [
                'name'         => 'Faithful Learner',
                'icon'         => '📚',
                'description'  => 'Completed 5 lessons.',
                'trigger_rule' => ['type' => 'lesson_count', 'threshold' => 5],
            ],
            [
                'name'         => 'Verse Champion',
                'icon'         => '🏆',
                'description'  => 'Memorized 3 Bible verses.',
                'trigger_rule' => ['type' => 'verse_count', 'threshold' => 3],
            ],

            // ── Excellence ───────────────────────────────────────────────────
            [
                'name'         => 'Perfect Score',
                'icon'         => '💯',
                'description'  => 'Got a perfect score on a quiz!',
                'trigger_rule' => ['type' => 'perfect_score'],
            ],
            [
                'name'         => 'Bible Scholar',
                'icon'         => '🎓',
                'description'  => 'Completed 10 lessons.',
                'trigger_rule' => ['type' => 'lesson_count', 'threshold' => 10],
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}