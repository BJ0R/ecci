<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * LessonPolicy
 *
 * Governs access to Lesson model actions.
 *
 * Rule summary:
 * ┌─────────────┬────────┬────────────────────────────────────────────────────┐
 * │ Ability     │ Admin  │ Parent                                             │
 * ├─────────────┼────────┼────────────────────────────────────────────────────┤
 * │ viewAny     │  ✓     │ ✓ (published lessons only — filtered in controller)│
 * │ view        │  ✓     │ ✓ only if lesson is published                      │
 * │ create      │  ✓     │ ✗                                                  │
 * │ update      │  ✓     │ ✗                                                  │
 * │ delete      │  ✓     │ ✗  (soft delete)                                   │
 * │ restore     │  ✓     │ ✗                                                  │
 * │ forceDelete │  ✓     │ ✗                                                  │
 * └─────────────┴────────┴────────────────────────────────────────────────────┘
 *
 * Registration in AuthServiceProvider (Laravel 10) or auto-discovered (Laravel 11):
 *   protected $policies = [Lesson::class => LessonPolicy::class];
 *
 * Usage in controller:
 *   $this->authorize('create', Lesson::class);
 *   $this->authorize('update', $lesson);
 *   Gate::allows('view', $lesson);
 */
class LessonPolicy
{
    // ── Before hook ───────────────────────────────────────────────────────────
    /**
     * Admins bypass all policy checks — they can do everything.
     * Returning true short-circuits all other methods below.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Return null to fall through to the individual method for parents
        return null;
    }

    // ── viewAny ───────────────────────────────────────────────────────────────
    /**
     * Parents can list lessons (the controller additionally filters by
     * is_published = true and the child's age_group, so this just grants access).
     */
    public function viewAny(User $user): bool
    {
        return $user->isParent();
    }

    // ── view ──────────────────────────────────────────────────────────────────
    /**
     * A parent can open a lesson only if it has been published.
     * Unpublished lessons are admin drafts — never visible to families.
     */
    public function view(User $user, Lesson $lesson): Response
    {
        if (! $user->isParent()) {
            return Response::deny('Only parents can view lessons.');
        }

        return $lesson->is_published
            ? Response::allow()
            : Response::deny('This lesson has not been published yet.');
    }

    // ── create ────────────────────────────────────────────────────────────────
    /**
     * Only admins can create lessons.
     * (before() already handles admins — this is the parent fallback.)
     */
    public function create(User $user): bool
    {
        return false;
    }

    // ── update ────────────────────────────────────────────────────────────────
    /**
     * Only admins can edit lessons.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        return false;
    }

    // ── delete ────────────────────────────────────────────────────────────────
    /**
     * Only admins can soft-delete lessons.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return false;
    }

    // ── restore ───────────────────────────────────────────────────────────────
    /**
     * Only admins can restore soft-deleted lessons.
     */
    public function restore(User $user, Lesson $lesson): bool
    {
        return false;
    }

    // ── forceDelete ───────────────────────────────────────────────────────────
    /**
     * Force-delete permanently removes a lesson and its content.
     * Only admins, and only via the admin dashboard.
     */
    public function forceDelete(User $user, Lesson $lesson): bool
    {
        return false;
    }
}