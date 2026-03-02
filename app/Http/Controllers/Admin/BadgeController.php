<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\ChildProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;   // ← Fix #2: proper DB facade import
use Inertia\Inertia;

class BadgeController extends Controller
{
    // ── Index ─────────────────────────────────────────────────────────────────
    /**
     * List all configured badges.
     * Shows how many children have earned each badge (via child_badges pivot).
     */
    public function index()
    {
        $badges = Badge::withCount('childProfiles')   // counts child_badges rows
            ->latest()
            ->get();

        // Overview stat: total unique badges earned across all children
        $totalAwarded = DB::table('child_badges')->count();

        return Inertia::render('Admin/Badges/Index', [
            'badges'       => $badges,
            'totalAwarded' => $totalAwarded,
        ]);
    }

    // ── Create ────────────────────────────────────────────────────────────────
    /**
     * Show the badge creation form.
     */
    public function create()
    {
        return Inertia::render('Admin/Badges/Create');
    }

    // ── Store ─────────────────────────────────────────────────────────────────
    /**
     * Persist a new badge with its auto-award trigger rule.
     *
     * trigger_rule JSON examples:
     *   {"type": "quiz_count",    "threshold": 5}  — awarded after 5 quizzes
     *   {"type": "lesson_count",  "threshold": 10} — awarded after 10 lessons
     *   {"type": "perfect_score", "threshold": 1}  — awarded on first perfect score
     *   {"type": "verse_count",   "threshold": 3}  — awarded after 3 verses memorized
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'                   => 'required|string|max:80|unique:badges,name',
            'icon'                   => 'required|string|max:100',   // emoji or SVG path
            'description'            => 'nullable|string|max:300',
            'trigger_rule'           => 'required|array',
            'trigger_rule.type'      => 'required|in:quiz_count,lesson_count,perfect_score,verse_count',
            'trigger_rule.threshold' => 'required|integer|min:1',
        ]);

        Badge::create([
            'name'         => $request->name,
            'icon'         => $request->icon,
            'description'  => $request->description,
            'trigger_rule' => $request->trigger_rule,   // auto-cast to JSON by model
        ]);

        return redirect()
            ->route('admin.badges.index')
            ->with('success', 'Badge "' . $request->name . '" created.');  // ← Fix #1: straight quotes
    }

    // ── Edit ──────────────────────────────────────────────────────────────────
    /**
     * Show the edit form for an existing badge.
     * Also passes a summary of which children have already earned it.
     */
    public function edit(Badge $badge)
    {
        $badge->load([
            'childProfiles:id,name,avatar_color',   // pivot: child_badges
        ]);

        return Inertia::render('Admin/Badges/Edit', [
            'badge' => $badge,
        ]);
    }

    // ── Update ────────────────────────────────────────────────────────────────
    /**
     * Update an existing badge's metadata / trigger rule.
     * NOTE: changing the trigger rule does NOT retroactively revoke earned badges
     * — it only affects future automatic checks.
     */
    public function update(Request $request, Badge $badge)
    {
        $request->validate([
            'name'                   => "required|string|max:80|unique:badges,name,{$badge->id}",
            'icon'                   => 'required|string|max:100',
            'description'            => 'nullable|string|max:300',
            'trigger_rule'           => 'required|array',
            'trigger_rule.type'      => 'required|in:quiz_count,lesson_count,perfect_score,verse_count',
            'trigger_rule.threshold' => 'required|integer|min:1',
        ]);

        $badge->update([
            'name'         => $request->name,
            'icon'         => $request->icon,
            'description'  => $request->description,
            'trigger_rule' => $request->trigger_rule,
        ]);

        return back()->with('success', 'Badge updated successfully.');
    }

    // ── Destroy ───────────────────────────────────────────────────────────────
    /**
     * Delete a badge and its child_badges pivot records (cascade via DB).
     */
    public function destroy(Badge $badge)
    {
        $name = $badge->name;
        $badge->delete();

        return redirect()
            ->route('admin.badges.index')
            ->with('success', 'Badge "' . $name . '" has been removed.');  // ← Fix #1: straight quotes
    }
}