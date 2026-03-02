<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 014 — badges
 *
 * Admin configures badges via BadgeController.
 * Each badge has a JSON trigger_rule that the checkAndAwardBadges() method
 * in ActivityViewController reads after every quiz submission.
 *
 * trigger_rule JSON examples:
 *   {"type": "quiz_count",    "threshold": 5}   → 5 quizzes completed
 *   {"type": "lesson_count",  "threshold": 10}  → 10 lessons completed
 *   {"type": "perfect_score", "threshold": 1}   → at least one 100% score
 *   {"type": "verse_count",   "threshold": 3}   → 3 verses memorized
 *
 * icon stores an emoji (e.g. "🏅") or an SVG path string for rendering
 * in the BadgeChip.jsx component.
 *
 * description is optional — shown beneath the badge name on the progress page.
 *
 * Table: badges
 * ──────────────────────────────────────────────
 * id            bigint PK
 * name          varchar(255)  unique
 * icon          varchar(255)  emoji or path
 * description   varchar(255) nullable
 * trigger_rule  json
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique();
            $table->string('icon');
            $table->string('description')->nullable();
            $table->json('trigger_rule');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};