<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 001 — users, password_reset_tokens, sessions
 *
 * Standard Laravel base migration (3 tables).
 * The original file was missing password_reset_tokens and sessions —
 * sessions absence caused: SQLSTATE[42S02] Table 'eccii.sessions' doesn't exist
 *
 * sessions table is required because SESSION_DRIVER=database in .env.
 * If you prefer file-based sessions, change SESSION_DRIVER=file in .env
 * and you won't need the sessions table — but the migration won't hurt either way.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── users ──────────────────────────────────────────────────────────────
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // ── password_reset_tokens ──────────────────────────────────────────────
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // ── sessions ───────────────────────────────────────────────────────────
        // Required when SESSION_DRIVER=database (default in Laravel 11+)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};