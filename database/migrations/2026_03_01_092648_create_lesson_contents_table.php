<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 005 — lesson_contents
 *
 * Stores the rich biblical content for each lesson.  Separated from the lessons
 * table so the lesson list/index queries remain lightweight (no large text fields
 * fetched unless the parent actually opens a lesson).
 *
 * One-to-one with lessons (lesson_id is unique).
 * The admin creates this together with the Lesson in LessonController@store.
 *
 * reflection_questions is a JSON array of discussion-prompt objects:
 *   [{"question": "What did David use to defeat Goliath?"}, ...]
 *
 * Table: lesson_contents
 * ──────────────────────────────────────────────
 * id                    bigint PK
 * lesson_id             FK → lessons  (unique — one content per lesson)
 * bible_reference       varchar(255)   e.g. "1 Samuel 17:45–50"
 * bible_text            longtext       the full scripture passage
 * explanation           longtext       age-appropriate explanation
 * reflection_questions  json           array of question objects
 * prayer                text           closing family prayer
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_contents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                  ->unique()               // one content block per lesson
                  ->constrained()
                  ->cascadeOnDelete();     // delete content when lesson is force-deleted

            $table->string('bible_reference');
            $table->longText('bible_text');
            $table->longText('explanation');
            $table->json('reflection_questions')->nullable();
            $table->text('prayer');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_contents');
    }
};