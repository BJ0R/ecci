<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /** List all parent accounts with their children */
    public function index()
    {
        $families = User::where('role', 'parent')
            ->withCount('childProfiles')
            ->with('childProfiles')
            ->latest()->paginate(20);

        return Inertia::render('Admin/Users/Index', ['families' => $families]);
    }

    /** Approve a parent account */
    public function approve(User $user)
    {
        abort_if($user->role !== 'parent', 403);
        $user->update(['is_approved' => true]);
        return back()->with('success', "Family account for {$user->name} approved.");
    }

    /** Suspend a parent account */
    public function suspend(User $user)
    {
        abort_if($user->role !== 'parent', 403);
        $user->update(['is_approved' => false]);
        return back()->with('success', 'Account suspended.');
    }

    /** View specific family + all their children's progress */
    public function show(User $user)
    {
        $user->load([
            'childProfiles.lessonProgresses.lesson',
            'childProfiles.activitySubmissions.activity',
            'childProfiles.badges',
        ]);
        return Inertia::render('Admin/Users/Show', ['family' => $user]);
    }
}