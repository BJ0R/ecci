<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * IsParent
 *
 * Restricts routes to approved parent users only.
 *
 * Cases handled:
 *   - Not logged in                → redirect to /login
 *   - Admin hitting parent routes  → redirect to admin dashboard (not login → would loop)
 *   - Parent but not yet approved  → redirect to pending approval page
 *   - Approved parent              → allow through
 */
class IsParent
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Admin accidentally hitting a parent route — send them home
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // Parent account exists but not yet approved by church admin
        if (! $user->is_approved) {
            return redirect()->route('approval.pending');
        }

        return $next($request);
    }
}