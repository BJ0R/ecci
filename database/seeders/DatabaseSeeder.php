<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\ChildProfile;
use App\Models\Lesson;
use App\Models\LessonContent;
use App\Models\LessonProgress;
use App\Models\Activity;
use App\Models\ActivityQuestion;
use App\Models\ActivitySubmission;
use App\Models\MemoryVerse;
use App\Models\VerseCompletion;
use App\Models\Announcement;
use App\Models\PrayerRequest;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. ADMIN ─────────────────────────────────────────────────────────
        $admin = User::create([
            'name'        => 'Church Admin',
            'family_name' => null,
            'email'       => 'admin@gmail.com',
            'password'    => Hash::make('password'),
            'role'        => 'admin',
            'is_approved' => true,
        ]);

        // ── 2. TEACHERS ──────────────────────────────────────────────────────
        $teacher1 = User::create([
            'name'        => 'Maria Santos',
            'family_name' => null,
            'email'       => 'teacher@gmail.com',
            'password'    => Hash::make('password'),
            'role'        => 'teacher',
            'is_approved' => true,
        ]);

        $teacher2 = User::create([
            'name'        => 'Joseph Reyes',
            'family_name' => null,
            'email'       => 'teacher2@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'teacher',
            'is_approved' => true,
        ]);

        // Unapproved teacher — for admin approval UI testing
        User::create([
            'name'        => 'New Teacher',
            'family_name' => null,
            'email'       => 'newteacher@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'teacher',
            'is_approved' => false,
        ]);

        // ── 3. PARENTS (approved) ────────────────────────────────────────────
        $family1 = User::create([
            'name'        => 'Juan dela Cruz',
            'family_name' => 'Dela Cruz Family',
            'email'       => 'parent@gmail.com',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'is_approved' => true,
        ]);

        $family2 = User::create([
            'name'        => 'Ana Reyes',
            'family_name' => 'Reyes Family',
            'email'       => 'parent2@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'is_approved' => true,
        ]);

        $family3 = User::create([
            'name'        => 'Roberto Garcia',
            'family_name' => 'Garcia Family',
            'email'       => 'parent3@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'is_approved' => true,
        ]);

        // Unapproved parent — for admin approval UI testing
        User::create([
            'name'        => 'Pending Parent',
            'family_name' => 'Pending Family',
            'email'       => 'pending@eccii.church',
            'password'    => Hash::make('password'),
            'role'        => 'parent',
            'is_approved' => false,
        ]);

        // ── 4. CHILD PROFILES ────────────────────────────────────────────────
        // fillable: user_id, name, age, grade, avatar_color
        // ageGroup() helper → ≤5 nursery | ≤10 kids | else youth

        $child1 = ChildProfile::create([
            'user_id'      => $family1->id,
            'name'         => 'Miguel',
            'age'          => 8,          // kids
            'grade'        => 'Grade 2',
            'avatar_color' => '#3B82F6',
        ]);
        $child2 = ChildProfile::create([
            'user_id'      => $family1->id,
            'name'         => 'Sofia',
            'age'          => 5,          // nursery
            'grade'        => 'Kinder',
            'avatar_color' => '#EC4899',
        ]);
        $child3 = ChildProfile::create([
            'user_id'      => $family2->id,
            'name'         => 'Lucas',
            'age'          => 12,         // youth
            'grade'        => 'Grade 6',
            'avatar_color' => '#10B981',
        ]);
        $child4 = ChildProfile::create([
            'user_id'      => $family2->id,
            'name'         => 'Isabella',
            'age'          => 9,          // kids
            'grade'        => 'Grade 3',
            'avatar_color' => '#F59E0B',
        ]);
        $child5 = ChildProfile::create([
            'user_id'      => $family3->id,
            'name'         => 'Ethan',
            'age'          => 4,          // nursery
            'grade'        => 'Pre-K',
            'avatar_color' => '#8B5CF6',
        ]);

        // ── 5. LESSONS + CONTENTS ────────────────────────────────────────────
        // Lesson fillable: created_by, title, series, week_number,
        //                  age_group, is_published, published_at
        // LessonContent fillable: lesson_id, bible_reference, bible_text,
        //                         explanation, reflection_questions (array→JSON), prayer

        $lesson1 = Lesson::create([
            'created_by'   => $teacher1->id,
            'title'        => 'David and Goliath',
            'series'       => 'Heroes of Faith',
            'week_number'  => 1,
            'age_group'    => 'kids',
            'is_published' => true,
            'published_at' => now()->subDays(14),
        ]);
        LessonContent::create([
            'lesson_id'            => $lesson1->id,
            'bible_reference'      => '1 Samuel 17:45-50',
            'bible_text'           => 'David said to the Philistine, "You come against me with sword and spear and javelin, but I come against you in the name of the LORD Almighty, the God of the armies of Israel, whom you have defied."',
            'explanation'          => 'David was just a young shepherd boy, but he trusted God completely. When the giant Goliath threatened God\'s people, David was not afraid because he knew God was with him. With just a sling and a stone — and great faith — David defeated the giant. This teaches us that with God on our side, we can face any challenge, no matter how big it seems.',
            'reflection_questions' => [
                'What made David brave enough to face Goliath?',
                'What is a "giant" problem in your life right now?',
                'How can we trust God like David did?',
            ],
            'prayer' => 'Dear Lord, thank You for being our strength. Help us to be brave like David and to always trust that You are bigger than any problem we face. Amen.',
        ]);

        $lesson2 = Lesson::create([
            'created_by'   => $teacher1->id,
            'title'        => 'Noah and the Ark',
            'series'       => 'Heroes of Faith',
            'week_number'  => 2,
            'age_group'    => 'kids',
            'is_published' => true,
            'published_at' => now()->subDays(7),
        ]);
        LessonContent::create([
            'lesson_id'            => $lesson2->id,
            'bible_reference'      => 'Genesis 6:22',
            'bible_text'           => 'Noah did everything just as God commanded him.',
            'explanation'          => 'Noah was a man who loved God and obeyed His commands even when everyone around him thought he was strange. God asked Noah to build a huge boat even though there was no rain in sight. Noah obeyed without question. His obedience saved his family and all the animals. God always keeps His promises, just like He kept His promise to Noah with the rainbow.',
            'reflection_questions' => [
                'Why did God choose Noah to build the ark?',
                'Is it sometimes hard to obey? How can we practice obedience at home?',
                'What does the rainbow remind us about God\'s promises?',
            ],
            'prayer' => 'Heavenly Father, help us to obey You even when it is hard or when others do not understand. Thank You for always keeping Your promises. Amen.',
        ]);

        $lesson3 = Lesson::create([
            'created_by'   => $teacher1->id,
            'title'        => 'Jesus Loves the Little Children',
            'series'       => 'Life of Jesus',
            'week_number'  => 1,
            'age_group'    => 'nursery',
            'is_published' => true,
            'published_at' => now()->subDays(10),
        ]);
        LessonContent::create([
            'lesson_id'            => $lesson3->id,
            'bible_reference'      => 'Mark 10:14',
            'bible_text'           => '"Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these."',
            'explanation'          => 'Jesus loves every single child — including YOU! When people tried to keep children away from Jesus, He told them to stop and let the children come. Jesus wants every child to know they are special and important to Him. You are never too small or too young to come to Jesus.',
            'reflection_questions' => [
                'How does it make you feel to know Jesus loves you?',
                'Can you name one thing you love about Jesus?',
            ],
            'prayer' => 'Jesus, thank You for loving me. Help me to love You back every day. Amen.',
        ]);

        $lesson4 = Lesson::create([
            'created_by'   => $teacher2->id,
            'title'        => 'The Sermon on the Mount',
            'series'       => 'Teachings of Jesus',
            'week_number'  => 1,
            'age_group'    => 'youth',
            'is_published' => true,
            'published_at' => now()->subDays(5),
        ]);
        LessonContent::create([
            'lesson_id'            => $lesson4->id,
            'bible_reference'      => 'Matthew 5:3-10',
            'bible_text'           => '"Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted. Blessed are the meek, for they will inherit the earth..."',
            'explanation'          => 'The Beatitudes are Jesus\'s description of what a truly blessed life looks like. They flip the world\'s values upside down — the humble are exalted, the merciful receive mercy, and the pure in heart see God. These are not just rules but descriptions of the character God wants to form in us through a life surrendered to Him.',
            'reflection_questions' => [
                'Which beatitude speaks most to you today and why?',
                'How does the world\'s definition of "blessed" differ from Jesus\'s?',
                'What is one beatitude you want to grow in this week?',
            ],
            'prayer' => 'Lord Jesus, shape us into people who reflect Your kingdom values. Help us to be humble, merciful, and pure in heart. Amen.',
        ]);

        // Draft lesson — unpublished, for teacher draft UI testing
        Lesson::create([
            'created_by'   => $teacher2->id,
            'title'        => 'Joseph and His Brothers',
            'series'       => 'Heroes of Faith',
            'week_number'  => 3,
            'age_group'    => 'kids',
            'is_published' => false,
            'published_at' => null,
        ]);

        // ── 6. ACTIVITIES ────────────────────────────────────────────────────
        // Activity fillable: lesson_id, title, type (quiz|drawing|fill),
        //                    instructions, max_score
        // ActivityQuestion fillable: activity_id, question_text, choices (cast array),
        //                            correct_answer, points

        // David and Goliath — quiz
        $quiz1 = Activity::create([
            'lesson_id'    => $lesson1->id,
            'title'        => 'David & Goliath Quiz',
            'type'         => 'quiz',
            'instructions' => 'Read the lesson together, then answer these questions.',
            'max_score'    => 4,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz1->id,
            'question_text'  => 'What weapon did David use to defeat Goliath?',
            'choices'        => ['A sword', 'A sling and stone', 'A spear', 'His bare hands'],
            'correct_answer' => 'A sling and stone',
            'points'         => 1,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz1->id,
            'question_text'  => 'What was David\'s job before he fought Goliath?',
            'choices'        => ['A soldier', 'A shepherd', 'A carpenter', 'A priest'],
            'correct_answer' => 'A shepherd',
            'points'         => 1,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz1->id,
            'question_text'  => 'What did David say he was coming against Goliath in the name of?',
            'choices'        => ['The king of Israel', 'The LORD Almighty', 'His own strength', 'The angels of heaven'],
            'correct_answer' => 'The LORD Almighty',
            'points'         => 1,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz1->id,
            'question_text'  => 'What does David\'s story teach us?',
            'choices'        => ['Only big people can win', 'We should use weapons', 'With God we can face any challenge', 'Giants are not scary'],
            'correct_answer' => 'With God we can face any challenge',
            'points'         => 1,
        ]);

        // David and Goliath — drawing
        Activity::create([
            'lesson_id'    => $lesson1->id,
            'title'        => 'Draw Your Giant',
            'type'         => 'drawing',
            'instructions' => 'Draw a picture of something that feels like a "giant" problem to you. Then draw yourself standing in front of it with God\'s light shining behind you.',
            'max_score'    => 10,
        ]);

        // Noah — fill
        Activity::create([
            'lesson_id'    => $lesson2->id,
            'title'        => 'Noah Reflection',
            'type'         => 'fill',
            'instructions' => 'In your own words: What is something God has asked you or your family to do that took courage or obedience? How did it turn out?',
            'max_score'    => 10,
        ]);

        // Sermon on the Mount — quiz
        $quiz2 = Activity::create([
            'lesson_id'    => $lesson4->id,
            'title'        => 'Beatitudes Quiz',
            'type'         => 'quiz',
            'instructions' => 'Test your knowledge of the Beatitudes from Matthew 5.',
            'max_score'    => 3,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz2->id,
            'question_text'  => 'Complete: "Blessed are the meek, for they will ___"',
            'choices'        => ['see God', 'inherit the earth', 'be comforted', 'receive mercy'],
            'correct_answer' => 'inherit the earth',
            'points'         => 1,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz2->id,
            'question_text'  => 'Where did Jesus preach the Beatitudes?',
            'choices'        => ['In the temple', 'On a mountain', 'By the sea', 'In a synagogue'],
            'correct_answer' => 'On a mountain',
            'points'         => 1,
        ]);
        ActivityQuestion::create([
            'activity_id'    => $quiz2->id,
            'question_text'  => '"Blessed are the pure in heart, for they will ___"',
            'choices'        => ['inherit the earth', 'be called children of God', 'see God', 'receive mercy'],
            'correct_answer' => 'see God',
            'points'         => 1,
        ]);

        // ── 7. LESSON PROGRESS ───────────────────────────────────────────────
        // fillable: lesson_id, child_profile_id, status (viewed|completed), completed_at
        // IMPORTANT: $table = 'lesson_progresses' (set explicitly in model)

        LessonProgress::create([
            'lesson_id'        => $lesson1->id,
            'child_profile_id' => $child1->id,
            'status'           => 'completed',
            'completed_at'     => now()->subDays(10),
        ]);
        LessonProgress::create([
            'lesson_id'        => $lesson2->id,
            'child_profile_id' => $child1->id,
            'status'           => 'viewed',
            'completed_at'     => null,
        ]);
        LessonProgress::create([
            'lesson_id'        => $lesson3->id,
            'child_profile_id' => $child2->id,
            'status'           => 'completed',
            'completed_at'     => now()->subDays(8),
        ]);
        LessonProgress::create([
            'lesson_id'        => $lesson1->id,
            'child_profile_id' => $child3->id,
            'status'           => 'completed',
            'completed_at'     => now()->subDays(12),
        ]);
        LessonProgress::create([
            'lesson_id'        => $lesson4->id,
            'child_profile_id' => $child3->id,
            'status'           => 'completed',
            'completed_at'     => now()->subDays(3),
        ]);
        LessonProgress::create([
            'lesson_id'        => $lesson1->id,
            'child_profile_id' => $child4->id,
            'status'           => 'viewed',
            'completed_at'     => null,
        ]);

        // ── 8. ACTIVITY SUBMISSIONS ──────────────────────────────────────────
        // fillable: activity_id, child_profile_id, submitted_by,
        //           answers (array→JSON), score, submitted_at
        // public $timestamps = false — must set submitted_at manually

        ActivitySubmission::create([
            'activity_id'      => $quiz1->id,
            'child_profile_id' => $child1->id,
            'submitted_by'     => $family1->id,
            // keys are string question IDs (as stored/compared in controller)
            'answers'          => [
                '1' => 'A sling and stone',
                '2' => 'A shepherd',
                '3' => 'The LORD Almighty',
                '4' => 'With God we can face any challenge',
            ],
            'score'        => 4,
            'submitted_at' => now()->subDays(9),
        ]);

        ActivitySubmission::create([
            'activity_id'      => $quiz1->id,
            'child_profile_id' => $child3->id,
            'submitted_by'     => $family2->id,
            'answers'          => [
                '1' => 'A sling and stone',
                '2' => 'A shepherd',
                '3' => 'The LORD Almighty',
                '4' => 'Only big people can win',  // wrong answer
            ],
            'score'        => 3,
            'submitted_at' => now()->subDays(11),
        ]);

        ActivitySubmission::create([
            'activity_id'      => $quiz2->id,
            'child_profile_id' => $child3->id,
            'submitted_by'     => $family2->id,
            'answers'          => [
                '1' => 'inherit the earth',
                '2' => 'On a mountain',
                '3' => 'see God',
            ],
            'score'        => 3,
            'submitted_at' => now()->subDays(2),
        ]);

        // ── 9. MEMORY VERSES ─────────────────────────────────────────────────
        // fillable: verse_text, reference, week_number, context_note

        $verse1 = MemoryVerse::create([
            'verse_text'   => 'I can do all things through Christ who strengthens me.',
            'reference'    => 'Philippians 4:13',
            'week_number'  => 1,
            'context_note' => 'Remind your child that no challenge is too big when Jesus is on their side.',
        ]);
        $verse2 = MemoryVerse::create([
            'verse_text'   => 'For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life.',
            'reference'    => 'John 3:16',
            'week_number'  => 2,
            'context_note' => 'Ask your child: what does it mean that God "gave" His Son for us?',
        ]);
        $verse3 = MemoryVerse::create([
            'verse_text'   => 'Trust in the LORD with all your heart and lean not on your own understanding.',
            'reference'    => 'Proverbs 3:5',
            'week_number'  => 3,
            'context_note' => 'Ask your child: what does it mean to trust someone completely?',
        ]);

        // ── 10. VERSE COMPLETIONS ────────────────────────────────────────────
        // fillable: memory_verse_id, child_profile_id, marked_by, memorized_at
        // public $timestamps = false — must set memorized_at manually
        // (memory_verse_id, child_profile_id) is unique per DB constraint

        VerseCompletion::create([
            'memory_verse_id'  => $verse1->id,
            'child_profile_id' => $child1->id,
            'marked_by'        => $family1->id,
            'memorized_at'     => now()->subDays(7),
        ]);
        VerseCompletion::create([
            'memory_verse_id'  => $verse2->id,
            'child_profile_id' => $child1->id,
            'marked_by'        => $family1->id,
            'memorized_at'     => now()->subDays(5),
        ]);
        VerseCompletion::create([
            'memory_verse_id'  => $verse1->id,
            'child_profile_id' => $child3->id,
            'marked_by'        => $family2->id,
            'memorized_at'     => now()->subDays(6),
        ]);
        VerseCompletion::create([
            'memory_verse_id'  => $verse2->id,
            'child_profile_id' => $child3->id,
            'marked_by'        => $family2->id,
            'memorized_at'     => now()->subDays(4),
        ]);
        VerseCompletion::create([
            'memory_verse_id'  => $verse3->id,
            'child_profile_id' => $child3->id,
            'marked_by'        => $family2->id,
            'memorized_at'     => now()->subDays(1),
        ]);
        VerseCompletion::create([
            'memory_verse_id'  => $verse1->id,
            'child_profile_id' => $child4->id,
            'marked_by'        => $family2->id,
            'memorized_at'     => now()->subDays(3),
        ]);

        // ── 11. ANNOUNCEMENTS ────────────────────────────────────────────────
        // fillable: posted_by, title, body, pinned (boolean)
        // scopePinFirst() → orderByDesc('pinned')->latest()

        Announcement::create([
            'posted_by' => $admin->id,
            'title'     => 'Welcome to ECCII Home Learning!',
            'body'      => 'We are so excited to launch our home learning platform. Each week, new lessons and memory verses will be posted for your family to explore together. May God bless your family as you grow in His Word!',
            'pinned'    => true,
        ]);
        Announcement::create([
            'posted_by' => $admin->id,
            'title'     => 'This Sunday — Heroes of Faith Series Continues',
            'body'      => 'This Sunday we continue our "Heroes of Faith" series. Please complete the Noah and the Ark lesson with your children before Sunday so they can participate in our group activity.',
            'pinned'    => false,
        ]);
        Announcement::create([
            'posted_by' => $admin->id,
            'title'     => 'VBS Registration Now Open',
            'body'      => 'Vacation Bible School registration is now open for children aged 4–14. Slots are limited — please contact the church office or message us through this platform to register your child.',
            'pinned'    => false,
        ]);

        // ── 12. PRAYER REQUESTS ──────────────────────────────────────────────
        // fillable: user_id, body, is_public, is_responded, admin_response, responded_at
        // scopeUnanswered() → where is_responded false
        // scopePublic()     → where is_public true

        PrayerRequest::create([
            'user_id'        => $family1->id,
            'body'           => 'Please pray for my son Miguel. He has been struggling in school and feeling discouraged. We are believing God for renewed confidence and joy in learning.',
            'is_public'      => true,
            'is_responded'   => false,
            'admin_response' => null,
            'responded_at'   => null,
        ]);
        PrayerRequest::create([
            'user_id'        => $family2->id,
            'body'           => 'Asking for prayers for our family\'s health. Several of us have been sick this week. Thank you, church family.',
            'is_public'      => true,
            'is_responded'   => true,
            'admin_response' => 'We are lifting your family up in prayer. May God restore health and strength to each of you. "He heals the brokenhearted and binds up their wounds." — Psalm 147:3',
            'responded_at'   => now()->subDays(1),
        ]);
        PrayerRequest::create([
            'user_id'        => $family3->id,
            'body'           => 'Private request for a difficult family situation. Please pray for peace, wisdom, and unity.',
            'is_public'      => false,
            'is_responded'   => false,
            'admin_response' => null,
            'responded_at'   => null,
        ]);
        PrayerRequest::create([
            'user_id'        => $family1->id,
            'body'           => 'Praise report! Sofia memorized her first Bible verse this week. Thank you for all your prayers and support.',
            'is_public'      => true,
            'is_responded'   => true,
            'admin_response' => 'Praise God! What a wonderful milestone. Sofia, we are so proud of you!',
            'responded_at'   => now()->subDays(3),
        ]);
    }
}