<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    /**
     * badges table.
     *
     * Admin configures badges in the BadgeController.
     * Each badge has a JSON trigger_rule that the checkAndAwardBadges() method
     * in ActivityViewController reads after every submission.
     *
     * trigger_rule examples (stored as JSON):
     *   {"type": "quiz_count",    "threshold": 5}   — 5 quizzes completed
     *   {"type": "lesson_count",  "threshold": 10}  — 10 lessons completed
     *   {"type": "perfect_score", "threshold": 1}   — at least one 100% score
     *   {"type": "verse_count",   "threshold": 3}   — 3 verses memorized
     *
     * icon stores an emoji (e.g. "🏅") or an SVG path string for rendering.
     * description is an optional label shown on the badge chip in the UI.
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'name',
        'icon',          // emoji or SVG path  e.g. "⭐" or "/icons/star.svg"
        'description',   // nullable — short explanation shown to children
        'trigger_rule',  // json — auto-award logic
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'trigger_rule' => 'array',   // auto-encode/decode JSON
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * All children who have earned this badge (via child_badges pivot).
     * Pivot includes awarded_at so we know when it was earned.
     */
    public function childProfiles()
    {
        return $this->belongsToMany(ChildProfile::class, 'child_badges')
            ->withPivot('awarded_at')
            ->withTimestamps();
    }
}