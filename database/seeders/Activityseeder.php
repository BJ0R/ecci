<?php
// database/seeders/ActivitySeeder.php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

/**
 * Seeds 2 activities per published lesson (one quiz, one fill-in).
 * Quiz activities get 3-4 ActivityQuestion rows each.
 */
class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedLessonActivities();
    }

    private function seedLessonActivities(): void
    {
        // Keyed by lesson title for clarity
        $activityData = [

            // ── NURSERY ──────────────────────────────────────────────────────

            'God Made the World' => [
                'quiz' => [
                    'title'        => 'Who Made the World?',
                    'instructions' => 'Let\'s see what you learned about Creation! Choose the best answer for each question.',
                    'max_score'    => 10,
                    'questions'    => [
                        ['question_text' => 'Who made the world?',
                         'choices'       => ['God', 'People', 'Animals', 'The Sun'],
                         'correct_answer'=> 'God', 'points' => 3],
                        ['question_text' => 'What did God say after He made everything?',
                         'choices'       => ['It was okay', 'It was very good', 'It was too small', 'It was broken'],
                         'correct_answer'=> 'It was very good', 'points' => 3],
                        ['question_text' => 'On which day did God rest?',
                         'choices'       => ['Day 1', 'Day 4', 'Day 7', 'Day 10'],
                         'correct_answer'=> 'Day 7', 'points' => 4],
                    ],
                ],
                'fill' => [
                    'title'        => 'Creation Thank-You Drawing',
                    'instructions' => 'Draw your favourite thing that God made (an animal, the sky, a flower...) and tell us WHY you love it. Write: "God made ___ and I love it because ___."',
                    'max_score'    => 5,
                ],
            ],

            'God Made Me Special' => [
                'quiz' => [
                    'title'        => 'I Am Wonderfully Made',
                    'instructions' => 'Choose the right answer!',
                    'max_score'    => 9,
                    'questions'    => [
                        ['question_text' => 'Who made you?',
                         'choices'       => ['Your parents only', 'God', 'A doctor', 'You made yourself'],
                         'correct_answer'=> 'God', 'points' => 3],
                        ['question_text' => 'According to Psalm 139, you are "fearfully and _____ made".',
                         'choices'       => ['slowly', 'wonderfully', 'quietly', 'quickly'],
                         'correct_answer'=> 'wonderfully', 'points' => 3],
                        ['question_text' => 'How many people in the world are exactly like you?',
                         'choices'       => ['1000', 'Just your twin', 'Nobody — I\'m unique!', '5'],
                         'correct_answer'=> 'Nobody — I\'m unique!', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'What God Made in Me',
                    'instructions' => 'Fill in the blank: "I am special because God gave me ___." Tell us one thing about yourself that makes you unique!',
                    'max_score'    => 5,
                ],
            ],

            'Jesus Loves the Little Children' => [
                'quiz' => [
                    'title'        => 'Jesus Loves Me Quiz',
                    'instructions' => 'Choose the best answer!',
                    'max_score'    => 9,
                    'questions'    => [
                        ['question_text' => 'What did Jesus do when children came to Him?',
                         'choices'       => ['He told them to go away', 'He welcomed and blessed them', 'He was too busy', 'He was sleeping'],
                         'correct_answer'=> 'He welcomed and blessed them', 'points' => 3],
                        ['question_text' => 'Who tried to stop the children from coming to Jesus?',
                         'choices'       => ['The parents', 'The disciples', 'Pharaoh', 'No one'],
                         'correct_answer'=> 'The disciples', 'points' => 3],
                        ['question_text' => 'Does Jesus love you?',
                         'choices'       => ['Only sometimes', 'Only if I\'m good', 'Yes, always!', 'I don\'t know'],
                         'correct_answer'=> 'Yes, always!', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'A Letter to Jesus',
                    'instructions' => 'Write or dictate: "Dear Jesus, I love You because ___."',
                    'max_score'    => 5,
                ],
            ],

            'The Good Shepherd' => [
                'quiz' => [
                    'title'        => 'The Good Shepherd Quiz',
                    'instructions' => 'Who is the Good Shepherd? Let\'s find out!',
                    'max_score'    => 9,
                    'questions'    => [
                        ['question_text' => 'In Psalm 23, who is called "my shepherd"?',
                         'choices'       => ['David', 'Moses', 'The LORD', 'An angel'],
                         'correct_answer'=> 'The LORD', 'points' => 3],
                        ['question_text' => 'What does a shepherd do for his sheep?',
                         'choices'       => ['Ignores them', 'Takes care of and protects them', 'Chases them away', 'Sells them'],
                         'correct_answer'=> 'Takes care of and protects them', 'points' => 3],
                        ['question_text' => 'Because God is my shepherd, I shall not ___.',
                         'choices'       => ['eat', 'want', 'sleep', 'play'],
                         'correct_answer'=> 'want', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My Shepherd Cares For Me',
                    'instructions' => 'Finish this sentence: "Jesus, my Good Shepherd, takes care of me by ___."',
                    'max_score'    => 5,
                ],
            ],

            'The Lost Sheep' => [
                'quiz' => [
                    'title'        => 'The Lost Sheep Story Quiz',
                    'instructions' => 'Choose the right answer!',
                    'max_score'    => 9,
                    'questions'    => [
                        ['question_text' => 'How many sheep did the shepherd have?',
                         'choices'       => ['10', '50', '100', '1000'],
                         'correct_answer'=> '100', 'points' => 3],
                        ['question_text' => 'How many sheep got lost?',
                         'choices'       => ['All of them', 'Ten', 'One', 'None'],
                         'correct_answer'=> 'One', 'points' => 3],
                        ['question_text' => 'How did the shepherd feel when he found the lost sheep?',
                         'choices'       => ['Angry', 'Joyful', 'Tired', 'Confused'],
                         'correct_answer'=> 'Joyful', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'When I Feel Lost',
                    'instructions' => 'Write or tell us: "When I feel scared or alone, I remember that God ___."',
                    'max_score'    => 5,
                ],
            ],

            'God Is Always With Me' => [
                'quiz' => [
                    'title'        => 'God Is With Me Quiz',
                    'instructions' => 'True or False — choose the best answer!',
                    'max_score'    => 9,
                    'questions'    => [
                        ['question_text' => 'God promised to be with us wherever we go.',
                         'choices'       => ['True', 'False', 'Only sometimes', 'Only at church'],
                         'correct_answer'=> 'True', 'points' => 3],
                        ['question_text' => 'Which book of the Bible says "Do not be afraid, for the LORD your God is with you"?',
                         'choices'       => ['Genesis', 'Joshua', 'Psalms', 'Revelation'],
                         'correct_answer'=> 'Joshua', 'points' => 3],
                        ['question_text' => 'God is with me...',
                         'choices'       => ['Only at night', 'Only when I pray', 'Everywhere, always', 'Only on Sundays'],
                         'correct_answer'=> 'Everywhere, always', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Where God Follows Me',
                    'instructions' => 'Name a place where you sometimes feel nervous or alone, and then finish: "But God is with me there because ___."',
                    'max_score'    => 5,
                ],
            ],

            // ── KIDS ─────────────────────────────────────────────────────────

            'David and Goliath' => [
                'quiz' => [
                    'title'        => 'David and Goliath Quiz',
                    'instructions' => 'Test what you know about David\'s great faith! Choose the best answer.',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'What weapon did David use to defeat Goliath?',
                         'choices'       => ['A sword', 'A sling and a stone', 'A spear', 'His bare hands'],
                         'correct_answer'=> 'A sling and a stone', 'points' => 3],
                        ['question_text' => 'In whose name did David say he was fighting?',
                         'choices'       => ['King Saul\'s', 'His father Jesse\'s', 'The LORD Almighty\'s', 'His own'],
                         'correct_answer'=> 'The LORD Almighty\'s', 'points' => 3],
                        ['question_text' => 'What was David\'s job before becoming a warrior?',
                         'choices'       => ['A fisherman', 'A carpenter', 'A shepherd', 'A soldier'],
                         'correct_answer'=> 'A shepherd', 'points' => 3],
                        ['question_text' => 'What army did Goliath belong to?',
                         'choices'       => ['The Babylonians', 'The Philistines', 'The Egyptians', 'The Romans'],
                         'correct_answer'=> 'The Philistines', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My Giant',
                    'instructions' => 'Think of something in your life that feels like a "giant" — something big and scary. Write: "My giant is ___, and I can face it because ___."',
                    'max_score'    => 5,
                ],
            ],

            'Moses Parts the Red Sea' => [
                'quiz' => [
                    'title'        => 'The Red Sea Crossing Quiz',
                    'instructions' => 'How well do you know this incredible miracle?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'What was chasing the Israelites?',
                         'choices'       => ['Wild animals', 'Pharaoh\'s army', 'A storm', 'A flood'],
                         'correct_answer'=> 'Pharaoh\'s army', 'points' => 3],
                        ['question_text' => 'What did God do to the Red Sea?',
                         'choices'       => ['Dried it up completely', 'Parted it so people could walk across', 'Turned it into land', 'Made it freeze'],
                         'correct_answer'=> 'Parted it so people could walk across', 'points' => 3],
                        ['question_text' => 'What did Moses tell the people to do when they were afraid?',
                         'choices'       => ['Run faster', 'Fight the army', 'Stand firm and see God\'s deliverance', 'Hide in the desert'],
                         'correct_answer'=> 'Stand firm and see God\'s deliverance', 'points' => 3],
                        ['question_text' => 'What happened to Pharaoh\'s army in the sea?',
                         'choices'       => ['They turned back', 'They swam safely across', 'They were drowned', 'They surrendered'],
                         'correct_answer'=> 'They were drowned', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Standing Still for God',
                    'instructions' => 'Describe a time when you felt "trapped" with no way out. Then write: "What I learned from Moses is that I should ___."',
                    'max_score'    => 5,
                ],
            ],

            'Daniel in the Lions\' Den' => [
                'quiz' => [
                    'title'        => 'Daniel\'s Faith Quiz',
                    'instructions' => 'How much do you know about Daniel\'s courage?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'What did Daniel do three times a day despite the new law?',
                         'choices'       => ['Read the Torah', 'Prayed to God', 'Went to the temple', 'Sang worship songs'],
                         'correct_answer'=> 'Prayed to God', 'points' => 3],
                        ['question_text' => 'Who tricked the king into signing the law against praying?',
                         'choices'       => ['The priests', 'The administrators and satraps', 'The queen', 'Daniel\'s friends'],
                         'correct_answer'=> 'The administrators and satraps', 'points' => 3],
                        ['question_text' => 'How did God protect Daniel in the lions\' den?',
                         'choices'       => ['He scared the lions away', 'He sent an angel to shut the lions\' mouths', 'He turned Daniel invisible', 'He put the lions to sleep'],
                         'correct_answer'=> 'He sent an angel to shut the lions\' mouths', 'points' => 3],
                        ['question_text' => 'What did King Darius do when he found Daniel alive?',
                         'choices'       => ['He apologised', 'He decreed that all people should fear Daniel\'s God', 'He put Daniel in jail again', 'He gave Daniel his throne'],
                         'correct_answer'=> 'He decreed that all people should fear Daniel\'s God', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My Prayer Challenge',
                    'instructions' => 'Daniel prayed even when it was against the rules. Write about a time when it was hard to do the right thing. What did you do? What would you do differently now?',
                    'max_score'    => 5,
                ],
            ],

            'Noah and the Ark' => [
                'quiz' => [
                    'title'        => 'Noah\'s Obedience Quiz',
                    'instructions' => 'Choose the right answer for each question about Noah.',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'Why did God ask Noah to build the ark?',
                         'choices'       => ['To go on an adventure', 'To save his family and animals from a flood', 'To travel to another land', 'Because Noah liked building'],
                         'correct_answer'=> 'To save his family and animals from a flood', 'points' => 3],
                        ['question_text' => 'What is a key phrase describing Noah\'s obedience?',
                         'choices'       => ['Noah mostly obeyed', 'Noah questioned God first', 'Noah did everything just as God commanded', 'Noah finished the job late'],
                         'correct_answer'=> 'Noah did everything just as God commanded', 'points' => 3],
                        ['question_text' => 'How many days and nights did it rain?',
                         'choices'       => ['7 days', '30 days', '40 days and 40 nights', '100 days'],
                         'correct_answer'=> '40 days and 40 nights', 'points' => 3],
                        ['question_text' => 'What did God put in the sky as a sign of His promise?',
                         'choices'       => ['A cloud', 'A rainbow', 'A star', 'A dove'],
                         'correct_answer'=> 'A rainbow', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'One Plank at a Time',
                    'instructions' => 'Noah obeyed God for a very long time before he saw any results. What is something you are doing by faith right now, even though you can\'t see the result yet? Write: "By faith I am ___ because ___."',
                    'max_score'    => 5,
                ],
            ],

            'Abraham: Trusting God\'s Promise' => [
                'quiz' => [
                    'title'        => 'Father Abraham Quiz',
                    'instructions' => 'How well do you know the story of Abraham\'s faith?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'What did God promise Abraham?',
                         'choices'       => ['A great kingdom', 'Descendants as many as the stars', 'Long life', 'A new language'],
                         'correct_answer'=> 'Descendants as many as the stars', 'points' => 3],
                        ['question_text' => 'Why was God\'s promise to Abraham so hard to believe?',
                         'choices'       => ['He lived in a desert', 'Abraham and Sarah were very old and childless', 'The stars were very far away', 'God spoke too quietly'],
                         'correct_answer'=> 'Abraham and Sarah were very old and childless', 'points' => 3],
                        ['question_text' => 'What was credited to Abraham as righteousness?',
                         'choices'       => ['His wealth', 'His good works', 'His faith — believing God', 'His sacrifices'],
                         'correct_answer'=> 'His faith — believing God', 'points' => 3],
                        ['question_text' => 'What was the name of Abraham\'s son of promise?',
                         'choices'       => ['Ishmael', 'Jacob', 'Isaac', 'Moses'],
                         'correct_answer'=> 'Isaac', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'A Promise I\'m Waiting For',
                    'instructions' => 'Write about a promise from God\'s Word that you are trusting Him for right now. Example: "I am trusting God for ___, even though I cannot see it yet, because He promised ___."',
                    'max_score'    => 5,
                ],
            ],

            'Solomon Asks for Wisdom' => [
                'quiz' => [
                    'title'        => 'Solomon\'s Wise Choice Quiz',
                    'instructions' => 'Let\'s see what you remember about Solomon\'s prayer!',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'What did God offer Solomon when He appeared to him?',
                         'choices'       => ['Any country he wanted', 'Whatever Solomon asked for', 'A great army', 'Long life automatically'],
                         'correct_answer'=> 'Whatever Solomon asked for', 'points' => 3],
                        ['question_text' => 'What did Solomon ask God for?',
                         'choices'       => ['Riches and gold', 'A long life', 'A discerning heart / wisdom', 'Victory over enemies'],
                         'correct_answer'=> 'A discerning heart / wisdom', 'points' => 3],
                        ['question_text' => 'Why was God pleased with Solomon\'s request?',
                         'choices'       => ['It was the most expensive request', 'He asked for others, not for himself', 'He asked for something useful for war', 'He prayed for 40 days first'],
                         'correct_answer'=> 'He asked for others, not for himself', 'points' => 3],
                        ['question_text' => 'What did God give Solomon IN ADDITION to wisdom?',
                         'choices'       => ['Nothing extra', 'Riches and honour', 'A new temple', 'Power to perform miracles'],
                         'correct_answer'=> 'Riches and honour', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My Wisdom Request',
                    'instructions' => 'Write your own prayer to God asking for wisdom in a specific area. "God, please give me wisdom about ___, because ___."',
                    'max_score'    => 5,
                ],
            ],

            // ── YOUTH ────────────────────────────────────────────────────────

            'Joseph: From the Pit to the Palace' => [
                'quiz' => [
                    'title'        => 'Joseph\'s Journey Quiz',
                    'instructions' => 'Test your knowledge of Joseph\'s remarkable story!',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'Why did Joseph\'s brothers sell him into slavery?',
                         'choices'       => ['He stole from them', 'Out of jealousy', 'He broke family rules', 'Their father told them to'],
                         'correct_answer'=> 'Out of jealousy', 'points' => 3],
                        ['question_text' => 'What gift did Joseph have that God used in Egypt?',
                         'choices'       => ['Strength like Samson', 'The ability to interpret dreams', 'The ability to perform miracles', 'Great military skill'],
                         'correct_answer'=> 'The ability to interpret dreams', 'points' => 3],
                        ['question_text' => 'What was Joseph\'s response to his brothers after their father died?',
                         'choices'       => ['He imprisoned them', 'He chose forgiveness', 'He sent them back to Canaan', 'He pretended not to know them'],
                         'correct_answer'=> 'He chose forgiveness', 'points' => 3],
                        ['question_text' => 'Complete the verse: "You intended to harm me, but God intended it ___."',
                         'choices'       => ['for punishment', 'for evil', 'for good', 'for a lesson'],
                         'correct_answer'=> 'for good', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Reframing My Struggle',
                    'instructions' => 'Think of a hardship or injustice you have experienced. Using Joseph\'s perspective, write: "This situation felt like ___, but perhaps God is using it for ___ because ___."',
                    'max_score'    => 5,
                ],
            ],

            'Esther: For Such a Time as This' => [
                'quiz' => [
                    'title'        => 'Esther\'s Courage Quiz',
                    'instructions' => 'How well do you know Esther\'s story?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'Who was the villain who plotted to destroy the Jewish people?',
                         'choices'       => ['Xerxes', 'Mordecai', 'Haman', 'Vashti'],
                         'correct_answer'=> 'Haman', 'points' => 3],
                        ['question_text' => 'What was the risk of going to the king without being summoned?',
                         'choices'       => ['Being fined', 'Death (unless the king extended his sceptre)', 'Being exiled', 'Losing her crown'],
                         'correct_answer'=> 'Death (unless the king extended his sceptre)', 'points' => 3],
                        ['question_text' => 'What did Esther ask all the Jews to do before she went to the king?',
                         'choices'       => ['Sacrifice an animal', 'Fast for three days', 'Pray all night', 'Flee to another city'],
                         'correct_answer'=> 'Fast for three days', 'points' => 3],
                        ['question_text' => 'Mordecai told Esther she had come to her royal position "for such a ___".',
                         'choices'       => ['season', 'reason', 'time as this', 'purpose as this'],
                         'correct_answer'=> 'time as this', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My "Such a Time as This"',
                    'instructions' => 'Mordecai believed Esther was placed in her position on purpose. Where do you believe God has placed YOU on purpose right now — school, family, community? Write: "I believe God placed me ___ for such a time as this because ___."',
                    'max_score'    => 5,
                ],
            ],

            'The Sermon on the Mount: Kingdom Values' => [
                'quiz' => [
                    'title'        => 'The Beatitudes Quiz',
                    'instructions' => 'Match the Beatitude to its promise from Matthew 5.',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'Blessed are the pure in heart, for they ___.',
                         'choices'       => ['will inherit the earth', 'will see God', 'will receive mercy', 'will be called children of God'],
                         'correct_answer'=> 'will see God', 'points' => 3],
                        ['question_text' => 'Blessed are the peacemakers, for they ___.',
                         'choices'       => ['will see God', 'will inherit the earth', 'will be called children of God', 'will receive comfort'],
                         'correct_answer'=> 'will be called children of God', 'points' => 3],
                        ['question_text' => 'Blessed are the meek, for they ___.',
                         'choices'       => ['will be comforted', 'will inherit the earth', 'will receive mercy', 'will see God'],
                         'correct_answer'=> 'will inherit the earth', 'points' => 3],
                        ['question_text' => 'The Beatitudes are found in which chapter of Matthew?',
                         'choices'       => ['Chapter 3', 'Chapter 5', 'Chapter 7', 'Chapter 10'],
                         'correct_answer'=> 'Chapter 5', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Beatitude in Practice',
                    'instructions' => 'Choose ONE Beatitude that challenges you the most. Write: "The Beatitude that I find hardest to live is ___ because ___. This week I will try to live it out by ___."',
                    'max_score'    => 5,
                ],
            ],

            'Paul\'s Letter to the Romans: Grace and Identity' => [
                'quiz' => [
                    'title'        => 'Romans 8 Quiz',
                    'instructions' => 'How well do you know Paul\'s incredible declaration in Romans 8?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'According to Romans 8:1, there is now no ___ for those who are in Christ Jesus.',
                         'choices'       => ['hope', 'condemnation', 'love', 'trial'],
                         'correct_answer'=> 'condemnation', 'points' => 3],
                        ['question_text' => 'Paul lists many things that CANNOT separate us from God\'s love. Which of these is on his list?',
                         'choices'       => ['Our sin', 'Death and life', 'Laziness', 'Doubt'],
                         'correct_answer'=> 'Death and life', 'points' => 3],
                        ['question_text' => 'Romans 8:28 says that in ALL things God works for the good of those who ___.',
                         'choices'       => ['are perfect', 'love him and are called', 'go to church every week', 'never doubt'],
                         'correct_answer'=> 'love him and are called', 'points' => 3],
                        ['question_text' => 'The "love of God" at the end of Romans 8 is found in whom?',
                         'choices'       => ['The law', 'Good deeds', 'Christ Jesus our Lord', 'The prophets'],
                         'correct_answer'=> 'Christ Jesus our Lord', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Identity Statement',
                    'instructions' => 'Write 3 truths about your identity in Christ from Romans 8. Format: "Because of Christ, I am ___, I am ___, and I am ___." Then explain why one of these truths matters most to you right now.',
                    'max_score'    => 5,
                ],
            ],

            'Discipleship: The Cost and the Call' => [
                'quiz' => [
                    'title'        => 'The Cost of Following Jesus Quiz',
                    'instructions' => 'What does it really mean to follow Jesus?',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'In Luke 9:23, what must a disciple do DAILY?',
                         'choices'       => ['Read the Bible for one hour', 'Deny themselves and take up their cross', 'Pray before every meal', 'Attend a church service'],
                         'correct_answer'=> 'Deny themselves and take up their cross', 'points' => 3],
                        ['question_text' => 'In Luke 9:24, whoever wants to SAVE their life will ___ it.',
                         'choices'       => ['find', 'grow', 'lose', 'share'],
                         'correct_answer'=> 'lose', 'points' => 3],
                        ['question_text' => 'What does "denying yourself" primarily mean in the context of discipleship?',
                         'choices'       => ['Never eating nice food', 'Putting God\'s will above personal desires', 'Living in poverty', 'Never having fun'],
                         'correct_answer'=> 'Putting God\'s will above personal desires', 'points' => 3],
                        ['question_text' => 'Discipleship in Luke 9:23 is described as a ___ decision.',
                         'choices'       => ['yearly', 'one-time', 'daily', 'monthly'],
                         'correct_answer'=> 'daily', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'My Cross Today',
                    'instructions' => 'Jesus said to take up your cross "daily." What is one specific thing you need to "deny yourself" or sacrifice this week to follow Jesus more closely? Write: "This week, following Jesus means I will ___ instead of ___."',
                    'max_score'    => 5,
                ],
            ],

            'The Holy Spirit: Power to Live Differently' => [
                'quiz' => [
                    'title'        => 'Fruit of the Spirit Quiz',
                    'instructions' => 'Test your knowledge of Galatians 5!',
                    'max_score'    => 12,
                    'questions'    => [
                        ['question_text' => 'How many fruits of the Spirit are listed in Galatians 5:22–23?',
                         'choices'       => ['7', '8', '9', '12'],
                         'correct_answer'=> '9', 'points' => 3],
                        ['question_text' => 'Which of the following is NOT a fruit of the Spirit?',
                         'choices'       => ['Gentleness', 'Faithfulness', 'Ambition', 'Self-control'],
                         'correct_answer'=> 'Ambition', 'points' => 3],
                        ['question_text' => 'Paul contrasts the fruit of the Spirit with "works of the ___".',
                         'choices'       => ['law', 'flesh', 'world', 'enemy'],
                         'correct_answer'=> 'flesh', 'points' => 3],
                        ['question_text' => 'The fruit of the Spirit is best produced by ___.',
                         'choices'       => ['Trying harder and willpower', 'Staying connected to God in relationship', 'Reading more theology books', 'Attending more church events'],
                         'correct_answer'=> 'Staying connected to God in relationship', 'points' => 3],
                    ],
                ],
                'fill' => [
                    'title'        => 'Fruit Assessment',
                    'instructions' => 'Honestly assess yourself on 3 of the 9 fruits. Write: "When it comes to [fruit], I would rate myself ___ out of 5 because ___. I am asking the Holy Spirit to grow [fruit] in me by ___."',
                    'max_score'    => 5,
                ],
            ],
        ];

        // ── Create activities + questions ─────────────────────────────────────
        foreach ($activityData as $lessonTitle => $activities) {
            $lesson = Lesson::where('title', $lessonTitle)->first();
            if (! $lesson) continue;

            // ── Quiz activity ─────────────────────────────────────────────────
            $quiz = Activity::create([
                'lesson_id'    => $lesson->id,
                'title'        => $activities['quiz']['title'],
                'type'         => 'quiz',
                'instructions' => $activities['quiz']['instructions'],
                'max_score'    => $activities['quiz']['max_score'],
            ]);

            foreach ($activities['quiz']['questions'] as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'],
                    'choices'       => $q['choices'],
                    'correct_answer'=> $q['correct_answer'],
                    'points'        => $q['points'],
                ]);
            }

            // ── Fill activity ─────────────────────────────────────────────────
            Activity::create([
                'lesson_id'    => $lesson->id,
                'title'        => $activities['fill']['title'],
                'type'         => 'fill',
                'instructions' => $activities['fill']['instructions'],
                'max_score'    => $activities['fill']['max_score'],
            ]);
        }
    }
}