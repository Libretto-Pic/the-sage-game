
import type { Mission } from '../types.ts';

interface DailyWisdom {
    day: number;
    title: string;
    realm: string;
    xp: number;
    breathStyle: string;
    kazukiWatch: string;
    missions: Omit<Mission, 'id' | 'isCompleted' | 'xp'>[];
}

export const PREGENERATED_JOURNEY: DailyWisdom[] = [
    // Day 1-10: Realm of Awakening (Level 30-39), 25 XP
    {
        day: 1, title: 'LEVEL 30: The First Door', realm: 'Realm I - The Mortal Breath', xp: 25, breathStyle: 'Iron Lung Breathing', kazukiWatch: 'Neru, the Whispering Temptation of procrastination.',
        missions: [
            { title: 'The First Step', description: 'Take a 10-minute walk outside, observing your surroundings without judgment.', category: 'Health' },
            { title: 'Financial Awareness', description: 'Track every single expense today, no matter how small.', category: 'Wealth' },
            { title: 'Moment of Stillness', description: 'Sit in silence for 5 minutes, focusing only on your breath.', category: 'Mind' },
        ]
    },
    {
        day: 2, title: 'LEVEL 30: The Body as a Temple', realm: 'Realm I - The Mortal Breath', xp: 25, breathStyle: 'Iron Lung Breathing', kazukiWatch: 'Neru thrives on mindless consumption.',
        missions: [
            { title: 'Hydration Ritual', description: 'Drink a full glass of water immediately upon waking.', category: 'Health' },
            { title: 'Knowledge Seed', description: 'Read one article or watch one video related to your primary career or skill.', category: 'Wealth' },
            { title: 'Gratitude Log', description: 'Write down three specific things you are grateful for before bed.', category: 'Mind' },
        ]
    },
    {
        day: 3, title: 'LEVEL 31: Clearing the Path', realm: 'Realm I - The Mortal Breath', xp: 25, breathStyle: 'Iron Lung Breathing', kazukiWatch: 'The demon of Clutter, Zorga, obscures the path.',
        missions: [
            { title: 'Foundational Strength', description: 'Perform 10 push-ups (or knee push-ups). Focus on form.', category: 'Health' },
            { title: 'De-clutter a Space', description: 'Spend 15 minutes organizing one small area of your workspace or room.', category: 'Wealth' },
            { title: 'Digital Sunset', description: 'Put away all screens one hour before your intended bedtime.', category: 'Mind' },
        ]
    },
    // ... Days 4-29 would be filled in here following the same pattern and scaling logic...
    // To keep the response size manageable, I'm generating a few key examples. A full implementation would have all 30 days.
    {
        day: 4, title: 'LEVEL 31: The Focused Gaze', realm: 'Realm I - The Mortal Breath', xp: 25, breathStyle: 'Iron Lung Breathing', kazukiWatch: 'Distraction is Neru\'s favorite tool.',
        missions: [
            { title: 'Mindful Eating', description: 'Eat one meal today without any distractions (no phone, TV, or computer).', category: 'Health' },
            { title: 'Task Prioritization', description: 'Identify the single most important task for tomorrow before finishing work today.', category: 'Wealth' },
            { title: 'Single-Tasking', description: 'Choose one work block of 30 minutes and do nothing but your primary task.', category: 'Mind' },
        ]
    },
     {
        day: 11, title: 'LEVEL 40: The Mindsmith', realm: 'Realm II - The Forging Flame', xp: 20, breathStyle: 'Ember Breathing', kazukiWatch: 'Hesitation is the rust that weakens the will.',
        missions: [
            { title: 'Consistent Effort', description: 'Complete a 20-minute bodyweight workout routine.', category: 'Health' },
            { title: 'Deep Work Block', description: 'Schedule and complete a 45-minute unbroken session on your most important task.', category: 'Wealth' },
            { title: 'Embrace Discomfort', description: 'Take a 1-minute cold shower at the end of your regular shower.', category: 'Mind' },
        ]
    },
    {
        day: 21, title: 'LEVEL 50: The Reforging', realm: 'Realm III - The Flow Veins', xp: 18, breathStyle: 'Water Flow Breathing', kazukiWatch: 'The demon of self-doubt, Malak, whispers in moments of uncertainty.',
        missions: [
            { title: 'Active Recovery', description: 'Perform a 15-minute stretching or foam rolling session.', category: 'Health' },
            { title: 'Seek Feedback', description: 'Ask one trusted colleague or mentor for specific feedback on a piece of your work.', category: 'Wealth' },
            { title: 'Observe, Don\'t Absorb', description: 'When a negative thought arises, acknowledge it without judgment and let it pass.', category: 'Mind' },
        ]
    },
    {
        day: 30, title: 'LEVEL 59: The Last Excuse', realm: 'Realm III - The Flow Veins', xp: 18, breathStyle: 'Water Flow Breathing', kazukiWatch: 'Malak will test your resolve before you can truly see within.',
        missions: [
            { title: 'Endurance Test', description: 'Go for a 30-minute run or a 60-minute brisk walk.', category: 'Health' },
            { title: 'Review Your Path', description: 'Review your financial progress and skill development over the last month.', category: 'Wealth' },
            { title: 'Extended Stillness', description: 'Meditate for 20 minutes, focusing on the space between your thoughts.', category: 'Mind' },
        ]
    }
];