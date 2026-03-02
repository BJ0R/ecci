<?php
namespace App\Http\Middleware;
use App\Models\ChildProfile; use Closure; use Illuminate\Http\Request;

class OwnsFamilyProfile
{
    /** Ensure the child profile in the route belongs to the logged-in parent */
    public function handle(Request $request, Closure $next)
    {
        $child = $request->route('child'); // route model binding

        if ($child && $child->user_id !== $request->user()->id) {
            abort(403, 'This child profile does not belong to your account.');
        }
        return $next($request);
    }
}