import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Level from '../models/levelModel';

dotenv.config();

const levels = [
    {
        levelNumber: 1,
        title: 'Work & Career',
        description: 'Top 25 sentences in the workplace',
        sentences: [
            { text: 'I have a meeting at 9 AM.', translation: 'عندي اجتماع الساعة 9 الصبح.' },
            { text: 'Can you send me the report?', translation: 'ممكن تبعتلي التقرير؟' },
            { text: 'I will finish this task by tomorrow.', translation: 'هخلص المهمة دي بكرة.' },
            { text: 'Let\'s schedule a call.', translation: 'خلينا نحدد موعد مكالمة.' },
            { text: 'I am working on it.', translation: 'أنا شغال عليه.' },
        ],
        quiz: [
            {
                question: 'What does "I have a meeting" mean?',
                options: ['A day off', 'A meeting', 'A project', 'An appointment'],
                correctAnswer: 'A meeting',
            },
            {
                question: 'Which sentence means you will complete work tomorrow?',
                options: [
                    'I will start this task tomorrow.',
                    'I finished this task yesterday.',
                    'I will finish this task by tomorrow.',
                    'I am working on this task.',
                ],
                correctAnswer: 'I will finish this task by tomorrow.',
            },
        ],
    },
    {
        levelNumber: 2,
        title: 'Daily Routine',
        description: 'Top 25 sentences for daily routine',
        sentences: [
            { text: 'I wake up at 7 every morning.', translation: 'بصحى الساعة 7 كل صبح.' },
            { text: 'I usually have coffee before work.', translation: 'عادةً بشرب قهوة قبل الشغل.' },
            { text: 'I go to the gym three times a week.', translation: 'بروح الجيم تلت مرات في الأسبوع.' },
            { text: 'What time do you go to bed?', translation: 'بتنام الساعة كام؟' },
            { text: 'I take a shower every morning.', translation: 'بستحمى كل صبح.' },
        ],
        quiz: [
            {
                question: 'What does "I wake up at 7" mean?',
                options: ['I sleep at 7', 'I wake up at 7', 'I go to work at 7', 'I come back at 7'],
                correctAnswer: 'I wake up at 7',
            },
            {
                question: 'Which sentence asks about sleep time?',
                options: [
                    'What time do you wake up?',
                    'What time do you eat?',
                    'What time do you go to bed?',
                    'What time do you shower?',
                ],
                correctAnswer: 'What time do you go to bed?',
            },
        ],
    },
    {
        levelNumber: 3,
        title: 'Shopping & Money',
        description: 'Top 25 sentences for shopping and money',
        sentences: [
            { text: 'How much does this cost?', translation: 'ده بكام؟' },
            { text: 'Do you accept credit cards?', translation: 'بتقبلوا كريدت كارد؟' },
            { text: 'I am looking for a gift.', translation: 'أنا بدور على هدية.' },
            { text: 'Can I get a discount?', translation: 'ممكن آخد خصم؟' },
            { text: 'I will pay in cash.', translation: 'هدفع كاش.' },
        ],
        quiz: [
            {
                question: 'Which sentence asks about the price?',
                options: [
                    'Where is this?',
                    'How much does this cost?',
                    'Can I buy this?',
                    'What is this?',
                ],
                correctAnswer: 'How much does this cost?',
            },
            {
                question: 'What does "I will pay in cash" mean?',
                options: [
                    'I will pay by card.',
                    'I will pay online.',
                    'I will pay in cash.',
                    'I will pay later.',
                ],
                correctAnswer: 'I will pay in cash.',
            },
        ],
    },
    {
        levelNumber: 4,
        title: 'Health & Body',
        description: 'Top 25 sentences for health and the body',
        sentences: [
            { text: 'I have a headache.', translation: 'عندي صداع.' },
            { text: 'I need to see a doctor.', translation: 'محتاج أشوف دكتور.' },
            { text: 'Take this medicine twice a day.', translation: 'خد الدواء ده مرتين في اليوم.' },
            { text: 'I don\'t feel well today.', translation: 'مش حاسس بخير النهارده.' },
            { text: 'How long have you had this pain?', translation: 'الألم ده من إمتى؟' },
        ],
        quiz: [
            {
                question: 'What does "I have a headache" mean?',
                options: ['I have a fever', 'I have a headache', 'I have back pain', 'I have a cold'],
                correctAnswer: 'I have a headache',
            },
            {
                question: 'Which sentence means you are not feeling good?',
                options: [
                    'I feel great today.',
                    'I don\'t feel well today.',
                    'I am very tired.',
                    'I need some rest.',
                ],
                correctAnswer: 'I don\'t feel well today.',
            },
        ],
    },
    {
        levelNumber: 5,
        title: 'Travel & Places',
        description: 'Top 25 sentences for travel and places',
        sentences: [
            { text: 'Where is the nearest hotel?', translation: 'فين أقرب فندق؟' },
            { text: 'I would like to book a room.', translation: 'عايز أحجز أوضة.' },
            { text: 'What time does the flight leave?', translation: 'الطيارة بتقوم الساعة كام؟' },
            { text: 'Can you call me a taxi?', translation: 'ممكن تطلبلي تاكسي؟' },
            { text: 'I lost my passport.', translation: 'باسبوري اتضاع.' },
        ],
        quiz: [
            {
                question: 'Which sentence is used to book a hotel room?',
                options: [
                    'I want to check out.',
                    'I would like to book a room.',
                    'Where is my room?',
                    'I need a bigger room.',
                ],
                correctAnswer: 'I would like to book a room.',
            },
            {
                question: 'What does "I lost my passport" mean?',
                options: [
                    'I forgot my passport at home.',
                    'I lost my passport.',
                    'I need a new passport.',
                    'My passport expired.',
                ],
                correctAnswer: 'I lost my passport.',
            },
        ],
    },
    {
        levelNumber: 6,
        title: 'Social & Relationships',
        description: 'Top 25 sentences for social situations',
        sentences: [
            { text: 'It was nice meeting you.', translation: 'كان تشريف إني قابلتك.' },
            { text: 'How long have you known each other?', translation: 'بتعرفوا بعض من إمتى؟' },
            { text: 'We should hang out sometime.', translation: 'المفروض نتقابل يوم.' },
            { text: 'I really appreciate your help.', translation: 'أنا ممنونك جداً على مساعدتك.' },
            { text: 'Let\'s keep in touch.', translation: 'خلينا على تواصل.' },
        ],
        quiz: [
            {
                question: 'What does "Let\'s keep in touch" mean?',
                options: [
                    'Let\'s meet up soon.',
                    'Let\'s stay in contact.',
                    'Let\'s talk right now.',
                    'Let\'s become friends.',
                ],
                correctAnswer: 'Let\'s stay in contact.',
            },
            {
                question: 'Which sentence expresses gratitude?',
                options: [
                    'It was nice meeting you.',
                    'We should hang out sometime.',
                    'I really appreciate your help.',
                    'Let\'s keep in touch.',
                ],
                correctAnswer: 'I really appreciate your help.',
            },
        ],
    },
    {
        levelNumber: 7,
        title: 'Advanced Conversations',
        description: 'Top 25 sentences for advanced conversations',
        sentences: [
            { text: 'I see where you\'re coming from.', translation: 'أنا فاهم وجهة نظرك.' },
            { text: 'Could you elaborate on that?', translation: 'ممكن توضحلي أكتر؟' },
            { text: 'That\'s an interesting perspective.', translation: 'دي وجهة نظر مثيرة للاهتمام.' },
            { text: 'I\'d like to reconsider that.', translation: 'عايز أعيد التفكير في ده.' },
            { text: 'Let\'s look at this from another angle.', translation: 'خلينا نبص على الموضوع من زاوية تانية.' },
        ],
        quiz: [
            {
                question: 'What does "Could you elaborate on that?" mean?',
                options: [
                    'Could you repeat that?',
                    'Could you explain more?',
                    'Could you speak slower?',
                    'Could you write that down?',
                ],
                correctAnswer: 'Could you explain more?',
            },
            {
                question: 'Which sentence means you understand someone\'s point of view?',
                options: [
                    'That\'s an interesting perspective.',
                    'I see where you\'re coming from.',
                    'I\'d like to reconsider that.',
                    'Let\'s look at this from another angle.',
                ],
                correctAnswer: 'I see where you\'re coming from.',
            },
        ],
    },
];

const DB = process.env.DATABASE_URL!.replace('<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD!
);

const seedLevels = async () => {
    try {
        await mongoose.connect(DB as string);
        console.log('DB connected');

        await Level.deleteMany();
        console.log('Old levels deleted');

        await Level.insertMany(levels);
        console.log('7 levels seeded successfully');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLevels();