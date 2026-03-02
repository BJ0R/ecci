<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     * New registrations are always 'parent' role, pending admin approval.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'family_name' => ['nullable', 'string', 'max:255'],
            'email'       => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password'    => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'        => $request->name,
            'family_name' => $request->family_name ?? $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'role'        => 'parent',      // all new registrations are parents
            'is_approved' => false,         // pending admin approval
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect to pending approval page — they cannot access the app until approved
        return redirect()->route('approval.pending');
    }
}