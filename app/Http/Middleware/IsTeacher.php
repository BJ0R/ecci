<?php
// app/Http/Middleware/IsTeacher.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsTeacher
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'teacher') {
            abort(403, 'Unauthorized. Teacher access only.');
        }

        // Unapproved teachers are bounced to the pending page.
        if (! $user->is_approved) {
            return redirect()->route('approval.pending');
        }

        return $next($request);
    }
}