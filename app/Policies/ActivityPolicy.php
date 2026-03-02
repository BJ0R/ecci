<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * ActivityPolicy
 *
 * Governs access to Activity model actions.
 *
 * Rule summary:
 * ┌──────────────┬────────┬──────────────────────────────────────────────────┐
 * │ Ability      │ Admin  │ Parent                                           │
 * ├──────────────┼────────┼──────────────────────────────────────────────────┤
 * │ viewAny      │  ✓     │ ✓ (only activities whose lesson is published)    │
 * │ view         │  ✓     │ ✓ only if attached lesson is published (or null) │
 * │ create       │  ✓     │ ✗                                                │
 * │ update       │  ✓     │ ✗                                                │
 * │ delete       │  ✓     │ ✗ (soft delete)                                  │
 * │ submit       │  ✗     │ ✓ parents submit on behalf of their child        │
 * └──────────────┴────────┴──────────────────────────────────────────────────┘
 *
 * The custom `submit` ability is checked in ActivityViewController@submit:
 *   $this->authorize('submit', $activity);
 *
 * Additional ownership enforcement (child belongs to parent) is handled
 * inside SubmitActivityRequest::authorize() and the controller itself.
 */
class ActivityPolicy
{
    // ── Before hook ───────────────────────────────────────────────────────────
    /**
     * Admins bypass all checks.
     * NOTE: admins should NOT be able to submit activities (they have no children).
     * The before() hook only applies to non-custom abilities; for 'submit' we
     * explicitly return false for admins in the submit() method below.
     */
    public function before(User $user, string $ability): bool|null
    {
        // Skip the before hook for the custom 'submit' ability
        if ($ability === 'submit') {
            return null;
        }

        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    // ── viewAny ───────────────────────────────────────────────────────────────
    /**
     * Both roles can list activities.
     * The controller filters by published lesson for parents.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    // ── view ──────────────────────────────────────────────────────────────────
    /**
     * Parents can view an activity only if its lesson is published
     * (or if the activity is standalone — no lesson_id).
     * Admins bypass via before().
     */
    public function view(User $user, Activity $activity): Response
    {
        if (! $user->isParent()) {
            return Response::deny('Unauthorized.');
        }

        // Standalone activity (no lesson) — always accessible to parents
        if (is_null($activity->lesson_id)) {
            return Response::allow();
        }

        return $activity->lesson && $activity->lesson->is_published
            ? Response::allow()
            : Response::deny('This activity is not available yet.');
    }

    // ── create ────────────────────────────────────────────────────────────────
    /**
     * Only admins can create activities (before() handles this).
     */
    public function create(User $user): bool
    {
        return false;   // admins get true from before()
    }

    // ── update ────────────────────────────────────────────────────────────────
    /**
     * Only admins can update activities.
     */
    public function update(User $user, Activity $activity): bool
    {
        return false;
    }

    // ── delete ────────────────────────────────────────────────────────────────
    /**
     * Only admins can soft-delete activities.
     */
    public function delete(User $user, Activity $activity): bool
    {
        return false;
    }

    // ── submit (custom ability) ───────────────────────────────────────────────
    /**
     * Only parents can submit activities.
     * Admins cannot — they have no child profiles to submit on behalf of.
     *
     * The controller additionally verifies that the child_profile_id
     * belongs to this parent (SubmitActivityRequest::authorize).
     *
     * Usage: $this->authorize('submit', $activity);
     */
    public function submit(User $user, Activity $activity): Response
    {
        if (! $user->isParent()) {
            return Response::deny('Only parents can submit activities on behalf of their children.');
        }

        // Prevent submitting a quiz that's been soft-deleted
        if ($activity->trashed()) {
            return Response::deny('This activity is no longer available.');
        }

        return Response::allow();
    }
}