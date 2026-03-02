<?php

namespace App\Policies;

use App\Models\ChildProfile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * ChildProfilePolicy
 *
 * Governs access to ChildProfile model actions.
 *
 * This is the MOST SECURITY-CRITICAL policy in the entire application.
 * A parent must NEVER be able to view, edit, or delete another family's
 * child profiles.  The OwnsFamilyProfile middleware handles route-level
 * blocking for child-specific routes, but this policy enforces it at the
 * Gate / authorize() level as a second layer of protection.
 *
 * Rule summary:
 * ┌─────────────┬─────────────────────────────────────────────────────────────┐
 * │ Ability     │ Who can do it                                               │
 * ├─────────────┼─────────────────────────────────────────────────────────────┤
 * │ viewAny     │ Admin (all profiles) · Parent (their own children only)     │
 * │ view        │ Admin always · Parent only if child.user_id === parent.id   │
 * │ create      │ Parent only (admins don't have children)                    │
 * │ update      │ Parent only if they own the profile                         │
 * │ delete      │ Parent only if they own the profile                         │
 * └─────────────┴─────────────────────────────────────────────────────────────┘
 *
 * Registration — Laravel 11 auto-discovers policies by convention:
 *   ChildProfile model  →  ChildProfilePolicy (same namespace pattern)
 *
 * If auto-discovery doesn't work, add to AuthServiceProvider:
 *   protected $policies = [ChildProfile::class => ChildProfilePolicy::class];
 *
 * Controller usage examples:
 *   $this->authorize('create', ChildProfile::class);   // no model instance needed
 *   $this->authorize('view',   $childProfile);
 *   $this->authorize('update', $childProfile);
 *   $this->authorize('delete', $childProfile);
 */
class ChildProfilePolicy
{
    // ── before ────────────────────────────────────────────────────────────────
    /**
     * Admins can VIEW and LIST any child profile (for the progress dashboard)
     * but they CANNOT create, update, or delete profiles — those are family
     * management actions.
     *
     * We handle this per-method instead of a blanket before() override,
     * so we return null here to fall through to each method.
     */
    public function before(User $user, string $ability): bool|null
    {
        // Admins get unrestricted read access — handled in viewAny() and view()
        // For write operations (create/update/delete) they fall through to the method
        return null;
    }

    // ── viewAny ───────────────────────────────────────────────────────────────
    /**
     * Who can list child profiles?
     *
     * Admin  → yes, for the progress overview dashboard
     * Parent → yes, but the controller scopes the query to their own children:
     *          ChildProfile::where('user_id', auth()->id())
     */
    public function viewAny(User $user): bool
    {
        // Both roles can access the list route; scoping is done in the controller
        return $user->isAdmin() || $user->isParent();
    }

    // ── view ──────────────────────────────────────────────────────────────────
    /**
     * Who can view a specific child profile?
     *
     * Admin  → always (needed for progress drill-down: ProgressViewController@show)
     * Parent → only if the profile belongs to their account
     */
    public function view(User $user, ChildProfile $childProfile): Response
    {
        if ($user->isAdmin()) {
            return Response::allow();
        }

        return $childProfile->user_id === $user->id
            ? Response::allow()
            : Response::deny('This child profile does not belong to your account.');
    }

    // ── create ────────────────────────────────────────────────────────────────
    /**
     * Only parents can add child profiles.
     * Admins do not have families or children on the platform.
     *
     * Usage: $this->authorize('create', ChildProfile::class);
     */
    public function create(User $user): Response
    {
        return $user->isParent()
            ? Response::allow()
            : Response::deny('Only parent accounts can add child profiles.');
    }

    // ── update ────────────────────────────────────────────────────────────────
    /**
     * A parent can edit a child profile only if they own it.
     * Admins cannot edit family profiles.
     */
    public function update(User $user, ChildProfile $childProfile): Response
    {
        if (! $user->isParent()) {
            return Response::deny('Only parent accounts can edit child profiles.');
        }

        return $childProfile->user_id === $user->id
            ? Response::allow()
            : Response::deny('This child profile does not belong to your account.');
    }

    // ── delete ────────────────────────────────────────────────────────────────
    /**
     * A parent can delete a child profile only if they own it.
     *
     * WARNING: Deletion cascades to all linked records in:
     *   lesson_progresses, activity_submissions, verse_completions, child_badges
     * The controller should warn the parent before confirming this action.
     */
    public function delete(User $user, ChildProfile $childProfile): Response
    {
        if (! $user->isParent()) {
            return Response::deny('Only parent accounts can remove child profiles.');
        }

        return $childProfile->user_id === $user->id
            ? Response::allow()
            : Response::deny('This child profile does not belong to your account.');
    }
}