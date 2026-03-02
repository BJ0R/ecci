<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 006 — activities
 *
 * An activity belongs to a lesson (optional — can be standalone).
 * Three types:
 *   quiz    → has activity_questions rows; auto-scored on submit
 *   drawing → open-ended; parent describes child's drawing; no auto-score
 *   fill    → fill-in-the-blank; manually reviewed
 *
 * max_score is used by the quiz-scoring logic and badge trigger checks.
 * SoftDeletes preserve historical submission records when an activity is removed.
 * lesson_id is nullable — activities can exist independently of a lesson.
 *
 * Table: activities
 * ──────────────────────────────────────────────
 * id            bigint PK
 * lesson_id     FK → lessons  nullable
 * title         varchar(255)
 * type          enum(quiz, drawing, fill)
 * instructions  text
 * max_score     tinyint  default 10
 * deleted_at    timestamp nullable
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();    // if lesson is force-deleted, keep the activity (set null)

            $table->string('title');
            $table->enum('type', ['quiz', 'drawing', 'fill']);
            $table->text('instructions');
            $table->tinyInteger('max_score')->unsigned()->default(10);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};