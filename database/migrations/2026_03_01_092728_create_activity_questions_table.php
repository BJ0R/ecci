<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 007 — activity_questions
 *
 * Each row is one question inside a quiz-type Activity.
 * Only created when activity.type = 'quiz'.
 *
 * choices is a JSON array of option strings:
 *   ["David", "Moses", "Paul", "Peter"]
 *
 * correct_answer is stored as a plain string matching one choice value.
 * The scoring logic in ActivityViewController@submit does:
 *   $submitted === $question->correct_answer
 *
 * points per question allows weighted scoring.
 * The sum of all question points should not exceed activities.max_score
 * (the controller does not enforce this — admin is responsible).
 *
 * Table: activity_questions
 * ──────────────────────────────────────────────
 * id              bigint PK
 * activity_id     FK → activities
 * question_text   text
 * choices         json   nullable (for open-answer questions)
 * correct_answer  varchar(255)
 * points          tinyint  default 1
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('activity_id')
                  ->constrained()
                  ->cascadeOnDelete();   // questions are useless without their activity

            $table->text('question_text');
            $table->json('choices')->nullable();        // null = open-answer, not multiple-choice
            $table->string('correct_answer');
            $table->tinyInteger('points')->unsigned()->default(1);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_questions');
    }
};