<?php
// database/seeders/LessonSeeder.php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeds 18 lessons (6 weeks × nursery / kids / youth).
 * age_group values are lowercase to match ChildProfile::ageGroup() output.
 * Each lesson is created with its LessonContent in one call via a closure.
 */
class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        // ── Lesson data ──────────────────────────────────────────────────────
        // Structure: [ age_group, week, series, title, content[] ]
        $lessons = [

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 1  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 1, 'God Made Everything', 'God Made the World',
                ['bible_reference' => 'Genesis 1:1',
                 'bible_text'      => 'In the beginning God created the heavens and the earth.',
                 'explanation'     => 'God is so amazing! Before there were any trees, animals, or people, there was nothing — except God. Then God spoke, and everything appeared! The sky, the sun, the oceans, and all the animals. God made it all because He loves to give good gifts.',
                 'reflection_questions' => [
                     'What is your favourite thing God made?',
                     'How can we say "thank you" to God for making such a beautiful world?',
                 ],
                 'prayer' => 'Dear God, thank You for making the sun, the sky, and me! You are so good. Amen.',
                ]],

            ['kids', 1, 'Heroes of Faith', 'David and Goliath',
                ['bible_reference' => '1 Samuel 17:45–50',
                 'bible_text'      => "David said to the Philistine, 'You come against me with sword and spear and javelin, but I come against you in the name of the LORD Almighty, the God of the armies of Israel, whom you have defied.'",
                 'explanation'     => 'David was just a shepherd boy, but he trusted God completely. When the giant Goliath threatened God\'s people, everyone else was terrified. But David remembered all the times God had protected him from lions and bears. He ran toward Goliath — not away! — because he knew God was with him. True courage is not the absence of fear, it is trusting God more than you trust your fear.',
                 'reflection_questions' => [
                     'What made David brave enough to face Goliath?',
                     'Is there something scary in your life that you can trust God with this week?',
                     'How does remembering what God has done in the past help us face new challenges?',
                 ],
                 'prayer' => 'Lord, help me to trust You when things feel too big for me. Remind me that with You beside me, I can face any giant. Amen.',
                ]],

            ['youth', 1, 'Faith in Action', 'Joseph: From the Pit to the Palace',
                ['bible_reference' => 'Genesis 50:20',
                 'bible_text'      => "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
                 'explanation'     => 'Joseph\'s brothers sold him into slavery out of jealousy. He was imprisoned for a crime he did not commit. Yet every betrayal, every injustice was part of God\'s larger plan. Joseph did not become bitter — he remained faithful in every circumstance. When he finally held power in Egypt, he chose forgiveness over revenge. This is one of the most stunning portraits of grace in the Bible: suffering that produces character, and character that changes nations.',
                 'reflection_questions' => [
                     'Have you ever been treated unfairly? How did you respond?',
                     'How does Joseph\'s story challenge the way you view your own difficulties?',
                     'What does it mean practically to trust God\'s "bigger story" when things go wrong?',
                 ],
                 'prayer' => 'Father, when life feels unfair, help me to see that You are working in ways I cannot yet see. Give me Joseph\'s patience and Joseph\'s forgiveness. Amen.',
                ]],

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 2  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 2, 'God Made Everything', 'God Made Me Special',
                ['bible_reference' => 'Psalm 139:14',
                 'bible_text'      => 'I praise you because I am fearfully and wonderfully made.',
                 'explanation'     => 'Did you know God made you on purpose? He chose your eyes, your smile, and your laugh. There is nobody in the whole world exactly like you — because God wanted YOU to be in this world! You are not an accident. You are a wonderful treasure God made with His own hands.',
                 'reflection_questions' => [
                     'What is something special about your body that God made?',
                     'How do you think God feels when He looks at you?',
                 ],
                 'prayer' => 'God, thank You for making me. Thank You for my eyes to see and my hands to play. I love You! Amen.',
                ]],

            ['kids', 2, 'Heroes of Faith', 'Moses Parts the Red Sea',
                ['bible_reference' => 'Exodus 14:13–14',
                 'bible_text'      => "Moses answered the people, 'Do not be afraid. Stand firm and you will see the deliverance the LORD will bring you today... The LORD will fight for you; you need only to be still.'",
                 'explanation'     => 'The Israelites were trapped. The Red Sea was in front of them and Pharaoh\'s army was behind them. Panic! But Moses told them to stand still and watch what God would do. Then God parted the sea and they walked across on dry ground. Sometimes God asks us to stop trying to fix everything ourselves and just trust Him. The most powerful position we can be in is standing still while God fights for us.',
                 'reflection_questions' => [
                     'Why do you think the Israelites were afraid even though God had already done so many miracles?',
                     'What does "stand still and see what God will do" look like in your daily life?',
                     'Can you think of a time God helped you when you didn\'t know what to do?',
                 ],
                 'prayer' => 'Lord, help me to be still when I feel surrounded. Remind me that You fight for me. I trust You. Amen.',
                ]],

            ['youth', 2, 'Faith in Action', 'Esther: For Such a Time as This',
                ['bible_reference' => 'Esther 4:14',
                 'bible_text'      => "And who knows but that you have come to your royal position for such a time as this?",
                 'explanation'     => 'Esther was an ordinary Jewish girl who became a queen in a foreign land. When her people faced genocide, her cousin Mordecai challenged her: maybe God placed her exactly here, exactly now, for a reason. To act she had to risk her own life. She chose to fast, pray, and step forward anyway. Esther teaches us that God places us in specific moments and situations not by accident. Your family, your school, your generation — these are your "such a time as this".',
                 'reflection_questions' => [
                     'What risks did Esther face by going to the king? How did her faith help her?',
                     'Where in your life might God be saying "I placed you here for a reason"?',
                     'What does Esther\'s example say about the relationship between prayer and action?',
                 ],
                 'prayer' => 'God, open my eyes to see where You have placed me on purpose. Give me the courage of Esther to act, even when it costs me something. Amen.',
                ]],

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 3  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 3, 'God Loves Us', 'Jesus Loves the Little Children',
                ['bible_reference' => 'Mark 10:14',
                 'bible_text'      => "Jesus said, 'Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.'",
                 'explanation'     => 'One day some parents brought their children to Jesus. The disciples thought Jesus was too busy for little kids. But Jesus stopped everything and called the children to come! He picked them up, hugged them, and blessed each one. Jesus loves children very, very much — and He loves YOU.',
                 'reflection_questions' => [
                     'How does it make you feel knowing that Jesus wanted children close to Him?',
                     'What would you say to Jesus if He were sitting right next to you?',
                 ],
                 'prayer' => 'Jesus, thank You for loving me. I want to be close to You, just like those children. I love You too. Amen.',
                ]],

            ['kids', 3, 'Heroes of Faith', 'Daniel in the Lions\' Den',
                ['bible_reference' => 'Daniel 6:22',
                 'bible_text'      => "My God sent his angel, and he shut the mouths of the lions. They have not hurt me, because I was found innocent in his sight.",
                 'explanation'     => 'King Darius was tricked into signing a law saying people could only pray to the king, not to God. Daniel knew about the law. He prayed anyway — three times a day, by the open window, just as he always had. He was thrown into a den of hungry lions. The next morning the king ran to the den and found Daniel completely unharmed. Daniel\'s faithfulness had a testimony that rang through the entire kingdom. Standing firm in our faith, even when it\'s against the rules, can be the very thing that shows others who God is.',
                 'reflection_questions' => [
                     'Daniel prayed even when it was dangerous. When is it hard for you to be open about your faith?',
                     'How do you think Daniel felt the night he was in the lions\' den?',
                     'What do you think the king and other people learned about God that day?',
                 ],
                 'prayer' => 'Lord, give me Daniel\'s courage to pray and trust You even when it is difficult. I want my life to be a testimony of Your protection. Amen.',
                ]],

            ['youth', 3, 'Faith in Action', 'The Sermon on the Mount: Kingdom Values',
                ['bible_reference' => 'Matthew 5:3–10',
                 'bible_text'      => "Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn... Blessed are the meek... Blessed are those who hunger and thirst for righteousness...",
                 'explanation'     => 'In the Beatitudes, Jesus completely flipped the world\'s value system. The world says: "Blessed are the powerful, the rich, the proud." Jesus says: "Blessed are the humble, the grieving, the meek." These are not just nice-sounding ideas — they are the DNA of the Kingdom. They describe what it looks like when God\'s reign actually operates in a human heart. A youth that internalises these values will be profoundly counter-cultural, and that\'s exactly the point.',
                 'reflection_questions' => [
                     'Which Beatitude challenges you the most personally, and why?',
                     'How do these values look different from what your school or social media celebrates?',
                     'If you fully lived one Beatitude this week, what would change in your relationships?',
                 ],
                 'prayer' => 'Jesus, I want the values of Your Kingdom to be my values. Reshape my desires — let me hunger for what You call blessed, not what the world calls successful. Amen.',
                ]],

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 4  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 4, 'God Loves Us', 'The Good Shepherd',
                ['bible_reference' => 'Psalm 23:1',
                 'bible_text'      => 'The LORD is my shepherd; I shall not want.',
                 'explanation'     => 'A shepherd takes care of his sheep every single day. He finds them green grass to eat, fresh water to drink, and he keeps them safe from wolves. Jesus said He is our Good Shepherd. That means He takes care of us every day — when we are hungry, when we are tired, when we are scared. We are never alone because our Shepherd is always watching over us.',
                 'reflection_questions' => [
                     'What does a shepherd do to take care of his sheep?',
                     'How does Jesus take care of YOU like a shepherd?',
                 ],
                 'prayer' => 'Jesus, You are my Good Shepherd. Thank You for taking care of me every day. I know You are always with me. Amen.',
                ]],

            ['kids', 4, 'Heroes of Faith', 'Noah and the Ark',
                ['bible_reference' => 'Genesis 6:22',
                 'bible_text'      => 'Noah did everything just as God commanded him.',
                 'explanation'     => 'God asked Noah to build a giant boat — on dry land, where there was no water. His neighbours must have laughed at him for years. But Noah obeyed, one plank at a time, trusting that God knew what He was talking about. Obedience to God often looks strange to the people around us. It requires us to trust God more than we trust our own understanding of how things should work. When the rain came, Noah\'s obedience saved his family — and a whole creation.',
                 'reflection_questions' => [
                     'How long do you think it took Noah to build the ark? What kept him going?',
                     'Can you think of something God asks us to do that might seem strange to others?',
                     'What is one area of your life where you need to obey God even when it\'s hard?',
                 ],
                 'prayer' => 'God, give me Noah\'s kind of obedience — the kind that keeps going even when others don\'t understand. Help me to trust Your instructions more than my own ideas. Amen.',
                ]],

            ['youth', 4, 'Faith in Action', 'Paul\'s Letter to the Romans: Grace and Identity',
                ['bible_reference' => 'Romans 8:38–39',
                 'bible_text'      => "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
                 'explanation'     => 'Paul wrote Romans from prison, staring down the possibility of execution. And from that place, he declared with total conviction: nothing can separate you from God\'s love. Not your worst failures. Not other people\'s rejection. Not depression, anxiety, or confusion about who you are. This is the foundation of Christian identity: before you are your grades, your reputation, your family situation, or your struggles — you are loved unconditionally by the God who created the universe. That cannot be taken away.',
                 'reflection_questions' => [
                     'What are the things in your life that sometimes make you feel less loved or less valuable?',
                     'Paul wrote this while imprisoned. How does that change the weight of what he wrote?',
                     'How would living fully convinced of God\'s love change the way you relate to peers or social pressure?',
                 ],
                 'prayer' => 'Father, I want to truly believe what Paul believed — that nothing can separate me from Your love. Replace my insecurities with the unshakeable truth of who I am in You. Amen.',
                ]],

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 5  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 5, 'God Loves Us', 'The Lost Sheep',
                ['bible_reference' => 'Luke 15:5',
                 'bible_text'      => 'And when he finds it, he joyfully puts it on his shoulders and goes home.',
                 'explanation'     => 'Jesus told a story about a shepherd who had 100 sheep. One little sheep got lost! The shepherd didn\'t say "oh well, I still have 99." He left all the others and went to search and search until he found the one little lost sheep. Then he picked it up, carried it home on his shoulders, and had a big party! That is how much God loves YOU. If you ever feel lost or forgotten, remember — God is searching for you.',
                 'reflection_questions' => [
                     'How did the shepherd feel when he found his lost sheep?',
                     'Have you ever felt lost or alone? What did you do?',
                 ],
                 'prayer' => 'God, thank You for always looking for me. Even when I feel alone, You are right there. Thank You for carrying me. Amen.',
                ]],

            ['kids', 5, 'God\'s Promises', 'Abraham: Trusting God\'s Promise',
                ['bible_reference' => 'Genesis 15:5–6',
                 'bible_text'      => "He took him outside and said, 'Look up at the sky and count the stars — if indeed you can count them.' Then he said to him, 'So shall your offspring be.' Abram believed the LORD, and he credited it to him as righteousness.",
                 'explanation'     => 'God promised Abraham he would have as many children as the stars in the sky. There was just one problem: Abraham and his wife Sarah were very old, and they had no children at all. The promise seemed impossible. But Abraham believed God anyway — and the Bible says that faith, that trusting God when it makes no earthly sense, was counted as righteousness. Abraham is called the "father of faith" because he hoped when there was nothing to hope in except God\'s word.',
                 'reflection_questions' => [
                     'Why is it sometimes hard to trust a promise we cannot see yet?',
                     'What promises from the Bible do you find most difficult to believe?',
                     'How does Abraham\'s faith encourage you to trust God\'s promises for your own life?',
                 ],
                 'prayer' => 'Lord, like Abraham, I want to believe You even when I cannot see how Your promises will come true. Strengthen my faith to trust Your Word. Amen.',
                ]],

            ['youth', 5, 'Faith in Action', 'Discipleship: The Cost and the Call',
                ['bible_reference' => 'Luke 9:23',
                 'bible_text'      => "Then he said to them all: 'Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.'",
                 'explanation'     => 'Jesus never promised that following Him would be easy or comfortable. He used the image of a cross — an instrument of execution — to describe discipleship. The call to follow Jesus is a call to die to self-centred living and rise into a God-centred life. This is not just a one-time decision; it\'s a daily choice. Every morning we choose whether to live for ourselves or to live for something bigger. The paradox Jesus teaches is this: the life you lose for His sake is the only life worth having.',
                 'reflection_questions' => [
                     'What do you think Jesus meant by "deny yourself"? What does that look like for a student today?',
                     'What "cross" might God be asking you to carry in your current season of life?',
                     'What is the difference between following Jesus as a lifestyle versus following Him as a commitment?',
                 ],
                 'prayer' => 'Jesus, I want to follow You — not just when it\'s easy, but every day. Help me to choose Your way over my own comfort. I take up my cross today. Amen.',
                ]],

            // ━━━━━━━━━━━━━━━━━━━━━━  WEEK 6  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ['nursery', 6, 'God Loves Us', 'God Is Always With Me',
                ['bible_reference' => 'Joshua 1:9',
                 'bible_text'      => 'Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
                 'explanation'     => 'Did you know God goes with you everywhere? To school, to the playground, to your bedroom at night — God is always right there with you. You never have to be scared because God said, "I will be with you." That\'s a promise that never runs out!',
                 'reflection_questions' => [
                     'Where is a place that sometimes feels scary? Can you remember that God is there with you?',
                     'How can we remember that God is with us throughout the day?',
                 ],
                 'prayer' => 'God, thank You that You go with me everywhere. When I feel scared, remind me that You are right there. Amen.',
                ]],

            ['kids', 6, 'God\'s Promises', 'Solomon Asks for Wisdom',
                ['bible_reference' => '1 Kings 3:9',
                 'bible_text'      => "So give your servant a discerning heart to govern your people and to distinguish between right and wrong.",
                 'explanation'     => 'When Solomon became king, God appeared to him and said: "Ask for whatever you want and I will give it to you." Solomon could have asked for riches, fame, or power. Instead he asked for wisdom — the ability to know right from wrong and lead people well. God was so pleased that He gave Solomon wisdom AND the riches Solomon hadn\'t even asked for. God loves it when we prioritise what matters most: knowing Him and knowing how to live well.',
                 'reflection_questions' => [
                     'If God offered you anything you wanted, what would you ask for? Why?',
                     'Why do you think God was pleased that Solomon asked for wisdom?',
                     'What is one area of your life where you need more wisdom right now?',
                 ],
                 'prayer' => 'God, like Solomon, I ask You for wisdom. Help me to know right from wrong and to make choices that honour You. Amen.',
                ]],

            ['youth', 6, 'Faith in Action', 'The Holy Spirit: Power to Live Differently',
                ['bible_reference' => 'Galatians 5:22–23',
                 'bible_text'      => "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
                 'explanation'     => 'The Christian life is not about trying harder to be good. It is about yielding to the Holy Spirit who produces goodness IN us. The nine fruits Paul lists aren\'t achieved by willpower — they are grown by relationship with God. A tree doesn\'t try to produce fruit; it stays connected to the soil and the fruit comes naturally. Our job is to stay connected: in prayer, in Scripture, in community. The Spirit then does what only He can do — transforms us from the inside out.',
                 'reflection_questions' => [
                     'Which fruit of the Spirit do you feel most evident in your life? Which feels most lacking?',
                     'What is the difference between "trying to be more loving" and "asking the Spirit to produce love in you"?',
                     'What practical habits help you stay "connected to the vine" so the Spirit can work in you?',
                 ],
                 'prayer' => 'Holy Spirit, I cannot produce this fruit on my own. I stay connected to You today. Grow in me what only You can grow. Amen.',
                ]],
        ];

        // ── Create lessons ────────────────────────────────────────────────────
        foreach ($lessons as [$ageGroup, $week, $series, $title, $content]) {
            $lesson = Lesson::create([
                'created_by'   => $admin->id,
                'title'        => $title,
                'series'       => $series,
                'week_number'  => $week,
                'age_group'    => $ageGroup,
                'is_published' => true,
                'published_at' => now()->subDays(rand(1, 60)),
            ]);

            $lesson->content()->create([
                'bible_reference'      => $content['bible_reference'],
                'bible_text'           => $content['bible_text'],
                'explanation'          => $content['explanation'],
                'reflection_questions' => $content['reflection_questions'],
                'prayer'               => $content['prayer'],
            ]);
        }

        // ── One draft lesson (for admin UI testing) ───────────────────────────
        $draft = Lesson::create([
            'created_by'   => $admin->id,
            'title'        => 'The Armour of God (DRAFT)',
            'series'       => 'Faith in Action',
            'week_number'  => 7,
            'age_group'    => 'youth',
            'is_published' => false,
            'published_at' => null,
        ]);

        $draft->content()->create([
            'bible_reference'      => 'Ephesians 6:11',
            'bible_text'           => 'Put on the full armour of God, so that you can take your stand against the devil\'s schemes.',
            'explanation'          => 'Draft — explanation coming soon.',
            'reflection_questions' => ['Placeholder question 1', 'Placeholder question 2'],
            'prayer'               => 'Draft prayer.',
        ]);
    }
}