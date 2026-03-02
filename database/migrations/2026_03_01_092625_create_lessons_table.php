<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 004 — lessons
 *
 * Core lesson content table.  Lessons are created by admins and consumed by parents
 * reading with their children.
 *
 * age_group maps to the child's age via ChildProfile::ageGroup():
 *   nursery  → age ≤ 5
 *   kids     → age 6–10
 *   youth    → age ≥ 11
 *
 * SoftDeletes (deleted_at) are used so that archiving a lesson does NOT destroy
 * historical LessonProgress or ActivitySubmission records tied to it.
 *
 * Table: lessons
 * ──────────────────────────────────────────────
 * id            bigint PK
 * created_by    FK → users (admin who wrote it)
 * title         varchar(255)
 * series        varchar(255)    e.g. "Genesis Series"
 * week_number   tinyint         lesson number within the series
 * age_group     enum(nursery, kids, youth)
 * is_published  boolean default false
 * published_at  timestamp nullable
 * deleted_at    timestamp nullable  ← soft delete
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('created_by')
                  ->constrained('users')   // explicit table name (non-standard FK name)
                  ->restrictOnDelete();    // prevent deleting an admin who has lessons

            $table->string('title');
            $table->string('series');
            $table->tinyInteger('week_number')->unsigned();
            $table->enum('age_group', ['nursery', 'kids', 'youth']);

            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->softDeletes();   // deleted_at — lesson model uses SoftDeletes trait
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};