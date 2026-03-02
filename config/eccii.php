<?php

/*
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  config/eccii.php — ECCII Application Configuration                    │
 * │                                                                         │
 * │  Single source of truth for all ECCII-specific settings.               │
 * │  Referenced by: controllers, models, seeders, Inertia shared props.    │
 * │                                                                         │
 * │  Usage: config('eccii.age_groups')                                     │
 * │         config('eccii.pagination.lessons')                             │
 * │         config('eccii.registration.requires_approval')                 │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

return [

    /*
    |──────────────────────────────────────────────────────────────────────────
    |  APP META
    |  Shown in the sidebar logo, email footers, and browser tab.
    |──────────────────────────────────────────────────────────────────────────
    */
    'app_name'    => env('ECCII_APP_NAME',    'ECCII'),
    'church_name' => env('ECCII_CHURCH_NAME', 'Evangelical Church'),
    'tagline'     => env('ECCII_TAGLINE',     'Raising godly children together'),


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  USER ROLES
    |  Stored in users.role column (string enum).
    |──────────────────────────────────────────────────────────────────────────
    */
    'roles' => [
        'admin'  => 'admin',    // Pastor / Church Teacher
        'parent' => 'parent',   // Family account
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  REGISTRATION
    |  Controls the family registration and approval workflow.
    |──────────────────────────────────────────────────────────────────────────
    */
    'registration' => [
        // New parent accounts are locked until an admin approves them.
        'requires_approval'   => true,

        // Admin accounts are pre-seeded and always auto-approved.
        'auto_approve_admins' => true,

        // Default role assigned on register (parents only; admins are seeded).
        'default_role'        => 'parent',

        // Redirect unapproved parents to this route after login.
        'pending_route'       => 'pending',
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  AGE GROUPS
    |  Maps child age brackets to the lesson `age_group` slug column.
    |  The ChildProfile::ageGroup() model method uses these boundaries.
    |
    |  Fields:
    |    slug        — value stored in lessons.age_group
    |    label       — display label in UI
    |    description — short age range string for UI hints
    |    min_age     — inclusive lower bound
    |    max_age     — inclusive upper bound (null = no upper limit)
    |    color_token — CSS variable (without --) for UI badge coloring
    |    bg_token    — CSS variable for badge background
    |──────────────────────────────────────────────────────────────────────────
    */
    'age_groups' => [
        [
            'slug'        => 'nursery',
            'label'       => 'Nursery',
            'description' => 'Ages 3–5',
            'min_age'     => 3,
            'max_age'     => 5,
            'color_token' => 'amber',
            'bg_token'    => 'amber-pale',
            'hex'         => '#C06A1A',
        ],
        [
            'slug'        => 'kids',
            'label'       => 'Kids',
            'description' => 'Ages 6–10',
            'min_age'     => 6,
            'max_age'     => 10,
            'color_token' => 'sky',
            'bg_token'    => 'sky-pale',
            'hex'         => '#2B5F82',
        ],
        [
            'slug'        => 'youth',
            'label'       => 'Youth',
            'description' => 'Ages 11+',
            'min_age'     => 11,
            'max_age'     => null,
            'color_token' => 'sage',
            'bg_token'    => 'sage-pale',
            'hex'         => '#3E6B52',
        ],
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  LESSON STATUS
    |  Stored in lesson_progresses.status column.
    |──────────────────────────────────────────────────────────────────────────
    */
    'lesson_statuses' => [
        'viewed'    => 'viewed',      // lesson opened (auto-set on Show)
        'completed' => 'completed',   // parent explicitly marked complete
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  ACTIVITY TYPES
    |  Stored in activities.type column.
    |  auto_scored: true = system calculates score from correct_answer
    |               false = admin/teacher manually scores (drawing, fill)
    |──────────────────────────────────────────────────────────────────────────
    */
    'activity_types' => [
        'quiz'    => ['label' => 'Quiz',              'icon' => '📝', 'auto_scored' => true  ],
        'fill'    => ['label' => 'Fill in the Blank',  'icon' => '✏️', 'auto_scored' => false ],
        'drawing' => ['label' => 'Drawing',            'icon' => '🎨', 'auto_scored' => false ],
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  BADGE TRIGGER TYPES
    |  Referenced in badges.trigger_rule (JSON column).
    |  Example rule: { "type": "lesson_count", "threshold": 5 }
    |  BadgeController and the BadgeAwarder service use these keys.
    |──────────────────────────────────────────────────────────────────────────
    */
    'badge_triggers' => [
        'first_lesson'  => 'Complete your first lesson',
        'lesson_count'  => 'Complete N lessons',
        'quiz_count'    => 'Complete N quizzes',
        'perfect_score' => 'Score 100% on any quiz',
        'verse_count'   => 'Memorise N verses',
        'streak'        => 'Complete lessons N weeks in a row',
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  AVATAR COLOURS
    |  Used in ChildProfileController and the React colour picker.
    |  Matches ECCII design token palette exactly.
    |──────────────────────────────────────────────────────────────────────────
    */
    'avatar_colors' => [
        ['hex' => '#B8923A', 'name' => 'Gold',   'token' => 'gold'  ],
        ['hex' => '#3E6B52', 'name' => 'Sage',   'token' => 'sage'  ],
        ['hex' => '#2B5F82', 'name' => 'Sky',    'token' => 'sky'   ],
        ['hex' => '#B84848', 'name' => 'Rose',   'token' => 'rose'  ],
        ['hex' => '#C06A1A', 'name' => 'Amber',  'token' => 'amber' ],
        ['hex' => '#6B5EA8', 'name' => 'Violet', 'token' => 'violet'],
        ['hex' => '#2E8B8B', 'name' => 'Teal',   'token' => 'teal'  ],
        ['hex' => '#7D6B52', 'name' => 'Walnut', 'token' => 'walnut'],
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  GRADE OPTIONS
    |  Shown in the Children/Create and Children/Index edit form.
    |  Stored as a string in child_profiles.grade.
    |──────────────────────────────────────────────────────────────────────────
    */
    'grades' => [
        'Pre-K',
        'Kindergarten',
        'Grade 1', 'Grade 2', 'Grade 3',
        'Grade 4', 'Grade 5', 'Grade 6',
        'Grade 7', 'Grade 8', 'Grade 9',
        'Grade 10', 'Grade 11', 'Grade 12',
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  PAGINATION
    |  Default page sizes for each admin list view.
    |  Override per-controller if needed.
    |──────────────────────────────────────────────────────────────────────────
    */
    'pagination' => [
        'lessons'       => 15,
        'activities'    => 15,
        'families'      => 20,
        'verses'        => 20,
        'announcements' => 20,
        'prayer'        => 20,
        'progress'      => 24,  // children grid on admin progress page
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  DASHBOARD LIMITS
    |  How many items to load on each dashboard section.
    |──────────────────────────────────────────────────────────────────────────
    */
    'dashboard' => [
        'recent_lessons'     => 5,   // Parent dashboard recent lessons
        'recent_families'    => 5,   // Admin dashboard recent families
        'recent_submissions' => 8,   // Admin dashboard recent quiz submissions
        'announcements'      => 3,   // Parent dashboard pinned + latest
        'public_prayer'      => 10,  // Parent prayer community board
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  MEMORY VERSE SCHEDULE
    |  Used in the verse week_number selector validation.
    |──────────────────────────────────────────────────────────────────────────
    */
    'verse_schedule' => [
        'weeks_per_term' => 12,
        'terms_per_year' =>  4,
        'max_week'       => 52,  // upper bound for week_number validation
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  INERTIA SHARED PROPS
    |  Keys shared globally via HandleInertiaRequests middleware.
    |  See app/Http/Middleware/HandleInertiaRequests.php → share().
    |──────────────────────────────────────────────────────────────────────────
    */
    'shared_props' => [
        /*
         * For parent users, always share:
         *   children    — ChildProfile[] for the sidebar profile switcher
         *   activeChild — resolved from ?child_id or first child
         *   flash       — session flash messages (success / error)
         *
         * For admin users:
         *   flash       — session flash messages
         *   pendingCount— count of unapproved families for sidebar badge
         */
        'auth_user_fields' => [
            'id', 'name', 'email', 'family_name', 'role', 'is_approved',
        ],
    ],


    /*
    |──────────────────────────────────────────────────────────────────────────
    |  DESIGN TOKENS  (PHP-side mirror of eccii-tokens.css)
    |  Useful for server-rendered emails, PDFs, or OG image generation.
    |  Canonical values live in resources/css/eccii-tokens.css.
    |──────────────────────────────────────────────────────────────────────────
    */
    'colors' => [
        'ink'         => '#0D0D0D',
        'cream'       => '#FAF7F2',
        'cream_2'     => '#F2EDE4',
        'cream_3'     => '#E8E1D6',
        'gold'        => '#B8923A',
        'gold_lt'     => '#D4AE60',
        'gold_pale'   => '#FDF6E8',
        'sage'        => '#3E6B52',
        'sage_lt'     => '#6A9E7F',
        'sage_pale'   => '#EAF3EC',
        'sky'         => '#2B5F82',
        'sky_lt'      => '#5D90B3',
        'sky_pale'    => '#E6F1F8',
        'rose'        => '#B84848',
        'rose_pale'   => '#FAEAEA',
        'amber'       => '#C06A1A',
        'amber_pale'  => '#FEF3E2',
        'white'       => '#FFFFFF',
        'border'      => '#DDD7CC',
        'border_lt'   => '#EDE8E1',
    ],

];