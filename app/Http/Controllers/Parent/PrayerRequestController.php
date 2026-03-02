<?php
namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrayerRequest;
use App\Models\PrayerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrayerRequestController extends Controller
{
    public function index(Request $request)
    {
        $myRequests = PrayerRequest::where('user_id', $request->user()->id)
            ->latest()->get();
        $publicRequests = PrayerRequest::where('is_public', true)
            ->where('user_id', '!=', $request->user()->id)
            ->latest()->take(10)->get();

        return Inertia::render('Parent/Prayer/Index', compact('myRequests', 'publicRequests'));
    }

    public function store(StorePrayerRequest $request)
    {
        PrayerRequest::create([
            'user_id'   => $request->user()->id,
            'body'      => $request->body,
            'is_public' => $request->boolean('is_public'),
        ]);
        return back()->with('success', 'Prayer request submitted. God bless you.');
    }
}