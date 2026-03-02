<?php
// app/Http/Controllers/Admin/ActivityController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use App\Models\Lesson;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::with('lesson')
            ->withCount('submissions')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function create()
    {
        // Include ALL lessons (draft + published) so admin can pre-link activities
        $lessons = Lesson::orderBy('week_number')
            ->select('id', 'title', 'series', 'week_number', 'is_published')
            ->get();

        return Inertia::render('Admin/Activities/Create', [
            'lessons' => $lessons,
        ]);
    }

    public function store(StoreActivityRequest $request)
    {
        // For quiz: auto-compute max_score from the sum of question points
        // For fill: use the admin-entered max_score (default 10)
        $maxScore = (int) ($request->max_score ?? 10);

        if ($request->type === 'quiz' && $request->filled('questions')) {
            $maxScore = collect($request->questions)
                ->sum(fn ($q) => (int) ($q['points'] ?? 1));
        }

        $activity = Activity::create([
            'lesson_id'    => $request->lesson_id ?: null,  // empty string → null
            'title'        => $request->title,
            'type'         => $request->type,               // quiz | fill  (drawing removed)
            'instructions' => $request->instructions,
            'max_score'    => $maxScore,
        ]);

        // Persist questions for quiz type only
        if ($request->type === 'quiz' && $request->filled('questions')) {
            foreach ($request->questions as $q) {
                // Strip blank choices before saving
                $choices = array_values(
                    array_filter($q['choices'] ?? [], fn ($c) => trim((string) $c) !== '')
                );

                $activity->questions()->create([
                    'question_text'  => $q['question_text'],
                    'choices'        => $choices,
                    'correct_answer' => $q['correct_answer'],
                    'points'         => (int) ($q['points'] ?? 1),
                ]);
            }
        }

        // Fill activities: no questions — only instructions + manual review
        // The parent reads the text, child answers verbally or in writing,
        // parent types the answer into the textarea and submits.

        return redirect()
            ->route('admin.activities.index')
            ->with('success', "Activity \"{$activity->title}\" created successfully.");
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return back()->with('success', 'Activity deleted.');
    }
}