<?php
// database/seeders/SampleProgressSeeder.php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ActivitySubmission;
use App\Models\Badge;
use App\Models\ChildProfile;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\MemoryVerse;
use App\Models\PrayerRequest;
use App\Models\User;
use App\Models\VerseCompletion;
use Illuminate\Database\Seeder;

/**
 * Seeds realistic interaction data:
 *  — Lesson progress (viewed / completed) for various children
 *  — Activity submissions with scored quiz answers
 *  — Memory verse completions
 *  — Prayer requests
 *  — Badge awards
 *
 * Children's age groups (from ChildProfile::ageGroup()):
 *  Liam     (9)  → kids
 *  Sofia    (4)  → nursery
 *  Miguel   (13) → youth
 *  Isabella (7)  → kids
 *  Gabriel  (15) → youth
 *  Hana     (8)  → kids
 *  Ellie    (3)  → nursery
 */
class SampleProgressSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedLessonProgress();
        $this->seedActivitySubmissions();
        $this->seedVerseCompletions();
        $this->seedPrayerRequests();
        $this->seedBadges();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LESSON PROGRESS
    // ─────────────────────────────────────────────────────────────────────────

    private function seedLessonProgress(): void
    {
        // Liam (kids) — completed weeks 1–3, viewed week 4
        $liam = ChildProfile::where('name', 'Liam')->first();
        foreach (Lesson::where('age_group', 'kids')->orderBy('week_number')->take(3)->get() as $i => $lesson) {
            LessonProgress::create([
                'lesson_id'        => $lesson->id,
                'child_profile_id' => $liam->id,
                'status'           => 'completed',
                'completed_at'     => now()->subDays(14 - ($i * 3)),
            ]);
        }
        $lessonW4Kids = Lesson::where('age_group', 'kids')->where('week_number', 4)->first();
        if ($lessonW4Kids) {
            LessonProgress::create([
                'lesson_id'        => $lessonW4Kids->id,
                'child_profile_id' => $liam->id,
                'status'           => 'viewed',
                'completed_at'     => null,
            ]);
        }

        // Sofia (nursery) — completed weeks 1–2, viewed week 3
        $sofia = ChildProfile::where('name', 'Sofia')->first();
        foreach (Lesson::where('age_group', 'nursery')->orderBy('week_number')->take(2)->get() as $i => $lesson) {
            LessonProgress::create([
                'lesson_id'        => $lesson->id,
                'child_profile_id' => $sofia->id,
                'status'           => 'completed',
                'completed_at'     => now()->subDays(10 - ($i * 3)),
            ]);
        }
        $nurseryW3 = Lesson::where('age_group', 'nursery')->where('week_number', 3)->first();
        if ($nurseryW3) {
            LessonProgress::create([
                'lesson_id'        => $nurseryW3->id,
                'child_profile_id' => $sofia->id,
                'status'           => 'viewed',
                'completed_at'     => null,
            ]);
        }

        // Miguel (youth) — completed weeks 1–4
        $miguel = ChildProfile::where('name', 'Miguel')->first();
        foreach (Lesson::where('age_group', 'youth')->orderBy('week_number')->take(4)->get() as $i => $lesson) {
            LessonProgress::create([
                'lesson_id'        => $lesson->id,
                'child_profile_id' => $miguel->id,
                'status'           => 'completed',
                'completed_at'     => now()->subDays(18 - ($i * 3)),
            ]);
        }

        // Isabella (kids) — completed weeks 1–2
        $isabella = ChildProfile::where('name', 'Isabella')->first();
        foreach (Lesson::where('age_group', 'kids')->orderBy('week_number')->take(2)->get() as $i => $lesson) {
            LessonProgress::create([
                'lesson_id'        => $lesson->id,
                'child_profile_id' => $isabella->id,
                'status'           => 'completed',
                'completed_at'     => now()->subDays(8 - ($i * 3)),
            ]);
        }

        // Gabriel (youth) — completed weeks 1–5
        $gabriel = ChildProfile::where('name', 'Gabriel')->first();
        foreach (Lesson::where('age_group', 'youth')->orderBy('week_number')->take(5)->get() as $i => $lesson) {
            LessonProgress::create([
                'lesson_id'        => $lesson->id,
                'child_profile_id' => $gabriel->id,
                'status'           => 'completed',
                'completed_at'     => now()->subDays(22 - ($i * 3)),
            ]);
        }

        // Hana (kids) — viewed week 1 only
        $hana = ChildProfile::where('name', 'Hana')->first();
        $kidsW1 = Lesson::where('age_group', 'kids')->where('week_number', 1)->first();
        if ($kidsW1) {
            LessonProgress::create([
                'lesson_id'        => $kidsW1->id,
                'child_profile_id' => $hana->id,
                'status'           => 'viewed',
                'completed_at'     => null,
            ]);
        }

        // Ellie (nursery) — viewed week 1
        $ellie = ChildProfile::where('name', 'Ellie')->first();
        $nurseryW1 = Lesson::where('age_group', 'nursery')->where('week_number', 1)->first();
        if ($nurseryW1) {
            LessonProgress::create([
                'lesson_id'        => $nurseryW1->id,
                'child_profile_id' => $ellie->id,
                'status'           => 'viewed',
                'completed_at'     => null,
            ]);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ACTIVITY SUBMISSIONS
    // ─────────────────────────────────────────────────────────────────────────

    private function seedActivitySubmissions(): void
    {
        $reyes  = User::where('email', 'maria@family.test')->first();
        $cruz   = User::where('email', 'roberto@family.test')->first();
        $dela   = User::where('email', 'ana@family.test')->first();

        $liam    = ChildProfile::where('name', 'Liam')->first();
        $miguel  = ChildProfile::where('name', 'Miguel')->first();
        $gabriel = ChildProfile::where('name', 'Gabriel')->first();
        $hana    = ChildProfile::where('name', 'Hana')->first();

        // ── Liam: submitted all 3 completed lessons' quizzes ─────────────────
        $liamKidsLessons = Lesson::where('age_group', 'kids')->orderBy('week_number')->take(3)->get();
        foreach ($liamKidsLessons as $lesson) {
            $quiz = $lesson->activities()->where('type', 'quiz')->first();
            if (! $quiz) continue;

            $quiz->load('questions');
            $answers = [];
            $score   = 0;
            foreach ($quiz->questions as $q) {
                // Liam gets ~80% right — wrong on last question
                $isLast = $quiz->questions->last()->id === $q->id;
                $chosen = $isLast
                    ? ($q->choices[1] ?? $q->correct_answer)  // deliberately wrong
                    : $q->correct_answer;

                if ($chosen === $q->correct_answer) $score += $q->points;
                $answers[$q->id] = $chosen;
            }

            ActivitySubmission::create([
                'activity_id'      => $quiz->id,
                'child_profile_id' => $liam->id,
                'submitted_by'     => $reyes->id,
                'answers'          => $answers,
                'score'            => $score,
                'submitted_at'     => now()->subDays(rand(3, 15)),
            ]);
        }

        // ── Miguel: perfect scores on weeks 1–2, good on weeks 3–4 ────────────
        $miguelYouthLessons = Lesson::where('age_group', 'youth')->orderBy('week_number')->take(4)->get();
        foreach ($miguelYouthLessons as $i => $lesson) {
            $quiz = $lesson->activities()->where('type', 'quiz')->first();
            if (! $quiz) continue;

            $quiz->load('questions');
            $answers = [];
            $score   = 0;
            foreach ($quiz->questions as $q) {
                // Perfect on first 2 weeks, small mistake on weeks 3-4
                $isLast  = $quiz->questions->last()->id === $q->id;
                $isPerfect = $i < 2;
                $chosen  = ($isPerfect || ! $isLast)
                    ? $q->correct_answer
                    : ($q->choices[2] ?? $q->correct_answer);

                if ($chosen === $q->correct_answer) $score += $q->points;
                $answers[$q->id] = $chosen;
            }

            ActivitySubmission::create([
                'activity_id'      => $quiz->id,
                'child_profile_id' => $miguel->id,
                'submitted_by'     => $cruz->id,
                'answers'          => $answers,
                'score'            => $score,
                'submitted_at'     => now()->subDays(rand(4, 20)),
            ]);
        }

        // ── Gabriel: perfect scores on all 5 completed lessons ────────────────
        $gabrielYouthLessons = Lesson::where('age_group', 'youth')->orderBy('week_number')->take(5)->get();
        foreach ($gabrielYouthLessons as $lesson) {
            $quiz = $lesson->activities()->where('type', 'quiz')->first();
            if (! $quiz) continue;

            $quiz->load('questions');
            $answers = [];
            $score   = 0;
            foreach ($quiz->questions as $q) {
                $answers[$q->id] = $q->correct_answer;
                $score += $q->points;
            }

            ActivitySubmission::create([
                'activity_id'      => $quiz->id,
                'child_profile_id' => $gabriel->id,
                'submitted_by'     => $dela->id,
                'answers'          => $answers,
                'score'            => $score,
                'submitted_at'     => now()->subDays(rand(2, 22)),
            ]);

            // Gabriel also submitted fill-in activities
            $fill = $lesson->activities()->where('type', 'fill')->first();
            if ($fill) {
                ActivitySubmission::create([
                    'activity_id'      => $fill->id,
                    'child_profile_id' => $gabriel->id,
                    'submitted_by'     => $dela->id,
                    'answers'          => ['fill' => 'Gabriel\'s thoughtful written response for this lesson.'],
                    'score'            => 0,  // fill-ins are not auto-scored
                    'submitted_at'     => now()->subDays(rand(2, 22)),
                ]);
            }
        }

        // ── Hana: one fill-in submission ──────────────────────────────────────
        $hanaLesson = Lesson::where('age_group', 'kids')->where('week_number', 1)->first();
        if ($hanaLesson) {
            $fill = $hanaLesson->activities()->where('type', 'fill')->first();
            if ($fill) {
                ActivitySubmission::create([
                    'activity_id'      => $fill->id,
                    'child_profile_id' => $hana->id,
                    'submitted_by'     => $dela->id,
                    'answers'          => ['fill' => 'My giant is being nervous at school, and I can face it because God is with me.'],
                    'score'            => 0,
                    'submitted_at'     => now()->subDays(3),
                ]);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  VERSE COMPLETIONS
    // ─────────────────────────────────────────────────────────────────────────

    private function seedVerseCompletions(): void
    {
        $reyes = User::where('email', 'maria@family.test')->first();
        $dela  = User::where('email', 'ana@family.test')->first();

        $liam    = ChildProfile::where('name', 'Liam')->first();
        $gabriel = ChildProfile::where('name', 'Gabriel')->first();
        $hana    = ChildProfile::where('name', 'Hana')->first();

        // Liam memorised weeks 1–3
        $verseIds = MemoryVerse::orderBy('week_number')->take(3)->pluck('id');
        foreach ($verseIds as $verseId) {
            VerseCompletion::create([
                'memory_verse_id'  => $verseId,
                'child_profile_id' => $liam->id,
                'marked_by'        => $reyes->id,
                'memorized_at'     => now()->subDays(rand(3, 20)),
            ]);
        }

        // Gabriel memorised weeks 1–5 (high achiever)
        $gabrielVerseIds = MemoryVerse::orderBy('week_number')->take(5)->pluck('id');
        foreach ($gabrielVerseIds as $verseId) {
            VerseCompletion::create([
                'memory_verse_id'  => $verseId,
                'child_profile_id' => $gabriel->id,
                'marked_by'        => $dela->id,
                'memorized_at'     => now()->subDays(rand(2, 25)),
            ]);
        }

        // Hana memorised week 1
        $verseW1 = MemoryVerse::where('week_number', 1)->first();
        if ($verseW1) {
            VerseCompletion::create([
                'memory_verse_id'  => $verseW1->id,
                'child_profile_id' => $hana->id,
                'marked_by'        => $dela->id,
                'memorized_at'     => now()->subDays(5),
            ]);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  PRAYER REQUESTS
    // ─────────────────────────────────────────────────────────────────────────

    private function seedPrayerRequests(): void
    {
        $admin  = User::where('role', 'admin')->first();
        $maria  = User::where('email', 'maria@family.test')->first();
        $roberto= User::where('email', 'roberto@family.test')->first();
        $ana    = User::where('email', 'ana@family.test')->first();

        // Public, already answered
        PrayerRequest::create([
            'user_id'       => $maria->id,
            'body'          => 'Please pray for our family as we go through a difficult time financially. We trust God will provide, but it has been hard on our children.',
            'is_public'     => true,
            'is_responded'  => true,
            'admin_response'=> "Dear Maria, our whole church family is praying with you. God is Jehovah Jireh — our Provider. Please don't hesitate to reach out if there is a practical way we can help as a church. — Pastor Jose",
            'responded_at'  => now()->subDays(5),
        ]);

        // Public, unanswered
        PrayerRequest::create([
            'user_id'      => $roberto->id,
            'body'         => 'Please pray for Miguel who is struggling with anxiety about his upcoming exams. Pray for peace and focus, and that he would experience God\'s presence during this stressful time.',
            'is_public'    => true,
            'is_responded' => false,
        ]);

        // Private, answered
        PrayerRequest::create([
            'user_id'       => $ana->id,
            'body'          => 'I have a private prayer request regarding a family matter I am not comfortable sharing publicly. Please pray for wisdom and unity in our home.',
            'is_public'     => false,
            'is_responded'  => true,
            'admin_response'=> "Ana, I am praying for you and your family. God's wisdom is available to you abundantly (James 1:5). Let us schedule a time to talk this week. — Pastor Jose",
            'responded_at'  => now()->subDays(2),
        ]);

        // Public, unanswered — new
        PrayerRequest::create([
            'user_id'      => $maria->id,
            'body'         => 'Praise report: Sofia memorised her first Bible verse this week — Genesis 1:1! We are so proud. Please join us in thanking God for her progress in the program.',
            'is_public'    => true,
            'is_responded' => false,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  BADGE AWARDS
    // ─────────────────────────────────────────────────────────────────────────

    private function seedBadges(): void
    {
        $liam    = ChildProfile::where('name', 'Liam')->first();
        $gabriel = ChildProfile::where('name', 'Gabriel')->first();
        $miguel  = ChildProfile::where('name', 'Miguel')->first();
        $hana    = ChildProfile::where('name', 'Hana')->first();

        $badgeFirstQuiz    = Badge::where('name', 'First Quiz')->first();
        $badgeFirstLesson  = Badge::where('name', 'First Lesson')->first();
        $badgeStar         = Badge::where('name', 'Scripture Star')->first();
        $badgeQuizWarrior  = Badge::where('name', 'Quiz Warrior')->first();
        $badgeFaithful     = Badge::where('name', 'Faithful Learner')->first();
        $badgePerfect      = Badge::where('name', 'Perfect Score')->first();
        $badgeVerse        = Badge::where('name', 'Verse Champion')->first();
        $badgeScholar      = Badge::where('name', 'Bible Scholar')->first();

        // ── Liam: first quiz, first lesson, scripture star (3 verses) ─────────
        $liam->badges()->attach($badgeFirstQuiz->id,   ['awarded_at' => now()->subDays(14)]);
        $liam->badges()->attach($badgeFirstLesson->id, ['awarded_at' => now()->subDays(14)]);
        $liam->badges()->attach($badgeStar->id,        ['awarded_at' => now()->subDays(3)]);

        // ── Gabriel: all-rounder (most advanced) ─────────────────────────────
        $gabriel->badges()->attach($badgeFirstQuiz->id,   ['awarded_at' => now()->subDays(22)]);
        $gabriel->badges()->attach($badgeFirstLesson->id, ['awarded_at' => now()->subDays(22)]);
        $gabriel->badges()->attach($badgeStar->id,        ['awarded_at' => now()->subDays(18)]);
        $gabriel->badges()->attach($badgePerfect->id,     ['awarded_at' => now()->subDays(15)]);
        $gabriel->badges()->attach($badgeFaithful->id,    ['awarded_at' => now()->subDays(10)]);
        $gabriel->badges()->attach($badgeVerse->id,       ['awarded_at' => now()->subDays(8)]);

        // ── Miguel: first quiz, first lesson, perfect on early quizzes ────────
        $miguel->badges()->attach($badgeFirstQuiz->id,   ['awarded_at' => now()->subDays(18)]);
        $miguel->badges()->attach($badgeFirstLesson->id, ['awarded_at' => now()->subDays(18)]);
        $miguel->badges()->attach($badgePerfect->id,     ['awarded_at' => now()->subDays(12)]);
        $miguel->badges()->attach($badgeFaithful->id,    ['awarded_at' => now()->subDays(5)]);

        // ── Hana: first lesson (viewed only, but give encouraging first badge) ─
        $hana->badges()->attach($badgeFirstLesson->id, ['awarded_at' => now()->subDays(3)]);
    }
}