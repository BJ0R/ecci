<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ── Public / Auth routes (Breeze) ──────────────────────────────────────────────
require __DIR__.'/auth.php';

// ── Root: redirect authenticated users to their role dashboard ────────────────
Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'teacher') {
            if (! $user->is_approved) return redirect()->route('approval.pending');
            return redirect()->route('teacher.dashboard');
        }

        // parent
        if (! $user->is_approved) return redirect()->route('approval.pending');
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

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES — user management, announcements, prayer, dashboard
// ══════════════════════════════════════════════════════════════════════════════
Route::middleware(['auth', 'is.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard (bare /admin and /admin/dashboard both resolve here)
        Route::get('/',          [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('index');
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        // ── User / Family Management ──────────────────────────────────────────
        Route::get('users',                [\App\Http\Controllers\Admin\UserManagementController::class, 'index'])        ->name('users.index');
        Route::get('users/{user}',         [\App\Http\Controllers\Admin\UserManagementController::class, 'show'])         ->name('users.show');
        Route::put('users/{user}/approve', [\App\Http\Controllers\Admin\UserManagementController::class, 'approve'])      ->name('users.approve');
        Route::put('users/{user}/suspend', [\App\Http\Controllers\Admin\UserManagementController::class, 'suspend'])      ->name('users.suspend');

        // Teacher account management (admin creates teachers directly)
        Route::post  ('teachers',          [\App\Http\Controllers\Admin\UserManagementController::class, 'storeTeacher'])  ->name('teachers.store');
        Route::delete('teachers/{user}',   [\App\Http\Controllers\Admin\UserManagementController::class, 'destroyTeacher'])->name('teachers.destroy');

        // ── Announcements ─────────────────────────────────────────────────────
        Route::get   ('announcements',                [\App\Http\Controllers\Admin\AnnouncementController::class, 'index'])  ->name('announcements.index');
        Route::post  ('announcements',                [\App\Http\Controllers\Admin\AnnouncementController::class, 'store'])  ->name('announcements.store');
        Route::delete('announcements/{announcement}', [\App\Http\Controllers\Admin\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        // ── Prayer Requests ───────────────────────────────────────────────────
        Route::get('prayer',                         [\App\Http\Controllers\Admin\PrayerRequestController::class, 'index'])  ->name('prayer.index');
        Route::put('prayer/{prayerRequest}/respond', [\App\Http\Controllers\Admin\PrayerRequestController::class, 'respond'])->name('prayer.respond');

        // ── Badges (shared reference data — admin curates) ────────────────────
        Route::resource('badges', \App\Http\Controllers\Admin\BadgeController::class)->names('badges');
    });

// ══════════════════════════════════════════════════════════════════════════════
// TEACHER ROUTES — lesson/activity/verse content + progress view
// ══════════════════════════════════════════════════════════════════════════════
Route::middleware(['auth', 'is.teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {

        // Dashboard
        Route::get('/',          [\App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('index');
        Route::get('/dashboard', [\App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');

        // ── Lessons CRUD ──────────────────────────────────────────────────────
        Route::resource('lessons', \App\Http\Controllers\Teacher\LessonController::class)
            ->names('lessons');

        // ── Activities ────────────────────────────────────────────────────────
        Route::resource('activities', \App\Http\Controllers\Teacher\ActivityController::class)
            ->only(['index', 'create', 'store', 'destroy'])
            ->names('activities');

        // ── Memory Verses ─────────────────────────────────────────────────────
        Route::get   ('verses',               [\App\Http\Controllers\Teacher\MemoryVerseController::class, 'index'])  ->name('verses.index');
        Route::post  ('verses',               [\App\Http\Controllers\Teacher\MemoryVerseController::class, 'store'])  ->name('verses.store');
        Route::delete('verses/{memoryVerse}', [\App\Http\Controllers\Teacher\MemoryVerseController::class, 'destroy'])->name('verses.destroy');

        // ── Progress (view all children + individual) ─────────────────────────
        Route::get('progress',         [\App\Http\Controllers\Teacher\ProgressViewController::class, 'index'])->name('progress.index');
        Route::get('progress/{child}', [\App\Http\Controllers\Teacher\ProgressViewController::class, 'show']) ->name('progress.show');
    });

// ══════════════════════════════════════════════════════════════════════════════
// PARENT / FAMILY ROUTES — unchanged
// ══════════════════════════════════════════════════════════════════════════════
Route::middleware(['auth', 'is.parent'])
    ->name('parent.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\Parent\DashboardController::class, 'index'])
            ->name('dashboard');

        // Child Profiles
        Route::resource('children', \App\Http\Controllers\Parent\ChildProfileController::class)
            ->except(['show', 'edit'])
            ->names('children');

        // Lessons
        Route::get('lessons',          [\App\Http\Controllers\Parent\LessonViewController::class, 'index'])  ->name('lessons.index');
        Route::get('lessons/{lesson}', [\App\Http\Controllers\Parent\LessonViewController::class, 'show'])   ->name('lessons.show');
        Route::match(
            ['post', 'patch'],
            'lessons/{lesson}/complete',
            [\App\Http\Controllers\Parent\LessonViewController::class, 'complete']
        )->name('lessons.complete');

        // Activities
        Route::get ('activities/{activity}',        [\App\Http\Controllers\Parent\ActivityViewController::class, 'show'])  ->name('activities.show');
        Route::post('activities/{activity}/submit', [\App\Http\Controllers\Parent\ActivityViewController::class, 'submit'])->name('activities.submit');

        // Progress (per-child)
        Route::get('progress/{child}', [\App\Http\Controllers\Parent\ProgressController::class, 'show'])
            ->middleware('owns.profile')
            ->name('progress.show');

        // Memory Verses
        Route::get ('verses',                        [\App\Http\Controllers\Parent\VerseController::class, 'index'])      ->name('verses.index');
        Route::post('verses/{memoryVerse}/complete', [\App\Http\Controllers\Parent\VerseController::class, 'markComplete'])->name('verses.complete');

        // Prayer Requests
        Route::get ('prayer', [\App\Http\Controllers\Parent\PrayerRequestController::class, 'index'])->name('prayer.index');
        Route::post('prayer', [\App\Http\Controllers\Parent\PrayerRequestController::class, 'store'])->name('prayer.store');
    });