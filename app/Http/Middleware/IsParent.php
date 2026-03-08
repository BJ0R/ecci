<?php
// app/Http/Middleware/IsParent.php
// Make sure this file exists and looks like this.
// It must NOT block unapproved parents from seeing the approval.pending page —
// that route only has 'auth' middleware, not 'is.parent', so this is fine.
// This middleware ONLY runs on routes inside the 'is.parent' group.

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsParent
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (! $user || $user->role !== 'parent') {
            abort(403, 'Unauthorized. Parent access only.');
        }

        // Unapproved parents are logged in but bounced to the pending page.
        // This lets them see /pending-approval without a 403.
        if (! $user->is_approved) {
            return redirect()->route('approval.pending');
        }

        return $next($request);
    }
}