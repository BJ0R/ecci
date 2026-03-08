<?php
// app/Http/Controllers/Auth/RegisteredUserController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'family_name'           => 'nullable|string|max:255',
            'email'                 => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password'              => ['required', 'confirmed', Rules\Password::defaults()],
            // Admins are never self-registered — only parent or teacher allowed.
            'role'                  => ['required', Rule::in(['parent', 'teacher'])],
        ]);

        $user = User::create([
            'name'        => $request->name,
            'family_name' => $request->family_name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'role'        => $request->role,
            'is_approved' => false,   // always requires admin approval
        ]);

        event(new Registered($user));

        // Must log in BEFORE redirecting to approval.pending —
        // that route has the 'auth' middleware, so an unauthenticated
        // redirect would loop back to login and cause a 500.
        Auth::login($user);

        return redirect()->route('approval.pending');
    }
}