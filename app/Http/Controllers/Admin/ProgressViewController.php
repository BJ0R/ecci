<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivitySubmission;
use App\Models\ChildProfile;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\User;
use Inertia\Inertia;

class ProgressViewController extends Controller
{
    // ── Index ─────────────────────────────────────────────────────────────────
    /**
     * Platform-wide progress overview.
     * Shows all families and their children's aggregate stats so the admin
     * (pastor / teacher) can identify who is engaged and who needs follow-up.
     */
    public function index()
    {
        // ── Platform summary stats ───────────────────────────────────────────
        $stats = [
            'total_families'      => User::where('role', 'parent')->count(),
            'total_children'      => ChildProfile::count(),
            'total_lessons'       => Lesson::where('is_published', true)->count(),
            'lessons_completed'   => LessonProgress::where('status', 'completed')->count(),
            'total_submissions'   => ActivitySubmission::count(),
            'avg_score'           => round(ActivitySubmission::avg('score') ?? 0, 1),
        ];

        // ── Per-family breakdown (paginated) ─────────────────────────────────
        // Each row = one parent account with aggregate child progress rolled up
        $families = User::where('role', 'parent')
            ->with([
                'childProfiles' => function ($q) {
                    $q->withCount([
                        'lessonProgresses',
                        'lessonProgresses as lessons_completed_count' => fn ($q) =>
                            $q->where('status', 'completed'),
                        'activitySubmissions',
                        'badges',
                    ]);
                },
            ])
            ->withCount('childProfiles')
            ->latest()
            ->paginate(20);

        // ── Top earners leaderboard (top 5 children by badge count) ──────────
        $topEarners = ChildProfile::withCount('badges')
            ->with('user:id,name,family_name')
            ->orderByDesc('badges_count')
            ->take(5)
            ->get();

        // ── Recent submissions (last 10 across all children) ─────────────────
        $recentSubmissions = ActivitySubmission::with([
            'childProfile:id,name,avatar_color',
            'activity:id,title,max_score',
        ])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Progress/Index', [
            'stats'              => $stats,
            'families'           => $families,
            'topEarners'         => $topEarners,
            'recentSubmissions'  => $recentSubmissions,
        ]);
    }

    // ── Show ──────────────────────────────────────────────────────────────────
    /**
     * Detailed progress report for a specific child.
     * Used when admin clicks into an individual child from the overview table.
     * Mirrors the parent-facing progress page but is accessible to admins.
     */
    public function show(ChildProfile $child)
    {
        // Eager-load everything the view will need in one query set
        $child->load([
            'user:id,name,family_name,email',
            'lessonProgresses.lesson:id,title,series,week_number,age_group',
            'activitySubmissions.activity:id,title,type,max_score',
            'activitySubmissions.activity.lesson:id,title',
            'verseCompletions.memoryVerse:id,reference,verse_text,week_number',
            'badges',
        ]);

        // ── Computed stats for the summary cards ─────────────────────────────
        $stats = [
            'lessons_completed'  => $child->lessonProgresses
                ->where('status', 'completed')->count(),
            'lessons_viewed'     => $child->lessonProgresses
                ->where('status', 'viewed')->count(),
            'quizzes_total'      => $child->activitySubmissions->count(),
            'average_score'      => round(
                $child->activitySubmissions->avg('score') ?? 0, 1
            ),
            'perfect_scores'     => $child->activitySubmissions
                ->filter(fn ($s) => $s->score === $s->activity->max_score)
                ->count(),
            'verses_memorized'   => $child->verseCompletions->count(),
            'badges_earned'      => $child->badges->count(),
        ];

        // ── Quiz score history (for sparkline / progress chart) ───────────────
        $scoreHistory = $child->activitySubmissions
            ->sortBy('submitted_at')
            ->map(fn ($s) => [
                'label'     => $s->activity->title,
                'score'     => $s->score,
                'max_score' => $s->activity->max_score,
                'date'      => $s->submitted_at,
            ])
            ->values();

        return Inertia::render('Admin/Progress/Show', [
            'child'        => $child,
            'stats'        => $stats,
            'scoreHistory' => $scoreHistory,
        ]);
    }
}