<?php
// database/seeders/AnnouncementSeeder.php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $announcements = [
            [
                'posted_by'  => $admin->id,
                'title'      => '🙏 Welcome to the ECCII Home Learning Platform!',
                'body'       => "Dear families, we are so glad you are here!\n\nThis platform is your family's digital companion for our Sunday School curriculum. Every week you will find:\n\n• A lesson for each child's age group (Nursery, Kids, Youth)\n• Bible quizzes and activities to reinforce the lesson\n• A weekly memory verse\n• Prayer requests and community updates from our church family\n\nIf you have any questions or encounter any problems, please do not hesitate to reach out to Pastor Jose directly. Let us grow together in faith!",
                'pinned'     => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'posted_by'  => $admin->id,
                'title'      => '📅 ECCII Family Day — Save the Date!',
                'body'       => "We are excited to announce our annual ECCII Family Day!\n\nDate: Last Sunday of this month\nTime: 9:00 AM – 4:00 PM\nVenue: Church Grounds\n\nHighlights:\n• Family worship together\n• Kids\' games and activities\n• Picnic lunch (please bring a dish to share!)\n• Youth sports afternoon\n• Special badge ceremony for children who have completed 5 lessons\n\nPlease RSVP by replying to this announcement or messaging Pastor Jose. We want every family present!",
                'pinned'     => true,
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
            [
                'posted_by'  => $admin->id,
                'title'      => '📖 New Lessons Published for Weeks 4–6',
                'body'       => "Praise God — lessons for Weeks 4 through 6 are now available for all age groups!\n\nThis week's themes:\n• Nursery: The Good Shepherd (Psalm 23)\n• Kids: Noah's Ark — One Plank at a Time (Genesis 6)\n• Youth: Romans 8 — Nothing Can Separate You\n\nRemember, the memory verse this week is Psalm 23:1. Encourage your children to memorise it and mark it in the app when they have!\n\nThank you for faithfully walking through these lessons with your children. It is a blessing to see your families grow.",
                'pinned'     => false,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'posted_by'  => $admin->id,
                'title'      => '🏅 Badge Achievements This Week',
                'body'       => "We celebrate the following children who earned badges this week:\n\n⭐ Scripture Star — Liam Reyes (John 3:16 memorised!)\n📚 Faithful Learner — Isabella Cruz (5 lessons completed!)\n💯 Perfect Score — Gabriel Dela Cruz (David and Goliath quiz!)\n\nWhat an inspiration these children are to our whole community. Well done!\n\nIf your child has not yet earned any badges, encourage them to complete one lesson or activity this week — the First Quiz and First Lesson badges are waiting for them!",
                'pinned'     => false,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ];

        foreach ($announcements as $data) {
            Announcement::create($data);
        }
    }
}