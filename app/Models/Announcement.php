<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    /**
     * announcements table.
     *
     * Posted by admin (pastor / teacher) to inform all parent families.
     * Displayed on the parent dashboard in reverse-chronological order.
     * pinned = true floats the announcement to the top of the list.
     *
     * posted_by → FK to the admin user who wrote the announcement.
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'posted_by',  // FK → users (admin)
        'title',
        'body',
        'pinned',     // boolean — pinned announcements show first
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'pinned' => 'boolean',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The admin user who posted this announcement.
     */
    public function poster()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    /**
     * Return pinned announcements first, then by newest.
     * Usage: Announcement::pinFirst()->get()
     */
    public function scopePinFirst($query)
    {
        return $query->orderByDesc('pinned')->latest();
    }
}