<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * RedirectIfAuthenticated
 *
 * Applied to guest-only routes (login, register, forgot-password).
 * If an already-authenticated user hits those pages, redirect them
 * to their role-appropriate dashboard instead.
 *
 * Without this override, Breeze defaults to route('dashboard') which
 * does not exist in this app, causing ERR_TOO_MANY_REDIRECTS.
 */
class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                if ($user->role === 'admin') {
                    return redirect()->route('admin.dashboard');
                }

                if (! $user->is_approved) {
                    return redirect()->route('approval.pending');
                }

                return redirect()->route('parent.dashboard');
            }
        }

        return $next($request);
    }
}