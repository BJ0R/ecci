<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 008 — activity_submissions
 *
 * Records a child's attempt at an activity.
 * child_profile_id is the CRITICAL FK — ties the score to the specific child
 * within a family, not just the parent's account.
 *
 * submitted_by = the parent user who was logged in when submitting.
 * This is used for audit and for the "who submitted" display in admin views.
 *
 * answers is a JSON object keyed by question_id:
 *   { "12": "David", "13": "Jerusalem" }
 * For drawing/fill types, answers may be an empty object or null.
 *
 * score is auto-calculated in ActivityViewController@submit for quiz type.
 * For drawing/fill the score can be manually set later (or left 0).
 *
 * A UNIQUE constraint on (activity_id, child_profile_id) prevents a child
 * from submitting the same activity twice.  The controller also checks this
 * in code before writing, but the DB constraint is the true safety net.
 *
 * NOTE: No standard timestamps() — we use submitted_at explicitly.
 *       ActivitySubmission model has $timestamps = false.
 *
 * Table: activity_submissions
 * ──────────────────────────────────────────────
 * id                bigint PK
 * activity_id       FK → activities
 * child_profile_id  FK → child_profiles
 * submitted_by      FK → users (parent)
 * answers           json nullable
 * score             tinyint  default 0
 * submitted_at      timestamp
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_submissions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('activity_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('child_profile_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('submitted_by')
                  ->constrained('users')
                  ->restrictOnDelete();   // don't delete a parent who has submission records

            $table->json('answers')->nullable();
            $table->tinyInteger('score')->unsigned()->default(0);
            $table->timestamp('submitted_at');

            // Prevent the same child from submitting the same activity twice
            $table->unique(['activity_id', 'child_profile_id'], 'unique_child_activity');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_submissions');
    }
};