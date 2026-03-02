<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\MemoryVerse; use App\Models\VerseCompletion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerseController extends Controller
{
    public function index(Request $request)
    {
        $verses   = MemoryVerse::latest()->get();
        $children = $request->user()->childProfiles()->get();

        // Map completions per child per verse
        $completions = VerseCompletion::whereIn('child_profile_id', $children->pluck('id'))
            ->get()->groupBy('memory_verse_id');

        return Inertia::render('Parent/Verses/Index', [
            'verses'      => $verses,
            'children'    => $children,
            'completions' => $completions,
        ]);
    }

    /** Mark a verse as memorized for a specific child */
    public function markComplete(Request $request, MemoryVerse $memoryVerse)
    {
        $request->validate(['child_profile_id' => 'required|exists:child_profiles,id']);

        // Verify ownership
        $child = $request->user()->childProfiles()
            ->findOrFail($request->child_profile_id);

        VerseCompletion::firstOrCreate([
            'memory_verse_id'  => $memoryVerse->id,
            'child_profile_id' => $child->id,
        ], [
            'marked_by'    => $request->user()->id,
            'memorized_at' => now(),
        ]);

        return back()->with('success', "{$child->name} memorized the verse!");
    }
}