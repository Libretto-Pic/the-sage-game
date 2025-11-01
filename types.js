import React from 'react';

export type View =
  | 'dashboard'
  | 'missions'
  | 'rituals'
  | 'progress'
  | 'levels'
  | 'codex'
  | 'journal'
  | 'bosses'
  | 'shop'
  | 'settings'
  | 'achievements';

export interface PlayerStats {
  hp: number; // Health Points: resilience, physical well-being.
  mp: number; // Mana Points: mental energy, focus, creativity.
  sp: number; // Spirit Points: willpower, discipline, emotional regulation.
  rp: number; // Resolve Points: consistency, long-term commitment.
}

export type MissionCategory = 'Health' | 'Wealth' | 'Mind' | 'Soul';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  isCompleted: boolean;
  xp: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface RecurringMission {
    id: string;
    title: string;
    description: string;
    category: MissionCategory;
    frequencyType: 'daily' | 'every_x_days';
    frequencyValue: number; // 1 for daily, >1 for every_x_days
    startDay: number;
    xp: number;
}

export interface PlayerState {
  level: number;
  xp: number;
  day: number;
  stats: PlayerStats;
  missions: Mission[];
  completedMissionHistory: string[];
  journalEntries: string[];
  soulCoins: number;
  recurringMissions: RecurringMission[];
  hasSeenNewDayModal: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  unlockedAchievements: string[];
  readingProgress: number; // 0, 1, or 2 for 30, 60, 90 mins
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.FC<{className?: string}>;
}

export interface BreathingStyle {
    name: string;
    description: string;
    unlockLevel: number;
    icon: React.FC<{className?: string}>;
    technique: string;
    whenToUse: string;
    structuredTechnique?: {
        reps: number;
        steps: { type: 'Inhale' | 'Hold' | 'Exhale'; duration: number }[];
    }
}

export interface DailySummary {
    title: string;
    realm: string;
    xpPerMission: number;
    breathStyle: string;
    kazukiWatch: string;
}
