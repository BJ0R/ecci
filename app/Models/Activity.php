<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    /**
     * activities table.
     *
     * An activity belongs to a lesson (optional — can be standalone).
     * type = 'quiz'    → has ActivityQuestion rows, auto-scored on submit
     * type = 'drawing' → open-ended; parent describes / uploads child's drawing
     * type = 'fill'    → fill-in-the-blank; manually reviewed
     *
     * max_score is used in the score display and badge trigger logic.
     * SoftDeletes preserves historical submission records if an activity is removed.
     */
    use SoftDeletes;

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'lesson_id',     // nullable FK — activity can exist without a lesson
        'title',
        'type',          // enum: quiz | drawing | fill
        'instructions',
        'max_score',     // tinyint, default 10
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The lesson this activity is attached to (if any).
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Quiz questions that make up this activity.
     * Only populated when type = 'quiz'.
     */
    public function questions()
    {
        return $this->hasMany(ActivityQuestion::class);
    }

    /**
     * All child submissions for this activity.
     */
    public function submissions()
    {
        return $this->hasMany(ActivitySubmission::class);
    }
}