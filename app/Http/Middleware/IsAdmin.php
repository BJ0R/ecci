<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * IsAdmin
 *
 * Restricts routes to admin users only.
 *
 * IMPORTANT: Non-admins must be redirected to their OWN dashboard, NOT to /login.
 * Redirecting an authenticated user to /login triggers RedirectIfAuthenticated,
 * which bounces them back → infinite redirect loop.
 */
class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Not logged in at all → send to login
        if (! $user) {
            return redirect()->route('login');
        }

        // Logged in but not admin → send to their appropriate place
        if ($user->role !== 'admin') {
            if (! $user->is_approved) {
                return redirect()->route('approval.pending');
            }
            return redirect()->route('parent.dashboard');
        }

        return $next($request);
    }
}