<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivitySubmission extends Model
{
    /**
     * activity_submissions table.
     *
     * Stores the child's attempt at an activity.
     * child_profile_id is the CRITICAL FK — it ties the score to the correct
     * child within a family (not just the parent account).
     *
     * submitted_by = parent user id (who was logged in when submitting).
     *
     * answers is JSON:
     *   { "question_id": "chosen_answer", ... }
     *   e.g. { "12": "David", "13": "Jerusalem" }
     *
     * score is calculated in ActivityViewController@submit and stored here.
     * The controller also compares score vs activity.max_score for badge checks.
     *
     * No timestamps() in migrations — using submitted_at explicitly instead of
     * Laravel's default created_at/updated_at for semantic clarity.
     */

    // ── Timestamps ─────────────────────────────────────────────────────────────
    // We store submitted_at manually; disable Laravel auto-timestamps.
    public $timestamps = false;

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'activity_id',
        'child_profile_id',
        'submitted_by',     // FK → users (the parent account)
        'answers',          // json
        'score',            // tinyint
        'submitted_at',     // timestamp
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'answers'      => 'array',
        'score'        => 'integer',
        'submitted_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The activity this submission is for.
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * The child profile who took the activity.
     */
    public function childProfile()
    {
        return $this->belongsTo(ChildProfile::class);
    }

    /**
     * The parent user who submitted on the child's behalf.
     */
    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}