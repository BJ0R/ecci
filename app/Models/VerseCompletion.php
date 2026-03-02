<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerseCompletion extends Model
{
    /**
     * verse_completions table.
     *
     * Pivot-like record linking a MemoryVerse to a ChildProfile.
     * Created when the parent marks "✓ Juan memorized this verse".
     *
     * marked_by  = parent user id (who pressed the button).
     * memorized_at = timestamp of when the parent confirmed memorization.
     *
     * The combination (memory_verse_id, child_profile_id) is unique —
     * enforced by DB constraint so firstOrCreate in the controller is safe.
     */

    // ── Timestamps ─────────────────────────────────────────────────────────────
    // We use memorized_at explicitly; standard timestamps not needed.
    public $timestamps = false;

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'memory_verse_id',
        'child_profile_id',
        'marked_by',      // FK → users (parent)
        'memorized_at',   // timestamp
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'memorized_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The memory verse this completion refers to.
     */
    public function memoryVerse()
    {
        return $this->belongsTo(MemoryVerse::class);
    }

    /**
     * The child who memorized the verse.
     */
    public function childProfile()
    {
        return $this->belongsTo(ChildProfile::class);
    }

    /**
     * The parent user who marked the verse as memorized.
     */
    public function markedBy()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}