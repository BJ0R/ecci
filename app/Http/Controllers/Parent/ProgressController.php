<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\ChildProfile;
use Inertia\Inertia;

class ProgressController extends Controller
{
    /** Show full progress dashboard for a specific child */
    public function show(ChildProfile $child)
    {
        // OwnsFamilyProfile middleware ensures this child belongs to parent
        $child->load([
            'lessonProgresses.lesson',
            'activitySubmissions.activity.lesson',
            'verseCompletions.memoryVerse',
            'badges',
        ]);

        $stats = [
            'lessons_completed'  => $child->lessonProgresses
                ->where('status', 'completed')->count(),
            'lessons_viewed'     => $child->lessonProgresses
                ->where('status', 'viewed')->count(),
            'quizzes_total'      => $child->activitySubmissions->count(),
            'average_score'      => $child->activitySubmissions->avg('score'),
            'verses_memorized'   => $child->verseCompletions->count(),
            'badges_earned'      => $child->badges->count(),
        ];

        return Inertia::render('Parent/Progress/Show', [
            'child' => $child, 'stats' => $stats,
        ]);
    }
}