
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
  hp: number;
  mp: number;
  sp: number;
  rp: number;
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
    frequencyValue: number;
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
  readingProgress: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: (props: { className?: string }) => React.ReactElement | null;
}

export interface BreathingStyle {
    name: string;
    description: string;
    unlockLevel: number;
    icon: (props: { className?: string }) => React.ReactElement | null;
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
