<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ── Public / Auth routes (Breeze) ──────────────────────────────────────────────
require __DIR__.'/auth.php';

// ── Root: redirect authenticated users to their dashboard ─────────────────────
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        if (! $user->is_approved) {
            return redirect()->route('approval.pending');
        }
        return redirect()->route('parent.dashboard');
    }
    return redirect()->route('login');
});

// ── Approval pending page ──────────────────────────────────────────────────────
Route::get('/pending-approval', fn () => Inertia::render('Auth/PendingApproval'))
    ->middleware('auth')
    ->name('approval.pending');

// ── Profile (Breeze default) ───────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get   ('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])   ->name('profile.edit');
    Route::patch ('/profile', [\App\Http\Controllers\ProfileController::class, 'update']) ->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ── Admin routes ───────────────────────────────────────────────────────────────
Route::middleware(['auth', 'is.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // ── FIX: /admin (bare) and /admin/dashboard both resolve to the dashboard ──
        // The AdminLayout sidebar links to '/admin', so we need both routes pointing
        // at the same controller action.
        Route::get('/',          [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('index');      // admin.index → /admin
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard');  // admin.dashboard → /admin/dashboard

        // Lessons CRUD
        Route::resource('lessons', \App\Http\Controllers\Admin\LessonController::class)
            ->names('lessons');
        // admin.lessons.index, .create, .store, .show, .edit, .update, .destroy

        // Activities (create / store / destroy only — no edit/update)
        Route::resource('activities', \App\Http\Controllers\Admin\ActivityController::class)
            ->only(['index', 'create', 'store', 'destroy'])
            ->names('activities');

        // Memory Verses
        Route::get   ('verses',               [\App\Http\Controllers\Admin\MemoryVerseController::class, 'index'])  ->name('verses.index');
        Route::post  ('verses',               [\App\Http\Controllers\Admin\MemoryVerseController::class, 'store'])  ->name('verses.store');
        Route::delete('verses/{memoryVerse}', [\App\Http\Controllers\Admin\MemoryVerseController::class, 'destroy'])->name('verses.destroy');

        // Announcements
        Route::get   ('announcements',                   [\App\Http\Controllers\Admin\AnnouncementController::class, 'index'])  ->name('announcements.index');
        Route::post  ('announcements',                   [\App\Http\Controllers\Admin\AnnouncementController::class, 'store'])  ->name('announcements.store');
        Route::delete('announcements/{announcement}',    [\App\Http\Controllers\Admin\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        // User / Family Management
        Route::get('users',                [\App\Http\Controllers\Admin\UserManagementController::class, 'index'])  ->name('users.index');
        Route::get('users/{user}',         [\App\Http\Controllers\Admin\UserManagementController::class, 'show'])   ->name('users.show');
        Route::put('users/{user}/approve', [\App\Http\Controllers\Admin\UserManagementController::class, 'approve'])->name('users.approve');
        Route::put('users/{user}/suspend', [\App\Http\Controllers\Admin\UserManagementController::class, 'suspend'])->name('users.suspend');

        // Progress overview (all children across all families)
        Route::get('progress',         [\App\Http\Controllers\Admin\ProgressViewController::class, 'index'])->name('progress.index');
        Route::get('progress/{child}', [\App\Http\Controllers\Admin\ProgressViewController::class, 'show']) ->name('progress.show');

        // Prayer Requests
        Route::get('prayer',                          [\App\Http\Controllers\Admin\PrayerRequestController::class, 'index'])  ->name('prayer.index');
        Route::put('prayer/{prayerRequest}/respond',  [\App\Http\Controllers\Admin\PrayerRequestController::class, 'respond'])->name('prayer.respond');

        // Badges
        Route::resource('badges', \App\Http\Controllers\Admin\BadgeController::class)
            ->names('badges');
    });

// ── Parent / Family routes ─────────────────────────────────────────────────────
Route::middleware(['auth', 'is.parent'])
    ->name('parent.')
    ->group(function () {

        // Dashboard → /dashboard
        Route::get('/dashboard', [\App\Http\Controllers\Parent\DashboardController::class, 'index'])
            ->name('dashboard'); // parent.dashboard

        // Child Profiles
        Route::resource('children', \App\Http\Controllers\Parent\ChildProfileController::class)
            ->except(['show', 'edit'])
            ->names('children');

        // ── Lessons ────────────────────────────────────────────────────────────
        Route::get('lessons',          [\App\Http\Controllers\Parent\LessonViewController::class, 'index'])   ->name('lessons.index');
        Route::get('lessons/{lesson}', [\App\Http\Controllers\Parent\LessonViewController::class, 'show'])    ->name('lessons.show');

        // FIX: was Route::patch — the Lesson Show page calls router.post(), not router.patch().
        // Route::match(['post','patch'], ...) accepts both so it works regardless of which
        // HTTP verb the frontend uses. The controller action doesn't care about the verb.
        Route::match(
            ['post', 'patch'],
            'lessons/{lesson}/complete',
            [\App\Http\Controllers\Parent\LessonViewController::class, 'complete']
        )->name('lessons.complete');

        // Activities
        Route::get ('activities/{activity}',         [\App\Http\Controllers\Parent\ActivityViewController::class, 'show'])  ->name('activities.show');
        Route::post('activities/{activity}/submit',  [\App\Http\Controllers\Parent\ActivityViewController::class, 'submit'])->name('activities.submit');

        // Progress (per-child — enforces ownership via middleware)
        Route::get('progress/{child}', [\App\Http\Controllers\Parent\ProgressController::class, 'show'])
            ->middleware('owns.profile')
            ->name('progress.show');

        // Memory Verses
        Route::get ('verses',                       [\App\Http\Controllers\Parent\VerseController::class, 'index'])       ->name('verses.index');
        Route::post('verses/{memoryVerse}/complete', [\App\Http\Controllers\Parent\VerseController::class, 'markComplete'])->name('verses.complete');

        // Prayer Requests
        Route::get ('prayer', [\App\Http\Controllers\Parent\PrayerRequestController::class, 'index'])->name('prayer.index');
        Route::post('prayer', [\App\Http\Controllers\Parent\PrayerRequestController::class, 'store'])->name('prayer.store');
    });