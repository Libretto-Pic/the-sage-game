
import React from 'react';
import type { PlayerState, Achievement } from '../types.ts';
import { BREATHING_STYLES } from './lore.ts';

// Re-using an icon from another component, a shield seems appropriate for achievements.
const AchievementIcon: React.FC<{className?: string}> = ({ className }) => {
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


export const ALL_ACHIEVEMENTS: Achievement[] = [
    // Mission Completion
    { id: 'missions_10', name: 'Dedicated Initiate', description: 'Complete 10 missions.', icon: AchievementIcon },
    { id: 'missions_50', name: 'Seasoned Wanderer', description: 'Complete 50 missions.', icon: AchievementIcon },
    { id: 'missions_100', name: 'Hundred-Quest Hero', description: 'Complete 100 missions.', icon: AchievementIcon },

    // Level Milestones
    { id: 'level_40', name: 'Disciple of Discipline', description: 'Reach Level 40 and enter the Realm of Discipline.', icon: AchievementIcon },
    { id: 'level_50', name: 'Resilient Soul', description: 'Reach Level 50 and enter the Realm of Resilience.', icon: AchievementIcon },
    { id: 'level_60', name: 'Seeker of Insight', description: 'Reach Level 60 and enter the Realm of Insight.', icon: AchievementIcon },
    { id: 'level_70', name: 'Master in Making', description: 'Reach Level 70 and enter the Realm of Mastery.', icon: AchievementIcon },
    { id: 'level_80', name: 'Beacon of Influence', description: 'Reach Level 80 and enter the Realm of Influence.', icon: AchievementIcon },
    { id: 'level_90', name: 'Almost Enlightened', description: 'Reach Level 90 and enter the Realm of Enlightenment.', icon: AchievementIcon },
    { id: 'level_100', name: 'The Sage', description: 'Reach Level 100 and achieve true self-mastery.', icon: AchievementIcon },

    // Streaks & Consistency
    { id: 'days_7', name: 'Weekly Ritualist', description: 'Complete 7 consecutive days on the path.', icon: AchievementIcon },
    { id: 'days_30', name: 'Monthly Pilgrim', description: 'Complete 30 consecutive days on the path.', icon: AchievementIcon },

    // Journaling
    { id: 'journal_1', name: 'The First Reflection', description: 'Write your first journal entry.', icon: AchievementIcon },
    { id: 'journal_10', name: 'Chronicler', description: 'Write 10 journal entries.', icon: AchievementIcon },

    // Breathing Styles
    { id: 'codex_master', name: 'Breath Master', description: 'Unlock all breathing styles in the Codex.', icon: AchievementIcon },
];

export const ACHIEVEMENT_CONDITIONS: Record<string, (playerState: PlayerState) => boolean> = {
    // Mission Completion
    missions_10: (p) => p.completedMissionHistory.length >= 10,
    missions_50: (p) => p.completedMissionHistory.length >= 50,
    missions_100: (p) => p.completedMissionHistory.length >= 100,

    // Level Milestones
    level_40: (p) => p.level >= 40,
    level_50: (p) => p.level >= 50,
    level_60: (p) => p.level >= 60,
    level_70: (p) => p.level >= 70,
    level_80: (p) => p.level >= 80,
    level_90: (p) => p.level >= 90,
    level_100: (p) => p.level >= 100,

    // Streaks & Consistency
    days_7: (p) => p.day >= 7,
    days_30: (p) => p.day >= 30,

    // Journaling
    journal_1: (p) => p.journalEntries.length >= 1,
    journal_10: (p) => p.journalEntries.length >= 10,

    // Breathing Styles
    codex_master: (p) => BREATHING_STYLES.every(style => p.level >= style.unlockLevel),
};