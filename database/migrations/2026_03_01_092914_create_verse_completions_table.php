<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 010 — verse_completions
 *
 * Created when the parent marks "✓ Juan memorized this verse".
 * Links a MemoryVerse to a ChildProfile.
 *
 * marked_by stores the parent user id (who pressed the button).
 * memorized_at is stamped at creation time.
 *
 * A UNIQUE constraint on (memory_verse_id, child_profile_id) ensures a child
 * can only be marked as memorizing a verse once.  The controller uses
 * firstOrCreate which is safe as long as this constraint exists.
 *
 * NOTE: No standard timestamps() — we use memorized_at explicitly.
 *       VerseCompletion model has $timestamps = false.
 *
 * Table: verse_completions
 * ──────────────────────────────────────────────
 * id                bigint PK
 * memory_verse_id   FK → memory_verses
 * child_profile_id  FK → child_profiles
 * marked_by         FK → users (parent)
 * memorized_at      timestamp
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verse_completions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('memory_verse_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('child_profile_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('marked_by')
                  ->constrained('users')
                  ->restrictOnDelete();

            $table->timestamp('memorized_at');

            // A child can only memorize a given verse once
            $table->unique(['memory_verse_id', 'child_profile_id'], 'unique_child_verse');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verse_completions');
    }
};