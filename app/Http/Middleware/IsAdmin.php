<?php
// app/Http/Middleware/IsAdmin.php
// Admins are always approved — no is_approved check needed for them.

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized. Admin access only.');
        }

        return $next($request);
    }
}