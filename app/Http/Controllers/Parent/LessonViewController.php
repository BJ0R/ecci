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
     * ROOT CAUSE OF "only one lesson shown":
     *   The original code called $child->ageGroup() — a method that does NOT
     *   exist on the ChildProfile model. PHP silently returns null, so the
     *   WHERE clause becomes  WHERE age_group = ''  which matches nothing
     *   (or at most one accidental row).
     *
     * FIX: resolveAgeGroup() derives the group directly from $child->age_group
     *   (the raw column) or $child->age (the numeric age), never calling any
     *   model method. This matches how lessons.age_group is stored: 'kids',
     *   'nursery', 'youth' (lowercase).
     */
    public function index(Request $request)
    {
        $parent   = $request->user();
        $children = $parent->childProfiles()->get();

        $childId = $request->query('child_id')
            ?? $request->session()->get('active_child_id');

        $child = $childId
            ? ($children->firstWhere('id', $childId) ?? $children->first())
            : $children->first();

        if (! $child) {
            return Inertia::render('Parent/Lessons/Index', [
                'lessons' => [],
                'child'   => null,
            ]);
        }

        $request->session()->put('active_child_id', $child->id);

        $ageGroup = $this->resolveAgeGroup($child);

        $lessons = Lesson::where('is_published', true)
            ->whereRaw('LOWER(age_group) = ?', [$ageGroup])
            ->with('content')
            ->withCount('activities')
            ->orderBy('week_number')
            ->get()
            ->map(function ($lesson) use ($child) {
                $progress = LessonProgress::where([
                    'lesson_id'        => $lesson->id,
                    'child_profile_id' => $child->id,
                ])->first();

                $lesson->progress = $progress
                    ? ['status' => $progress->status, 'completed_at' => $progress->completed_at]
                    : null;

                return $lesson;
            });

        return Inertia::render('Parent/Lessons/Index', [
            'lessons' => $lessons,
            'child'   => $child,
        ]);
    }

    /**
     * Show a single lesson.
     * Auto-marks as "viewed" for the active child on first visit.
     */
    public function show(Request $request, Lesson $lesson)
    {
        abort_if(! $lesson->is_published, 404);

        $lesson->load([
            'content',
            'activities' => fn ($q) => $q->withCount('questions')->orderBy('created_at'),
        ]);

        $childId = $request->query('child_id')
            ?? $request->session()->get('active_child_id');

        if ($childId) {
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
     * Route accepts both POST and PATCH (see web.php Route::match).
     */
    public function complete(Request $request, Lesson $lesson)
    {
        $request->validate([
            'child_profile_id' => 'required|exists:child_profiles,id',
        ]);

        $child = $request->user()->childProfiles()
            ->findOrFail($request->child_profile_id);

        LessonProgress::updateOrCreate(
            ['lesson_id' => $lesson->id, 'child_profile_id' => $child->id],
            ['status' => 'completed', 'completed_at' => now()]
        );

        return back()->with('success', 'Lesson marked as completed! 🎉');
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Derive the lessons.age_group filter value from whatever the ChildProfile
     * model actually exposes — without calling any model method.
     *
     * Returns one of: 'nursery' | 'kids' | 'youth'  (always lowercase)
     *
     * Priority:
     *  1. $child->age_group column if it contains a valid group string.
     *  2. Computed from $child->age (integer) — same thresholds as Index.jsx.
     *  3. 'kids' as a safe fallback so the page never goes completely blank.
     */
    private function resolveAgeGroup($child): string
    {
        // ── 1. Direct age_group column ────────────────────────────────────────
        $stored = isset($child->age_group) ? strtolower((string) $child->age_group) : '';
        if (in_array($stored, ['nursery', 'kids', 'youth'], true)) {
            return $stored;
        }

        // ── 2. Compute from numeric age ───────────────────────────────────────
        //    Mirrors the ageGroupLabel() helper in Index.jsx exactly:
        //      age ≤ 5  → nursery
        //      age ≤ 10 → kids
        //      age > 10 → youth
        $age = (int) ($child->age ?? 0);
        if ($age > 0) {
            if ($age <= 5)  return 'nursery';
            if ($age <= 10) return 'kids';
            return 'youth';
        }

        // ── 3. Fallback ───────────────────────────────────────────────────────
        return 'kids';
    }
}