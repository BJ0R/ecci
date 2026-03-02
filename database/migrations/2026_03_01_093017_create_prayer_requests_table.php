<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 013 — prayer_requests
 *
 * A parent submits a personal prayer request.
 *
 * Visibility:
 *   is_public = true  → visible to other parent families on the community board
 *   is_public = false → only the admin and the submitting parent can see it
 *
 * Admin response workflow:
 *   1. Admin opens PrayerRequestController@index (ordered: unanswered first)
 *   2. Admin fills in admin_response and calls PrayerRequestController@respond
 *   3. is_responded flips to true, responded_at is timestamped
 *   4. Parent sees the response on their prayer board
 *
 * Table: prayer_requests
 * ──────────────────────────────────────────────
 * id               bigint PK
 * user_id          FK → users (parent who submitted)
 * body             text
 * is_public        boolean  default false
 * is_responded     boolean  default false
 * admin_response   text nullable
 * responded_at     timestamp nullable
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prayer_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();   // deleting a parent removes their prayer requests

            $table->text('body');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_responded')->default(false);
            $table->text('admin_response')->nullable();
            $table->timestamp('responded_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prayer_requests');
    }
};