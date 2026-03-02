<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonContent extends Model
{
    /**
     * lesson_contents table.
     *
     * One-to-one with Lesson. Stores the rich biblical content that the parent
     * and child actually read: the scripture, explanation, reflection questions,
     * and a closing prayer.
     *
     * reflection_questions is stored as JSON:
     *   [{"question": "What did David use to defeat Goliath?"}, ...]
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'lesson_id',
        'bible_reference',       // e.g. "1 Samuel 17:45–50"
        'bible_text',            // longtext — the full scripture passage
        'explanation',           // longtext — age-appropriate explanation
        'reflection_questions',  // json  — array of discussion question objects
        'prayer',                // text  — closing prayer for the family to say
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'reflection_questions' => 'array',   // automatically encode / decode JSON
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The lesson this content belongs to.
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}