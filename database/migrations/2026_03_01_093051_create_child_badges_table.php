<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 015 — child_badges  (pivot table)
 *
 * Many-to-many pivot between child_profiles and badges.
 * Created when checkAndAwardBadges() determines a child qualifies for a badge.
 *
 * awarded_at records the exact moment the badge was earned — displayed on the
 * progress page and the child's badge shelf.
 *
 * ChildProfile model relationship:
 *   public function badges() {
 *       return $this->belongsToMany(Badge::class, 'child_badges')
 *                   ->withPivot('awarded_at')
 *                   ->withTimestamps();
 *   }
 *
 * A UNIQUE constraint on (child_profile_id, badge_id) ensures a child cannot
 * earn the same badge twice.  The controller skips awarding if the row exists.
 *
 * Table: child_badges
 * ──────────────────────────────────────────────
 * id                bigint PK
 * child_profile_id  FK → child_profiles
 * badge_id          FK → badges
 * awarded_at        timestamp
 * created_at / updated_at  (required by withTimestamps())
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_badges', function (Blueprint $table) {
            $table->id();

            $table->foreignId('child_profile_id')
                  ->constrained()
                  ->cascadeOnDelete();   // deleting a child removes their badges

            $table->foreignId('badge_id')
                  ->constrained()
                  ->cascadeOnDelete();   // deleting a badge type removes all awards of it

            $table->timestamp('awarded_at');

            // A child can only earn each badge once
            $table->unique(['child_profile_id', 'badge_id'], 'unique_child_badge');

            // Required because ChildProfile::badges() uses ->withTimestamps()
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_badges');
    }
};