<?php

/*
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  routes/auth.php — ECCII                                                │
 * │                                                                         │
 * │  Standard Laravel Breeze auth scaffold with ECCII additions:           │
 * │                                                                         │
 * │  Registration flow:                                                     │
 * │    1. Family registers with name, email, password + family_name        │
 * │    2. Account created with role = 'parent', is_approved = false        │
 * │    3. Admin must approve before parent can access /dashboard           │
 * │    4. IsParent middleware aborts 403 for unapproved accounts           │
 * │                                                                         │
 * │  Admin accounts:                                                        │
 * │    - Seeded via AdminUserSeeder (never self-registered)                 │
 * │    - role = 'admin', is_approved = true                                │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;


/*
|──────────────────────────────────────────────────────────────────────────────
|  GUEST-ONLY ROUTES
|  Redirect to /dashboard or /admin if already authenticated.
|──────────────────────────────────────────────────────────────────────────────
*/
Route::middleware('guest')->group(function () {

    /*─── Family Registration ──────────────────────────────────────────────*/
    // RegisteredUserController is extended to:
    //   • Capture  family_name (stored on users table)
    //   • Set      role        = 'parent'
    //   • Set      is_approved = false  (admin must approve before access)
    Route::get ('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    /*─── Login ────────────────────────────────────────────────────────────*/
    // Unapproved parents are caught by IsParent middleware after redirect.
    // A pending-approval page at /pending is shown if is_approved = false.
    Route::get ('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    /*─── Password Reset ───────────────────────────────────────────────────*/
    Route::get ('forgot-password',        [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password',        [PasswordResetLinkController::class, 'store']) ->name('password.email');
    Route::get ('reset-password/{token}', [NewPasswordController::class, 'create'])      ->name('password.reset');
    Route::post('reset-password',         [NewPasswordController::class, 'store'])       ->name('password.store');
});


/*
|──────────────────────────────────────────────────────────────────────────────
|  AUTHENTICATED ROUTES
|──────────────────────────────────────────────────────────────────────────────
*/
Route::middleware('auth')->group(function () {

    /*─── Pending approval page ────────────────────────────────────────────*/
    // Parents whose accounts are not yet approved land here.
    // This route does NOT have is.parent middleware — that would create a loop.
    Route::get('/pending', function () {
        if (auth()->user()->role === 'admin' || auth()->user()->is_approved) {
            return redirect()->route('dashboard');
        }
        return inertia('Auth/PendingApproval', [
            'familyName' => auth()->user()->family_name,
        ]);
    })->name('pending');

    /*─── Email Verification ───────────────────────────────────────────────*/
    Route::get   ('verify-email',              [EmailVerificationPromptController::class,       '__invoke'])
        ->name('verification.notice');
    Route::get   ('verify-email/{id}/{hash}',  [VerifyEmailController::class,                    '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post  ('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    /*─── Confirm Password ─────────────────────────────────────────────────*/
    Route::get ('confirm-password', [ConfirmablePasswordController::class, 'show'])  ->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    /*─── Update Password ──────────────────────────────────────────────────*/
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    /*─── Logout ───────────────────────────────────────────────────────────*/
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});