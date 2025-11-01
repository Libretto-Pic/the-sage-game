
import React from 'react';
import type { BreathingStyle, MissionCategory } from './types';

export const MISSION_CATEGORIES: MissionCategory[] = ['Health', 'Wealth', 'Mind'];
export const XP_PER_LEVEL = 100;

// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file extension.
// The TypeScript compiler cannot parse JSX in .ts files; it requires a .tsx extension.
// Using React.createElement is the equivalent of JSX and resolves the parsing errors.
const EternalBreathIcon: React.FC<{className?: string}> = ({ className }) => {
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
        d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    }));
};
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

export const BREATHING_STYLES: BreathingStyle[] = [
    {
        name: 'The Eternal Breath',
        description: 'The foundational technique for calming the mind.',
        unlockLevel: 30,
        icon: EternalBreathIcon,
        technique: 'A simple box breathing technique. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat.',
        whenToUse: 'Use when feeling scattered, anxious, or overwhelmed. Excellent for starting or ending your day.',
        structuredTechnique: {
            reps: 7,
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 4 },
                { type: 'Exhale', duration: 4 },
                { type: 'Hold', duration: 4 },
            ]
        }
    },
    {
        name: 'The Stone Fortress',
        description: 'A technique for building focus and resilience.',
        unlockLevel: 40,
        icon: StoneFortressIcon,
        technique: 'A powerful, grounding breath. Inhale deeply through the nose, then a forceful, short exhale through the mouth.',
        whenToUse: 'Before a difficult task, a challenging conversation, or when you need to summon inner strength and resolve.',
    },
    {
        name: 'The River of Clarity',
        description: 'A technique to clear mental fog and enhance insight.',
        unlockLevel: 50,
        icon: RiverOfClarityIcon,
        technique: 'A longer exhale focused breath. Inhale for 4 seconds, then a slow, controlled exhale for 8 seconds.',
        whenToUse: 'During moments of confusion, creative blocks, or when you need to see a problem from a new perspective.',
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
