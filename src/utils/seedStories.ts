import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Story from '../models/storyModel';

dotenv.config();

const stories = [
    {
        title: 'My Morning Routine',
        text: `I wake up at 7 every morning. The first thing I do is turn off my alarm and stretch for a few minutes. Then I go to the bathroom to brush my teeth and wash my face.

After that, I take a shower and get dressed for the day. I usually have a simple breakfast. Sometimes I eat eggs and bread, and sometimes I just have a cup of coffee.

At around 8 o’clock, I leave my house and go to work. I usually listen to music or a podcast on my way. This routine helps me start my day feeling calm and ready.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476343/My_Morning_Routine_bn0ssy.mp3',
        order: 1,
    },
    {
        title: 'At the Coffee Shop',
        text: `Yesterday, I went to a coffee shop near my house. It was a small and cozy place with soft music playing in the background.

I ordered a cappuccino and a piece of cake. I found a seat near the window and sat down. I like sitting by the window because I can watch people walking outside.

While I was there, I checked my phone and read some messages. After about an hour, I finished my coffee and left the shop feeling refreshed.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476643/At_the_Coffee_Shop_hjwwyj.mp3',
        order: 2,
    },
    {
        title: 'My First Day at Work',
        text: `I remember my first day at work very clearly. I was very nervous and excited at the same time.

I woke up early and spent extra time getting ready because I wanted everything to be perfect. When I arrived at the office, I was a bit scared.

However, my manager greeted me with a big smile and introduced me to the team. Everyone was friendly, which helped me feel more comfortable.

By the end of the day, I felt proud of myself and more confident.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476658/My_First_Day_at_Work_eataqf.mp3',
        order: 3,
    },
    {
        title: 'At the Airport',
        text: `Last month, I traveled to another country for the first time. I arrived at the airport two hours before my flight because I didn’t want to be late.

The airport was very busy, and there were many people everywhere. First, I checked in my luggage and got my boarding pass.

Then I went through security, which took some time. After that, I walked around the airport and looked at the shops.

While I was waiting, I bought a coffee and watched the planes take off.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476778/At_the_Airport_ptxdpy.mp3',
        order: 4,
    },
    {
        title: 'A Difficult Decision',
        text: `Last year, I had to make a very difficult decision about my career. I had been working in the same job for several years.

Although it was stable, I didn’t feel happy anymore. I started thinking about changing my career path, but I was afraid.

After talking to my friends and thinking carefully, I decided to take a risk and try something new.

It was not easy, but it was the right decision for me.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476781/A_Difficult_Decision_kgkwvi.mp3',
        order: 5,
    },
    {
        title: 'Meeting an Old Friend',
        text: `A few weeks ago, I met an old friend that I hadn’t seen for many years. We used to be very close.

When we met again, it felt like no time had passed. We talked about our memories and laughed a lot.

We also shared stories about our lives now and our future plans. It was a very emotional and happy experience.

This meeting reminded me how important friendships are.`,
        audioUrl: 'https://res.cloudinary.com/dhdjubh8a/video/upload/v1774476772/Meeting_an_Old_Friend_o6p5a9.mp3',
        order: 6,
    },
];

const DB = process.env.DATABASE_URL!.replace(
    '<DATABASE_PASSWORD>',
    process.env.DATABASE_PASSWORD!
);

const seedStories = async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB connected');

        await Story.deleteMany();
        console.log('Old stories deleted');

        await Story.insertMany(stories);
        console.log('Stories seeded successfully');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedStories();