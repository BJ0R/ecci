<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrayerRequest extends Model
{
    /**
     * prayer_requests table.
     *
     * A parent submits a personal prayer request.
     * is_public = true → visible to other parent families (community board).
     * is_public = false → only the admin and the submitting parent can see it.
     *
     * Admin responds via the respond() method in Admin\PrayerRequestController.
     * When admin_response is saved, is_responded flips to true
     * and responded_at is stamped.
     *
     * The parent sees their own requests + any public requests from others.
     */

    // ── Mass assignment ────────────────────────────────────────────────────────
    protected $fillable = [
        'user_id',          // FK → users (the parent who submitted)
        'body',             // the prayer request text
        'is_public',        // boolean — shared with community?
        'is_responded',     // boolean — has the admin replied?
        'admin_response',   // nullable text — admin's reply
        'responded_at',     // nullable timestamp
    ];

    // ── Casts ──────────────────────────────────────────────────────────────────
    protected $casts = [
        'is_public'    => 'boolean',
        'is_responded' => 'boolean',
        'responded_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    /**
     * The parent user who submitted this prayer request.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    /**
     * Requests that have not yet received an admin response.
     * Usage: PrayerRequest::unanswered()->count()
     */
    public function scopeUnanswered($query)
    {
        return $query->where('is_responded', false);
    }

    /**
     * Requests visible on the community prayer board.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}