<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration 002 — add ECCII-specific columns to users
 *
 * Added columns:
 *   role        — enum: 'admin' | 'parent'  (default 'parent')
 *                 Admins are pastors / teachers who manage content.
 *                 Parents are family accounts who consume content.
 *
 *   family_name — nullable string.  Displayed in the sidebar and admin views.
 *                 e.g. "Santos Family"
 *
 *   is_approved — boolean, default false.
 *                 New parent registrations start as un-approved.
 *                 Admin must approve before the parent can log in.
 *                 Enforced by IsParent middleware.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Place after 'email' for logical column ordering in the DB
            $table->enum('role', ['admin', 'parent'])
                  ->default('parent')
                  ->after('email');

            $table->string('family_name')
                  ->nullable()
                  ->after('role');

            $table->boolean('is_approved')
                  ->default(false)
                  ->after('family_name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'family_name', 'is_approved']);
        });
    }
};