<?php
// database/migrations/2026_03_08_000001_add_teacher_role_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Expand the role enum to include 'teacher'.
 *
 * MySQL requires re-declaring the full ENUM list when adding a value.
 * The Schema builder does not support ALTER COLUMN on enums natively,
 * so we use a raw DB statement.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Raw ALTER so MySQL rewrites the ENUM without data loss
        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role ENUM('admin', 'teacher', 'parent')
            NOT NULL DEFAULT 'parent'
        ");
    }

    public function down(): void
    {
        // Revert: any teacher rows become 'parent' first to avoid constraint error
        DB::statement("UPDATE users SET role = 'parent' WHERE role = 'teacher'");
        DB::statement("
            ALTER TABLE users
            MODIFY COLUMN role ENUM('admin', 'parent')
            NOT NULL DEFAULT 'parent'
        ");
    }
};