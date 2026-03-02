<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Lesson;
use App\Models\ChildProfile;
use App\Models\ActivitySubmission;
use App\Models\PrayerRequest;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_families'    => User::where('role', 'parent')->count(),
            'pending_approvals' => User::where('role', 'parent')->where('is_approved', false)->count(),
            'total_children'    => ChildProfile::count(),
            'total_lessons'     => Lesson::where('is_published', true)->count(),
            'submissions_today' => ActivitySubmission::whereDate('submitted_at', today())->count(),
            'prayer_requests'   => PrayerRequest::where('is_responded', false)->count(),
        ];

        $recentFamilies = User::where('role', 'parent')
            ->withCount('childProfiles')
            ->latest()
            ->take(5)
            ->get();

        // Map to rename `child_profile` → `child` so the JSX prop `s.child` works correctly
        $recentSubmissions = ActivitySubmission::with(['childProfile', 'activity'])
            ->latest('submitted_at')
            ->take(8)
            ->get()
            ->map(fn ($s) => [
                'id'       => $s->id,
                'score'    => $s->score,
                'child'    => $s->childProfile ? [
                    'id'   => $s->childProfile->id,
                    'name' => $s->childProfile->name,
                ] : null,
                'activity' => $s->activity ? [
                    'id'        => $s->activity->id,
                    'title'     => $s->activity->title,
                    'max_score' => $s->activity->max_score,
                ] : null,
            ]);

        return Inertia::render('Admin/Dashboard', compact(
            'stats',
            'recentFamilies',
            'recentSubmissions'
        ));
    }
}