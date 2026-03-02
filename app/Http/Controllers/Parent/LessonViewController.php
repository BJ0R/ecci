<?php
// app/Http/Controllers/Parent/LessonViewController.php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonViewController extends Controller
{
    /**
     * Show all published lessons filtered for the active child's age group.
     *
     * Child resolution order (matches HandleInertiaRequests):
     *   1. ?child_id= in URL (and belongs to this parent)
     *   2. session('active_child_id')
     *   3. First child registered (only on first-ever visit)
     *   4. No children → render empty state
     */
    public function index(Request $request)
    {
        $parent   = $request->user();
        $children = $parent->childProfiles()->get();

        // Step 1: URL param
        // Step 2: Session fallback (set by HandleInertiaRequests or prior page)
        $childId = $request->query('child_id')
            ?? $request->session()->get('active_child_id');

        // Safe lookup — firstWhere returns null instead of throwing
        $child = $childId
            ? ($children->firstWhere('id', $childId) ?? $children->first())
            : $children->first();

        if (! $child) {
            return Inertia::render('Parent/Lessons/Index', [
                'lessons' => [],
                'child'   => null,
            ]);
        }

        // Save to session so switching child on this page persists everywhere
        $request->session()->put('active_child_id', $child->id);

        $lessons = Lesson::where('is_published', true)
            ->where('age_group', $child->ageGroup())
            ->withCount('activities')
            ->orderBy('week_number')
            ->get()
            ->map(function ($lesson) use ($child) {
                $lesson->progress = LessonProgress::where([
                    'lesson_id'        => $lesson->id,
                    'child_profile_id' => $child->id,
                ])->first();
                return $lesson;
            });

        return Inertia::render('Parent/Lessons/Index', [
            'lessons' => $lessons,
            'child'   => $child,
        ]);
    }

    /**
     * Show a single lesson. Auto-marks as "viewed" for the active child.
     */
    public function show(Request $request, Lesson $lesson)
    {
        abort_if(! $lesson->is_published, 404);

        $lesson->load([
            'content',
            'activities' => fn ($q) => $q->withCount('questions')->orderBy('created_at'),
        ]);

        // Use ?child_id= from URL or fall back to session (same priority order)
        $childId = $request->query('child_id')
            ?? $request->session()->get('active_child_id');

        if ($childId) {
            // Verify child belongs to this parent before writing progress
            $owns = $request->user()->childProfiles()->where('id', $childId)->exists();
            if ($owns) {
                LessonProgress::firstOrCreate(
                    ['lesson_id' => $lesson->id, 'child_profile_id' => $childId],
                    ['status' => 'viewed']
                );
            }
        }

        return Inertia::render('Parent/Lessons/Show', [
            'lesson' => $lesson,
        ]);
    }

    /**
     * Mark a lesson as fully completed for a specific child.
     * Called from the "Mark as Completed" sidebar button.
     */
    public function complete(Request $request, Lesson $lesson)
    {
        $request->validate([
            'child_profile_id' => 'required|exists:child_profiles,id',
        ]);

        // Verify ownership before writing
        $child = $request->user()->childProfiles()
            ->findOrFail($request->child_profile_id);

        LessonProgress::updateOrCreate(
            ['lesson_id' => $lesson->id, 'child_profile_id' => $child->id],
            ['status' => 'completed', 'completed_at' => now()]
        );

        return back()->with('success', 'Lesson marked as completed! 🎉');
    }
}