<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitActivityRequest;
use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\Badge;
use App\Models\ChildProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityViewController extends Controller
{
    /**
     * Show activity/quiz page.
     * Loads all of the parent's children for the "Who is taking this?" selector.
     * Also loads existing submissions so already-done children are marked.
     */
    public function show(Request $request, Activity $activity)
    {
        $activity->load('questions', 'lesson');

        $children = $request->user()->childProfiles()
            ->select('id', 'name', 'avatar_color')
            ->get();

        // Key by child_profile_id so the frontend can do O(1) lookups
        $existingSubmissions = ActivitySubmission::where('activity_id', $activity->id)
            ->whereIn('child_profile_id', $children->pluck('id'))
            ->get()
            ->keyBy('child_profile_id');

        return Inertia::render('Parent/Activities/Show', [
            'activity'            => $activity,
            'children'            => $children,
            'existingSubmissions' => $existingSubmissions,
        ]);
    }

    /**
     * Submit a quiz/activity for a specific child.
     *
     * Request must include:
     *   child_profile_id — which child is submitting
     *   answers          — array keyed by question_id (quiz) or { fill: string } (fill)
     *
     * After submission redirects BACK to the same activity page so the parent
     * can immediately take the activity for another child without losing context.
     */
    public function submit(SubmitActivityRequest $request, Activity $activity)
    {
        // Verify this child belongs to the logged-in parent
        $child = $request->user()->childProfiles()
            ->findOrFail($request->child_profile_id);

        // Prevent duplicate submission for same child
        $existing = ActivitySubmission::where([
            'activity_id'      => $activity->id,
            'child_profile_id' => $child->id,
        ])->first();

        if ($existing) {
            return back()->withErrors([
                'child_profile_id' => "{$child->name} has already submitted this activity.",
            ]);
        }

        // Calculate score for quiz type
        $score = 0;
        if ($activity->type === 'quiz') {
            $activity->load('questions');
            foreach ($activity->questions as $question) {
                $submitted = $request->answers[$question->id] ?? null;
                if ($submitted === $question->correct_answer) {
                    $score += $question->points;
                }
            }
        }

        ActivitySubmission::create([
            'activity_id'      => $activity->id,
            'child_profile_id' => $child->id,
            'submitted_by'     => $request->user()->id,
            'answers'          => $request->answers ?? [],
            'score'            => $score,
            'submitted_at'     => now(),
        ]);

        // Award badges if eligible
        $this->checkAndAwardBadges($child);

        // Flash message varies by type
        $message = $activity->type === 'quiz'
            ? "{$child->name} scored {$score}/{$activity->max_score}! 🎉"
            : "{$child->name}'s response has been saved. ✓";

        // Redirect back to the same activity page so the parent can immediately
        // select another child and take it for them, without losing their place.
        return redirect()
            ->route('parent.activities.show', $activity)
            ->with('success', $message);
    }

    /** Auto-award badges based on trigger rules */
    private function checkAndAwardBadges(ChildProfile $child): void
    {
        $badges = Badge::all();

        foreach ($badges as $badge) {
            // Skip if already earned
            if ($child->badges()->where('badge_id', $badge->id)->exists()) {
                continue;
            }

            $rule      = $badge->trigger_rule ?? [];
            $qualified = false;

            match ($rule['type'] ?? '') {
                'quiz_count'   => $qualified = $child->activitySubmissions()->count() >= ($rule['threshold'] ?? 1),
                'lesson_count' => $qualified = $child->lessonProgresses()->where('status', 'completed')->count() >= ($rule['threshold'] ?? 1),
                'perfect_score' => $qualified = $child->activitySubmissions()
                    ->join('activities', 'activity_submissions.activity_id', '=', 'activities.id')
                    ->whereColumn('activity_submissions.score', 'activities.max_score')
                    ->exists(),
                default => null,
            };

            if ($qualified) {
                $child->badges()->attach($badge->id, ['awarded_at' => now()]);
            }
        }
    }
}