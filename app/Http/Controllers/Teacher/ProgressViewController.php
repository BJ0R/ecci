<?php
// app/Http/Controllers/Teacher/ProgressViewController.php

namespace App\Http\Controllers\Teacher;   // ← FIXED (was Admin)

use App\Http\Controllers\Controller;
use App\Models\ActivitySubmission;
use App\Models\ChildProfile;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\User;
use Inertia\Inertia;

class ProgressViewController extends Controller
{
    public function index()
    {
        $totalChildren  = ChildProfile::count();
        $totalPublished = Lesson::where('is_published', true)->count();
        $totalCompleted = LessonProgress::where('status', 'completed')->count();

        $maxPossible   = $totalChildren * max($totalPublished, 1);
        $avgCompletion = $maxPossible > 0
            ? round(($totalCompleted / $maxPossible) * 100)
            : 0;

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
            'total_families'    => User::where('role', 'parent')->count(),
            'total_lessons'     => $totalPublished,
            'lessons_completed' => $totalCompleted,
            'total_submissions' => ActivitySubmission::count(),
            'avg_score'         => round(ActivitySubmission::avg('score') ?? 0, 1),
        ];

        $lessonCountByGroup = Lesson::where('is_published', true)
            ->selectRaw('age_group, COUNT(*) as total')
            ->groupBy('age_group')
            ->pluck('total', 'age_group');

        $children = ChildProfile::with('user:id,name,family_name')
            ->withCount([
                'lessonProgresses',
                'lessonProgresses as lessons_completed_count' => fn ($q) =>
                    $q->where('status', 'completed'),
                'activitySubmissions as activity_submissions_count',
                'badges as badges_count',
            ])
            ->latest()
            ->paginate(20)
            ->through(function (ChildProfile $child) use ($lessonCountByGroup) {
                $child->lessons_total = $lessonCountByGroup[$child->ageGroup()] ?? 0;
                return $child;
            });

        $topEarners = ChildProfile::withCount('badges')
            ->with('user:id,name,family_name')
            ->orderByDesc('badges_count')
            ->take(5)
            ->get();

        $recentSubmissions = ActivitySubmission::with([
            'childProfile:id,name,avatar_color',
            'activity:id,title,max_score',
        ])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return Inertia::render('Teacher/Progress/Index', [ // ← FIXED path
            'children'          => $children,
            'summary'           => $summary,
            'topEarners'        => $topEarners,
            'recentSubmissions' => $recentSubmissions,
        ]);
    }

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

        return Inertia::render('Teacher/Progress/Show', [ // ← FIXED path
            'child'        => $child,
            'stats'        => $stats,
            'scoreHistory' => $scoreHistory,
        ]);
    }
}