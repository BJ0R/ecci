<?php
// database/seeders/MemoryVerseSeeder.php

namespace Database\Seeders;

use App\Models\MemoryVerse;
use Illuminate\Database\Seeder;

class MemoryVerseSeeder extends Seeder
{
    public function run(): void
    {
        $verses = [
            [
                'verse_text'   => 'In the beginning God created the heavens and the earth.',
                'reference'    => 'Genesis 1:1',
                'week_number'  => 1,
                'context_note' => 'This is the very first sentence of the Bible. Help your child memorise it as a foundation — everything starts with God.',
            ],
            [
                'verse_text'   => 'I praise you because I am fearfully and wonderfully made.',
                'reference'    => 'Psalm 139:14',
                'week_number'  => 2,
                'context_note' => 'Encourage your child to say this verse to themselves every morning. It is a powerful identity truth.',
            ],
            [
                'verse_text'   => 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
                'reference'    => 'John 3:16',
                'week_number'  => 3,
                'context_note' => 'The most famous verse in the Bible. Ask your child: who is "the world" that God loves? The answer is everyone — including them.',
            ],
            [
                'verse_text'   => "The LORD is my shepherd; I shall not want.",
                'reference'    => 'Psalm 23:1',
                'week_number'  => 4,
                'context_note' => 'Consider reading the full Psalm 23 together as a family prayer this week.',
            ],
            [
                'verse_text'   => "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
                'reference'    => 'Proverbs 3:5–6',
                'week_number'  => 5,
                'context_note' => 'A verse for the whole family. Ask: what does it look like to "trust with all your heart" in a decision you are facing this week?',
            ],
            [
                'verse_text'   => "Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
                'reference'    => 'Joshua 1:9',
                'week_number'  => 6,
                'context_note' => 'God said this to Joshua before one of the scariest moments of his life. Help your child think of a scary situation where they can apply this verse.',
            ],
        ];

        foreach ($verses as $verse) {
            MemoryVerse::create($verse);
        }
    }
}