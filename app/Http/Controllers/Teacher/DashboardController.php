<?php
// app/Http/Controllers/Teacher/DashboardController.php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\ChildProfile;
use App\Models\Lesson;
use App\Models\MemoryVerse;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_lessons'     => Lesson::count(),
            'published_lessons' => Lesson::where('is_published', true)->count(),
            'draft_lessons'     => Lesson::where('is_published', false)->count(),
            'total_activities'  => Activity::count(),
            'total_children'    => ChildProfile::count(),
            'submissions_today' => ActivitySubmission::whereDate('submitted_at', today())->count(),
            'total_verses'      => MemoryVerse::count(),
        ];

        $recentLessons = Lesson::with('creator')
            ->withCount('activities')
            ->latest()
            ->take(5)
            ->get();

        $recentSubmissions = ActivitySubmission::with(['childProfile', 'activity'])
            ->latest('submitted_at')
            ->take(8)
            ->get()
            ->map(fn ($s) => [
                'id'           => $s->id,
                'score'        => $s->score,
                'submitted_at' => $s->submitted_at,
                'child'        => $s->childProfile
                    ? ['id' => $s->childProfile->id, 'name' => $s->childProfile->name]
                    : null,
                'activity'     => $s->activity
                    ? ['id' => $s->activity->id, 'title' => $s->activity->title, 'max_score' => $s->activity->max_score]
                    : null,
            ]);

        return Inertia::render('Teacher/Dashboard', compact(
            'stats',
            'recentLessons',
            'recentSubmissions'
        ));
    }
}