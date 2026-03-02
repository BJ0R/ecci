<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityQuestion extends Model
{
    /**
     * activity_questions table.
     *
     * Each row is one question inside a quiz-type Activity.
     * choices is a JSON array of option strings:
     *   ["David", "Moses", "Paul", "Peter"]
     *
     * correct_answer is stored as a plain string matching one of the choices,
     * so the controller can do:  $submitted === $question->correct_answer
     *
     * points per question allows weighted scoring (default: 1).
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'activity_id',
        'question_text',    // the question as written
        'choices',          // json array of option strings
        'correct_answer',   // must match one of the choices values
        'points',           // tinyint, default 1
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'choices' => 'array',   // auto-encode/decode JSON
        'points'  => 'integer',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The activity this question belongs to.
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}