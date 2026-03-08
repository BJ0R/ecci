<?php
// app/Http/Controllers/Teacher/MemoryVerseController.php

namespace App\Http\Controllers\Teacher;   // ← FIXED (was Admin)

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemoryVerseRequest;
use App\Models\MemoryVerse;
use Inertia\Inertia;

class MemoryVerseController extends Controller
{
    public function index()
    {
        $verses = MemoryVerse::withCount('completions')
            ->latest()
            ->paginate(20);

        return Inertia::render('Teacher/Verses/Index', ['verses' => $verses]); // ← FIXED path
    }

    public function store(StoreMemoryVerseRequest $request)
    {
        MemoryVerse::create([
            'verse_text'   => $request->verse_text,
            'reference'    => $request->reference,
            'week_number'  => $request->week_number,
            'context_note' => $request->context_note,
        ]);

        return back()->with('success', 'Verse posted.');
    }

    public function destroy(MemoryVerse $memoryVerse)
    {
        $memoryVerse->delete();
        return back()->with('success', 'Verse removed.');
    }
}