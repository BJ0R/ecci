<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Models\Announcement;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->paginate(20);
        return Inertia::render('Admin/Announcements/Index', ['announcements' => $announcements]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        Announcement::create([
            'posted_by' => auth()->id(),
            'title'     => $request->title,
            'body'      => $request->body,
            'pinned'    => $request->boolean('pinned'),
        ]);
        return back()->with('success', 'Announcement posted.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return back()->with('success', 'Announcement removed.');
    }
}