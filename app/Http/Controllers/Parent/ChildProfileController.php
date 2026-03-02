<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChildProfileRequest;
use App\Models\ChildProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildProfileController extends Controller
{
    /** List all child profiles for the logged-in parent */
    public function index(Request $request)
    {
        $children = $request->user()
            ->childProfiles()
            ->withCount(['lessonProgresses', 'activitySubmissions', 'badges'])
            ->get();

        return Inertia::render('Parent/Children/Index', ['children' => $children]);
    }

    public function create()
    {
        return Inertia::render('Parent/Children/Create');
    }

    /** Add a new child profile to the parent account */
    public function store(StoreChildProfileRequest $request)
    {
        $request->user()->childProfiles()->create([
            'name'         => $request->name,
            'age'          => $request->age,
            'grade'        => $request->grade,
            'avatar_color' => $request->avatar_color ?? '#B8923A',
        ]);

        return redirect()->route('parent.children.index')
            ->with('success', "{$request->name} has been added to your family.");
    }

    /** Update child profile name, age, grade */
    public function update(StoreChildProfileRequest $request, ChildProfile $child)
    {
        // OwnsFamilyProfile middleware already verified ownership
        $child->update($request->only('name', 'age', 'grade', 'avatar_color'));
        return back()->with('success', 'Profile updated.');
    }

    /** Remove a child profile (hard delete — ask confirmation) */
    public function destroy(ChildProfile $child)
    {
        $name = $child->name;
        $child->delete();
        return redirect()->route('parent.children.index')
            ->with('success', "{$name}'s profile has been removed.");
    }
}