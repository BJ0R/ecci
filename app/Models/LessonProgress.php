<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonProgress extends Model
{
    /**
     * lesson_progresses table.
     *
     * IMPORTANT: Must declare $table explicitly.
     * Laravel auto-derives 'lesson_progress' from 'LessonProgress'
     * because "progress" is treated as irregular/uncountable by the
     * pluralizer — but our migration created 'lesson_progresses'.
     */
    protected $table = 'lesson_progresses';

    protected $fillable = [
        'lesson_id',
        'child_profile_id',
        'status',          // enum: viewed | completed
        'completed_at',    // nullable timestamp
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function childProfile()
    {
        return $this->belongsTo(ChildProfile::class);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}