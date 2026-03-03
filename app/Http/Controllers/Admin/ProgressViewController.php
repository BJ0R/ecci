<?php
// app/Http/Controllers/Admin/ProgressViewController.php
// ─────────────────────────────────────────────────────────────────────────
// FIXES:
//  1. index() now sends 'children' (flat paginated ChildProfile list) instead
//     of 'families' — matches what Index.jsx expects.
//  2. Each child gets a 'lessons_total' attribute computed from published
//     lessons for their age group — was missing, causing 0% progress bars.
//  3. Summary stats renamed to match what Index.jsx reads (total_children,
//     avg_completion, active_this_week).
// ─────────────────────────────────────────────────────────────────────────

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
    public function index()
    {
        // ── Platform-wide summary numbers ────────────────────────────────────
        $totalChildren   = ChildProfile::count();
        $totalPublished  = Lesson::where('is_published', true)->count();
        $totalCompleted  = LessonProgress::where('status', 'completed')->count();

        // avg_completion = (completed lesson_progress rows / max possible) * 100
        // max possible = total children × total published lessons
        $maxPossible   = $totalChildren * max($totalPublished, 1);
        $avgCompletion = $maxPossible > 0
            ? round(($totalCompleted / $maxPossible) * 100)
            : 0;

        // "active this week" = children who have a lesson_progress or submission
        // updated in the last 7 days
        $activeThisWeek = ChildProfile::where(function ($q) {
            $q->whereHas('lessonProgresses', fn ($lp) =>
                $lp->where('updated_at', '>=', now()->subDays(7))
            )->orWhereHas('activitySubmissions', fn ($sub) =>
                $sub->where('submitted_at', '>=', now()->subDays(7))
            );
        })->count();

        $summary = [
            'total_children'    => $totalChildren,
            'avg_completion'    => $avgCompletion,
            'active_this_week'  => $activeThisWeek,
            // kept for the detailed stats row at the top of the page
            'total_families'    => User::where('role', 'parent')->count(),
            'total_lessons'     => $totalPublished,
            'lessons_completed' => $totalCompleted,
            'total_submissions' => ActivitySubmission::count(),
            'avg_score'         => round(ActivitySubmission::avg('score') ?? 0, 1),
        ];

        // ── FIX: Pre-compute published lesson counts per age group ────────────
        // This lets us attach lessons_total to every child without N+1 queries.
        $lessonCountByGroup = Lesson::where('is_published', true)
            ->selectRaw('age_group, COUNT(*) as total')
            ->groupBy('age_group')
            ->pluck('total', 'age_group'); // e.g. ['nursery'=>3,'kids'=>8,'youth'=>5]

        // ── FIX: Paginate CHILDREN directly (not families) ───────────────────
        // Index.jsx iterates child rows; it needs child data, not family data.
        $children = ChildProfile::with('user:id,name,family_name')
            ->withCount([
                'lessonProgresses',
                // FIX: named count → lessons_completed_count
                'lessonProgresses as lessons_completed_count' => fn ($q) =>
                    $q->where('status', 'completed'),
                'activitySubmissions as activity_submissions_count',
                'badges as badges_count',
            ])
            ->latest()
            ->paginate(20)
            // FIX: inject lessons_total onto every child using their age group
            ->through(function (ChildProfile $child) use ($lessonCountByGroup) {
                $child->lessons_total = $lessonCountByGroup[$child->ageGroup()] ?? 0;
                return $child;
            });

        // ── Top earners leaderboard (sidebar widget) ──────────────────────────
        $topEarners = ChildProfile::withCount('badges')
            ->with('user:id,name,family_name')
            ->orderByDesc('badges_count')
            ->take(5)
            ->get();

        // ── Recent submissions feed ────────────────────────────────────────────
        $recentSubmissions = ActivitySubmission::with([
            'childProfile:id,name,avatar_color',
            'activity:id,title,max_score',
        ])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Progress/Index', [
            // FIX: prop renamed from 'families' → 'children' to match Index.jsx
            'children'           => $children,
            // FIX: prop renamed from 'stats' → 'summary' to match Index.jsx
            'summary'            => $summary,
            'topEarners'         => $topEarners,
            'recentSubmissions'  => $recentSubmissions,
        ]);
    }

    // ── Show ──────────────────────────────────────────────────────────────────
    public function show(ChildProfile $child)
    {
        $child->load([
            'user:id,name,family_name,email',
            'lessonProgresses.lesson:id,title,series,week_number,age_group',
            'activitySubmissions.activity:id,title,type,max_score',
            'activitySubmissions.activity.lesson:id,title',
            'verseCompletions.memoryVerse:id,reference,verse_text,week_number',
            'badges',
        ]);

        // Attach lessons_total for the show page as well
        $child->lessons_total = Lesson::where('is_published', true)
            ->where('age_group', $child->ageGroup())
            ->count();

        $stats = [
            'lessons_completed' => $child->lessonProgresses->where('status', 'completed')->count(),
            'lessons_viewed'    => $child->lessonProgresses->where('status', 'viewed')->count(),
            'lessons_total'     => $child->lessons_total,
            'quizzes_total'     => $child->activitySubmissions->count(),
            'average_score'     => round($child->activitySubmissions->avg('score') ?? 0, 1),
            'perfect_scores'    => $child->activitySubmissions
                ->filter(fn ($s) => $s->score !== null && $s->score === $s->activity?->max_score)
                ->count(),
            'verses_memorized'  => $child->verseCompletions->count(),
            'badges_earned'     => $child->badges->count(),
        ];

        $scoreHistory = $child->activitySubmissions
            ->sortBy('submitted_at')
            ->map(fn ($s) => [
                'label'     => $s->activity?->title ?? '—',
                'score'     => $s->score,
                'max_score' => $s->activity?->max_score ?? 0,
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