<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 012 — announcements
 *
 * Posted by the admin (pastor / teacher) to inform all parent families.
 * Displayed on the parent dashboard in pinned-first, newest-first order.
 *
 * posted_by — FK to the admin user who wrote the announcement.
 *             restrictOnDelete prevents deleting an admin who has announcements.
 *
 * pinned — when true, the announcement floats to the top of the list
 *          regardless of created_at.  Used for urgent notices.
 *
 * Table: announcements
 * ──────────────────────────────────────────────
 * id         bigint PK
 * posted_by  FK → users (admin)
 * title      varchar(255)
 * body       text
 * pinned     boolean  default false
 * timestamps
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('posted_by')
                  ->constrained('users')
                  ->restrictOnDelete();

            $table->string('title');
            $table->text('body');
            $table->boolean('pinned')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};