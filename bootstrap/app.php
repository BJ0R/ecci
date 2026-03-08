<?php
// bootstrap/app.php

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
        // ── Inertia SSR / Vite HMR ────────────────────────────────────────
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ── Custom role-gate aliases ──────────────────────────────────────
        $middleware->alias([
            'is.admin'   => \App\Http\Middleware\IsAdmin::class,
            'is.teacher' => \App\Http\Middleware\IsTeacher::class,
            'is.parent'  => \App\Http\Middleware\IsParent::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();