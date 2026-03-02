<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 011 — lesson_progresses
 *
 * Tracks a specific child's engagement state with a specific lesson.
 *
 * Status lifecycle (managed by LessonViewController):
 *   viewed    → lesson page was opened (auto-set via firstOrCreate on first visit)
 *   completed → parent explicitly marks the lesson done after reading
 *
 * completed_at is only set when status transitions to 'completed'.
 * This field powers "completion date" displays in the progress dashboard.
 *
 * A UNIQUE constraint on (lesson_id, child_profile_id) ensures one progress
 * record per child per lesson.  updateOrCreate in the controller is safe
 * because of this constraint.
 *
 * Table: lesson_progresses
 * ──────────────────────────────────────────────
 * id                bigint PK
 * lesson_id         FK → lessons
 * child_profile_id  FK → child_profiles
 * status            enum(viewed, completed)
 * completed_at      timestamp nullable
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_progresses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                  ->constrained()
                  ->cascadeOnDelete();    // progress is meaningless without the lesson

            $table->foreignId('child_profile_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->enum('status', ['viewed', 'completed'])->default('viewed');
            $table->timestamp('completed_at')->nullable();

            // One progress record per child per lesson
            $table->unique(['lesson_id', 'child_profile_id'], 'unique_child_lesson_progress');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_progresses');
    }
};