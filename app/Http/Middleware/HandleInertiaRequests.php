<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * Shared props:
     *   auth.user    — the authenticated user (or null)
     *   children     — ChildProfile[] for the sidebar switcher (parents only)
     *   activeChild  — currently selected child, persisted across pages via session
     *   flash        — session flash messages
     *
     * ── How child selection persists across navigations ──────────────────
     *
     * Problem: Previously used ?child_id= query param only. Navigating to a
     * page without that param (e.g. /verses, reload) silently fell back to
     * the first child, losing the parent's selection.
     *
     * Fix (3-step priority):
     *   1. ?child_id= in URL                → use it AND save to session
     *   2. No ?child_id= but session has one → use session value (survives
     *      page navigation, sidebar clicks, and browser reloads)
     *   3. Neither                           → fall back to first child
     *      (only on very first visit before any child has been selected)
     *
     * The ChildProfileSwitcher calls router.visit(currentPath + ?child_id=X),
     * which triggers step 1 and saves to session immediately. Every subsequent
     * page load (without a query param) hits step 2 and reads the saved value.
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $children    = [];
        $activeChild = null;

        if ($user && $user->role === 'parent') {
            $children = $user->childProfiles()
                ->select('id', 'name', 'age', 'avatar_color')
                ->get();

            if ($children->isNotEmpty()) {
                // Step 1 — ?child_id= in URL: save to session so it sticks
                if ($request->has('child_id')) {
                    $request->session()->put('active_child_id', (int) $request->query('child_id'));
                }

                // Step 2 — Read from session (survives navigation & reload)
                // Step 3 — Fall back to first child only if session is empty
                $savedId     = $request->session()->get('active_child_id');
                $activeChildId = $savedId ?? $children->first()->id;

                // Make sure the saved id actually belongs to this parent
                // (guards against stale session after a child is deleted)
                $activeChild = $children->firstWhere('id', $activeChildId)
                    ?? $children->first();

                // If we had to fall back to first because saved child was deleted,
                // update the session so future requests don't keep looking for it
                if ($activeChild && $activeChild->id !== ($savedId ?? null)) {
                    $request->session()->put('active_child_id', $activeChild->id);
                }
            }
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'role'        => $user->role,
                    'family_name' => $user->family_name,
                    'is_approved' => $user->is_approved,
                ] : null,
            ],

            'children'    => $children,
            'activeChild' => $activeChild,

            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ]);
    }
}