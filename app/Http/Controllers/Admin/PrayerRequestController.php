<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrayerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrayerRequestController extends Controller
{
    public function index()
    {
        $requests = PrayerRequest::with('user')
            ->orderBy('is_responded', 'asc')
            ->latest()->paginate(20);

        return Inertia::render('Admin/Prayer/Index', ['prayerRequests' => $requests]);
    }

    public function respond(Request $request, PrayerRequest $prayerRequest)
    {
        $request->validate(['admin_response' => 'required|string|max:1000']);

        $prayerRequest->update([
            'admin_response' => $request->admin_response,
            'is_responded'   => true,
            'responded_at'   => now(),
        ]);

        return back()->with('success', 'Response saved.');
    }
}