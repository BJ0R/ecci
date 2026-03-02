<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 009 — memory_verses
 *
 * Posted by the admin each church week.  Families can then mark which
 * of their children have memorized it (creates a verse_completions row).
 *
 * week_number ties the verse to the current lesson series week.
 * context_note is an optional admin annotation to help parents explain
 * the verse to younger children.
 *
 * Table: memory_verses
 * ──────────────────────────────────────────────
 * id            bigint PK
 * verse_text    text          the full scripture text
 * reference     varchar(255)  e.g. "John 3:16"
 * week_number   tinyint
 * context_note  text nullable
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memory_verses', function (Blueprint $table) {
            $table->id();

            $table->text('verse_text');
            $table->string('reference');
            $table->tinyInteger('week_number')->unsigned();
            $table->text('context_note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memory_verses');
    }
};