<?php
// bootstrap/app.php — ECCII custom version

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // ── Inertia shared data middleware ────────────────────────────────────
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ── Override authenticated-user redirect ──────────────────────────────
        // Breeze's default redirects to route('dashboard') which doesn't exist.
        // This tells the built-in RedirectIfAuthenticated middleware where to
        // send logged-in users who visit guest-only pages (login, register, etc.)
        $middleware->redirectUsersTo(function ($request) {
            $user = $request->user();
            if (! $user)                return route('login');
            if ($user->role === 'admin') return route('admin.dashboard');
            if (! $user->is_approved)   return route('approval.pending');
            return route('parent.dashboard');
        });

        // ── Custom middleware aliases ─────────────────────────────────────────
        // Used in web.php: ->middleware(['auth', 'is.admin']) etc.
        $middleware->alias([
            'is.admin'      => \App\Http\Middleware\IsAdmin::class,
            'is.parent'     => \App\Http\Middleware\IsParent::class,
            'owns.profile'  => \App\Http\Middleware\OwnsFamilyProfile::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();