
import React from 'react';
import type { BreathingStyle, MissionCategory } from './types';

export const MISSION_CATEGORIES: MissionCategory[] = ['Health', 'Wealth', 'Mind'];
export const XP_PER_LEVEL = 100;

// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file extension.
// The TypeScript compiler cannot parse JSX in .ts files; it requires a .tsx extension.
// Using React.createElement is the equivalent of JSX and resolves the parsing errors.
const StoneFortressIcon: React.FC<{className?: string}> = ({ className }) => {
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }));
};
const RiverOfClarityIcon: React.FC<{className?: string}> = ({ className }) => {
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.76 11h8.48a2 2 0 002-2V7a2 2 0 00-2-2h-8.48a2 2 0 00-2 2v2a2 2 0 002 2z"
    }));
};

const BreathOfIronIcon: React.FC<{className?: string}> = ({ className }) => { // Lightning bolt for energy/activation
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M13 10V3L4 14h7v7l9-11h-7z"
    }));
};
const BreathOfFireIcon: React.FC<{className?: string}> = ({ className }) => { // Flame for 'fire'
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"
    }));
};
const BreathOfSunIcon: React.FC<{className?: string}> = ({ className }) => { // Sun
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    }));
};
const VitalFlowIcon: React.FC<{className?: string}> = ({ className }) => { // Icon for balance/total control
    return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
    }, React.createElement('path', {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    }));
};


export const BREATHING_STYLES: BreathingStyle[] = [
    {
        name: 'Breath of Stone (Box Breathing)',
        description: 'Balances oxygen and CO2, slows heart rate, centers mind.',
        unlockLevel: 30,
        icon: StoneFortressIcon,
        technique: 'A simple box breathing technique. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat.',
        whenToUse: 'When angry, insulted, or provoked. Builds unshakeable composure.',
        structuredTechnique: {
            reps: 10,
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 4 },
                { type: 'Exhale', duration: 4 },
                { type: 'Hold', duration: 4 },
            ]
        }
    },
    {
        name: 'Breath of Wind',
        description: 'Activate parasympathetic system, restore focus.',
        unlockLevel: 32,
        icon: RiverOfClarityIcon,
        technique: 'Inhale gently for 4s, hold for 2s, and exhale slowly for 8s. The long exhale physically tells your brain you\'re safe.',
        whenToUse: 'When anxious, overwhelmed, or distracted.',
        structuredTechnique: {
            reps: 13, // Approx 3 minutes
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 2 },
                { type: 'Exhale', duration: 8 },
            ]
        }
    },
    {
        name: 'Breath of Iron',
        description: 'Builds willpower and stabilizes the body under stress.',
        unlockLevel: 40,
        icon: BreathOfIronIcon,
        technique: 'Inhale deeply for 4s, hold for 4s, then exhale powerfully through the mouth for 6-8s. Triggers controlled adrenaline release to build grit.',
        whenToUse: 'Before tough work, workouts, or moments of resistance.',
        structuredTechnique: {
            reps: 15,
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 4 },
                { type: 'Exhale', duration: 7 },
            ]
        }
    },
    {
        name: 'Breath of Fire',
        description: 'Energize the mind and wake up confidence.',
        unlockLevel: 45,
        icon: BreathOfFireIcon,
        technique: 'Kapalabhati-style. Sit straight. Inhale normally. Then perform 30-50 short, fast, forceful exhales through the nose by contracting your lower belly (about 1 per second). Rest for 30 seconds. Repeat for 3 rounds. Do not practice right after meals or if you have high blood pressure.',
        whenToUse: 'Before hard actions like public speaking, workouts, or confronting someone.',
    },
    {
        name: 'Breath of Sun',
        description: 'Shift mindset from suffering to strength, release mental tension.',
        unlockLevel: 55,
        icon: BreathOfSunIcon,
        technique: 'Inhale deeply through the nose for 6s, hold for 2s while silently thinking of one thing you are grateful for, then exhale gently through the mouth for 8s.',
        whenToUse: 'At the end of the day or after an emotional struggle.',
        structuredTechnique: {
            reps: 18, // Approx 5 minutes
            steps: [
                { type: 'Inhale', duration: 6 },
                { type: 'Hold', duration: 2 },
                { type: 'Exhale', duration: 8 },
            ]
        }
    },
    {
        name: 'Vital Flow Breathing (VFB)',
        description: 'A hybrid technique for 24/7 discipline. Balances oxygen, CO₂, and the nervous system for calm alertness.',
        unlockLevel: 65,
        icon: VitalFlowIcon,
        technique: 'Core Pattern: Inhale (4s, belly then chest), hold (2s, feel solar plexus), exhale (6s, slow & complete), hold (2s, stay relaxed).',
        whenToUse: 'Use one round between tasks to reset focus or four rounds before sleep to cleanse mental noise. The ultimate goal is for this to become your automatic, background breathing pattern.',
        structuredTechnique: {
            reps: 12,
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 2 },
                { type: 'Exhale', duration: 6 },
                { type: 'Hold', duration: 2 },
            ]
        }
    },
];

export const REALMS = [
  { levelRange: 'Levels 30-39', name: 'Realm of Awakening', theme: 'The first steps out of the fog. Focus is on building awareness and foundational habits.' },
  { levelRange: 'Levels 40-49', name: 'Realm of Discipline', theme: 'The forge of will. This realm tests your consistency and commitment to the path.' },
  { levelRange: 'Levels 50-59', name: 'Realm of Resilience', theme: 'Facing inner demons. Learn to navigate setbacks and emotional turmoil without losing your way.' },
  { levelRange: 'Levels 60-69', name: 'Realm of Insight', theme: 'Connecting the dots. Deeper understanding of the self and the patterns that govern your life.' },
  { levelRange: 'Levels 70-79', name: 'Realm of Mastery', theme: 'Sharpening the blade. Honing your skills and habits to a fine edge, achieving effortless execution.' },
  { levelRange: 'Levels 80-89', name: 'Realm of Influence', theme: 'The Sage gives back. Your inner strength begins to positively impact those around you.' },
  { levelRange: 'Levels 90-100', name: 'Realm of Enlightenment', theme: 'Transcending the self. The path becomes the destination. True peace and clarity are within reach.' },
];
