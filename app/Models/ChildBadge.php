<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ChildBadge extends Pivot
{
    /**
     * child_badges pivot table.
     *
     * Joins ChildProfile ↔ Badge with an extra awarded_at timestamp.
     * Using a dedicated Pivot model (instead of a plain pivot array) so we can:
     *   — Add accessors (e.g. human-readable awarded date)
     *   — Attach observers if needed later (e.g. notify parent on badge award)
     *   — Query the pivot directly: ChildBadge::where('badge_id', $id)->count()
     *
     * Table columns:
     *   child_profile_id  FK → child_profiles
     *   badge_id          FK → badges
     *   awarded_at        timestamp — set by the badge-award logic in controller
     *   created_at        standard Laravel timestamp
     *   updated_at        standard Laravel timestamp
     */

    // ── Table name ─────────────────────────────────────────────────────────────
    protected $table = 'child_badges';

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'child_profile_id',
        'badge_id',
        'awarded_at',
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'awarded_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The child who earned the badge.
     */
    public function childProfile()
    {
        return $this->belongsTo(ChildProfile::class);
    }

    /**
     * The badge that was earned.
     */
    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }
}