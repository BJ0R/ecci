<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use Inertia\Inertia;

class LessonController extends Controller
{
    /** List all lessons for admin management */
    public function index()
    {
        $lessons = Lesson::with('creator')
            ->withCount(['activities', 'lessonProgresses'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Lessons/Index', ['lessons' => $lessons]);
    }

    /** Show create form */
    public function create()
    {
        return Inertia::render('Admin/Lessons/Create');
    }

    /**
     * Store new lesson + its content.
     *
     * Fixes applied vs original:
     *  1. series  coalesced to '' — column is NOT NULL with no default
     *  2. prayer  coalesced to '' — column is NOT NULL with no default
     *  3. reflection_questions filtered to remove blank entries the user
     *     left empty before submitting (cleaner data in DB)
     */
    public function store(StoreLessonRequest $request)
    {
        $lesson = Lesson::create([
            'created_by'   => auth()->id(),
            'title'        => $request->title,
            'series'       => $request->series       ?? '',
            'week_number'  => $request->week_number,
            'age_group'    => $request->age_group,
            'is_published' => $request->boolean('is_published'),
            'published_at' => $request->boolean('is_published') ? now() : null,
        ]);

        $lesson->content()->create([
            'bible_reference'      => $request->bible_reference,
            'bible_text'           => $request->bible_text,
            'explanation'          => $request->explanation,
            // Filter out blank strings left in the dynamic list
            'reflection_questions' => array_values(
                array_filter($request->reflection_questions ?? [], fn ($q) => trim((string) $q) !== '')
            ),
            'prayer' => $request->prayer ?? '',
        ]);

        return redirect()
            ->route('admin.lessons.index')
            ->with('success', 'Lesson "' . $lesson->title . '" ' . ($lesson->is_published ? 'published' : 'saved as draft') . '.');
    }

    /** Show edit form */
    public function edit(Lesson $lesson)
    {
        $lesson->load('content');

        return Inertia::render('Admin/Lessons/Edit', [
            'lesson' => [
                'id'           => $lesson->id,
                'title'        => $lesson->title,
                'series'       => $lesson->series,
                'week_number'  => $lesson->week_number,
                'age_group'    => $lesson->age_group,
                'is_published' => (bool) $lesson->is_published,
                'published_at' => $lesson->published_at,
                'created_at'   => $lesson->created_at,
                'content'      => $lesson->content ? [
                    'bible_reference'      => $lesson->content->bible_reference,
                    'bible_text'           => $lesson->content->bible_text,
                    'explanation'          => $lesson->content->explanation,
                    // Always send at least [''] so Edit.jsx has one empty row to start
                    'reflection_questions' => !empty($lesson->content->reflection_questions)
                        ? $lesson->content->reflection_questions
                        : [''],
                    'prayer' => $lesson->content->prayer,
                ] : null,
            ],
        ]);
    }

    /**
     * Update lesson + its content.
     *
     * Same null-coalescing fixes as store().
     * published_at: only set the first time it goes live — preserve original date on re-saves.
     */
    public function update(UpdateLessonRequest $request, Lesson $lesson)
    {
        $nowPublished = $request->boolean('is_published');

        $lesson->update([
            'title'        => $request->title,
            'series'       => $request->series      ?? '',
            'week_number'  => $request->week_number,
            'age_group'    => $request->age_group,
            'is_published' => $nowPublished,
            'published_at' => $nowPublished
                ? ($lesson->published_at ?? now())   // preserve original publish date
                : null,
        ]);

        $lesson->content()->updateOrCreate(
            ['lesson_id' => $lesson->id],
            [
                'bible_reference'      => $request->bible_reference,
                'bible_text'           => $request->bible_text,
                'explanation'          => $request->explanation,
                'reflection_questions' => array_values(
                    array_filter($request->reflection_questions ?? [], fn ($q) => trim((string) $q) !== '')
                ),
                'prayer' => $request->prayer ?? '',
            ]
        );

        return redirect()
            ->route('admin.lessons.index')
            ->with('success', 'Lesson updated.');
    }

    /** Soft-delete (archive) lesson — progress records are preserved */
    public function destroy(Lesson $lesson)
    {
        $lesson->delete();

        return back()->with('success', 'Lesson archived.');
    }
}