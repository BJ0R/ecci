<?php
// app/Http/Controllers/Teacher/ActivityController.php

namespace App\Http\Controllers\Teacher;   // ← FIXED (was Admin)

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

        return Inertia::render('Teacher/Activities/Index', [ // ← FIXED path
            'activities' => $activities,
        ]);
    }

    public function create()
    {
        // Include ALL lessons (draft + published) so teacher can pre-link activities
        $lessons = Lesson::orderBy('week_number')
            ->select('id', 'title', 'series', 'week_number', 'is_published')
            ->get();

        return Inertia::render('Teacher/Activities/Create', [ // ← FIXED path
            'lessons' => $lessons,
        ]);
    }

    public function store(StoreActivityRequest $request)
    {
        $maxScore = (int) ($request->max_score ?? 10);

        if ($request->type === 'quiz' && $request->filled('questions')) {
            $maxScore = collect($request->questions)
                ->sum(fn ($q) => (int) ($q['points'] ?? 1));
        }

        $activity = Activity::create([
            'lesson_id'    => $request->lesson_id ?: null,
            'title'        => $request->title,
            'type'         => $request->type,
            'instructions' => $request->instructions,
            'max_score'    => $maxScore,
        ]);

        if ($request->type === 'quiz' && $request->filled('questions')) {
            foreach ($request->questions as $q) {
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

        return redirect()
            ->route('teacher.activities.index')
            ->with('success', "Activity \"{$activity->title}\" created successfully.");
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return back()->with('success', 'Activity deleted.');
    }
}