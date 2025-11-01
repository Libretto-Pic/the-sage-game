// Implemented constants for game mechanics, realms, and breathing techniques.
import type { Realm, BreathingStyle } from './types';
import React from 'react';

const HeartIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor"
}, React.createElement('path', {
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
}));

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor"
}, React.createElement('path', {
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
}));

const BrainIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor"
}, React.createElement('path', {
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
}));

const ShieldIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor"
}, React.createElement('path', {
    strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
}));


export const XP_PER_LEVEL = 100;

export const REALMS: Realm[] = [
    { name: 'Realm of Awakening', levelRange: 'Levels 30-39', theme: 'Break the shackles of modern life and discover your inner power.' },
    { name: 'Realm of Discipline', levelRange: 'Levels 40-49', theme: 'Forge unwavering consistency and build systems for success.' },
    { name: 'Realm of Resilience', levelRange: 'Levels 50-59', theme: 'Face adversity head-on and learn to bend without breaking.' },
    { name: 'Realm of Insight', levelRange: 'Levels 60-69', theme: 'Look within to understand your patterns, triggers, and true motivations.' },
    { name: 'Realm of Flow', levelRange: 'Levels 70-79', theme: 'Master the art of effortless action and deep, focused work.' },
    { name: 'Realm of Connection', levelRange: 'Levels 80-89', theme: 'Strengthen your bonds with others and the world around you.' },
    { name: 'Realm of Sagehood', levelRange: 'Levels 90-100', theme: 'Integrate your wisdom and become a beacon of clarity and purpose.' },
];

export const BREATHING_STYLES: BreathingStyle[] = [
    {
        name: 'The Eternal Breath',
        description: 'The foundational technique for centering the mind.',
        technique: 'A simple, deep, and rhythmic breath that anchors you in the present moment. Inhale through the nose for 4 seconds, hold for 4, exhale through the mouth for 6.',
        whenToUse: 'Anytime you feel overwhelmed, distracted, or lost in "The Fog of Modern Life". Use as a daily ritual.',
        unlockLevel: 30,
        icon: HeartIcon,
        structuredTechnique: {
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 4 },
                { type: 'Exhale', duration: 6 },
            ],
            reps: 5
        }
    },
    {
        name: 'The Stone Fortress',
        description: 'Builds resilience and mental fortitude.',
        technique: 'Box breathing. Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Visualise a solid, unshakeable fortress with each cycle.',
        whenToUse: 'Before a difficult task, during a stressful situation, or when you need to endure.',
        unlockLevel: 40,
        icon: ShieldIcon,
        structuredTechnique: {
            steps: [
                { type: 'Inhale', duration: 4 },
                { type: 'Hold', duration: 4 },
                { type: 'Exhale', duration: 4 },
                { type: 'Hold', duration: 4 },
            ],
            reps: 5
        }
    },
    {
        name: 'The River of Clarity',
        description: 'Clears mental clutter and enhances focus.',
        technique: 'A powerful, quick exhale followed by a long, passive inhale. Focus on the sharp expulsion of air to clear your thoughts like a river washing away debris.',
        whenToUse: 'When your mind is racing, you feel creatively blocked, or before a deep work session.',
        unlockLevel: 50,
        icon: BrainIcon,
        structuredTechnique: null
    },
    {
        name: 'The Sun\'s Radiance',
        description: 'Energizes the body and uplifts the spirit.',
        technique: 'A series of short, sharp exhales through the nose while pulling the abdomen in, followed by passive inhales. A rapid, energizing rhythm.',
        whenToUse: 'When feeling sluggish, tired, or in need of a natural energy boost. Avoid before sleep.',
        unlockLevel: 60,
        icon: SparklesIcon,
        structuredTechnique: null
    }
];

export const MISSION_CATEGORIES = ['Health', 'Wealth', 'Mind'];