<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 003 — child_profiles
 *
 * The KEY table in ECCII's architecture.  Children are PROFILES, not users —
 * they never log in.  One parent account (users row) can have many child profiles.
 *
 * Every score, verse completion, lesson progress, and badge is linked to a
 * child_profile_id, not a user_id — this is what makes per-child tracking work
 * within a shared parent login.
 *
 * Table: child_profiles
 * ──────────────────────────────────────────────
 * id            bigint PK
 * user_id       FK → users  (the parent account that owns this child)
 * name          varchar(255)   e.g. "Juan"
 * age           tinyint        used to determine age group (nursery/kids/youth)
 * grade         varchar(255) nullable  e.g. "Grade 3" — display label only
 * avatar_color  varchar(7)     hex colour for the child's avatar chip e.g. "#B8923A"
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()          // references users.id
                  ->cascadeOnDelete();     // deleting a parent account removes all their children

            $table->string('name');
            $table->tinyInteger('age')->unsigned();
            $table->string('grade')->nullable();
            $table->string('avatar_color', 7)->default('#B8923A');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_profiles');
    }
};