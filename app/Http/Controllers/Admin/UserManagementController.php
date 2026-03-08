<?php
// app/Http/Controllers/Admin/UserManagementController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /** List all parent accounts and all teacher accounts */
    public function index()
    {
        $families = User::where('role', 'parent')
            ->withCount('childProfiles')
            ->with('childProfiles')
            ->latest()
            ->paginate(20, ['*'], 'families_page');

        $teachers = User::where('role', 'teacher')
            ->latest()
            ->paginate(20, ['*'], 'teachers_page');

        return Inertia::render('Admin/Users/Index', compact('families', 'teachers'));
    }

    /** Approve a parent or teacher account */
    public function approve(User $user)
    {
        abort_if(! in_array($user->role, ['parent', 'teacher']), 403);
        $user->update(['is_approved' => true]);
        return back()->with('success', "Account for {$user->name} approved.");
    }

    /** Suspend a parent or teacher account */
    public function suspend(User $user)
    {
        abort_if(! in_array($user->role, ['parent', 'teacher']), 403);
        $user->update(['is_approved' => false]);
        return back()->with('success', 'Account suspended.');
    }

    /** View a specific family's children and progress */
    public function show(User $user)
    {
        $user->load([
            'childProfiles.lessonProgresses.lesson',
            'childProfiles.activitySubmissions.activity',
            'childProfiles.badges',
        ]);

        return Inertia::render('Admin/Users/Show', ['family' => $user]);
    }

    /** Admin creates a teacher account directly (teachers do not self-register) */
    public function storeTeacher(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'role'        => 'teacher',
            'is_approved' => true, // teachers are active immediately
        ]);

        return back()->with('success', "Teacher account for {$request->name} created.");
    }

    /** Remove a teacher account */
    public function destroyTeacher(User $user)
    {
        abort_if($user->role !== 'teacher', 403);
        $user->delete();
        return back()->with('success', 'Teacher account removed.');
    }
}