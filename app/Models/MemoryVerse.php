<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemoryVerse extends Model
{
    /**
     * memory_verses table.
     *
     * Each row is one weekly memory verse posted by the admin.
     * Families can then mark which of their children have memorized it —
     * that creates a VerseCompletion record (child_profile_id + memorized_at).
     *
     * context_note is an optional annotation the admin can add to help parents
     * explain the verse to younger children.
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'verse_text',    // the scripture text in full
        'reference',     // e.g. "John 3:16"
        'week_number',   // tinyint — which church week this verse is for
        'context_note',  // nullable text — admin annotation / explanation
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * All completion records for this verse across all children.
     */
    public function completions()
    {
        return $this->hasMany(VerseCompletion::class);
    }

    /**
     * Child profiles who have memorized this verse (via verse_completions pivot).
     */
    public function childProfiles()
    {
        return $this->hasManyThrough(
            ChildProfile::class,
            VerseCompletion::class,
            'memory_verse_id',    // FK on verse_completions
            'id',                 // FK on child_profiles
            'id',                 // local key on memory_verses
            'child_profile_id'    // local key on verse_completions
        );
    }
}