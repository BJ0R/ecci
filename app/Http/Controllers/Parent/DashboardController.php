<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Lesson; use App\Models\MemoryVerse;
use App\Models\Announcement; use App\Models\ChildProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $parent = $request->user();
        $children = $parent->childProfiles; // all child profiles for this parent

        // Determine active child (sent from frontend or default to first)
        $activeChildId = $request->query('child_id', $children->first()?->id);
        $activeChild   = $children->firstWhere('id', $activeChildId);

        // Stats for the active child
        $stats = [];
        if ($activeChild) {
            $stats = [
                'lessons_completed' => $activeChild->lessonProgresses()
                    ->where('status', 'completed')->count(),
                'lessons_total'     => Lesson::where('is_published', true)
                    ->where('age_group', $activeChild->ageGroup())->count(),
                'quizzes_done'      => $activeChild->activitySubmissions()->count(),
                'badges_earned'     => $activeChild->badges()->count(),
            ];
        }

        $recentLessons    = Lesson::where('is_published', true)
            ->latest('published_at')->take(5)->get();

        $currentVerse     = MemoryVerse::latest()->first();
        $announcements    = Announcement::latest()->take(3)->get();

        return Inertia::render('Parent/Dashboard', [
            'children'      => $children,
            'activeChild'   => $activeChild,
            'stats'         => $stats,
            'recentLessons' => $recentLessons,
            'currentVerse'  => $currentVerse,
            'announcements' => $announcements,
        ]);
    }
}