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
  | 'achievements'
  | 'abilities'
  | 'abilityDetail';

export interface PlayerStats {
  hp: number; // Health Points: resilience, physical well-being.
  mp: number; // Mana Points: mental energy, focus, creativity.
  sp: number; // Spirit Points: willpower, discipline, emotional regulation.
  rp: number; // Resolve Points: consistency, long-term commitment.
}

export type MissionCategory = 'Health' | 'Wealth' | 'Mind' | 'Soul';
export type StatCategory = 'Physique' | 'Intellect' | 'Memory' | MissionCategory;


export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  isCompleted: boolean;
  xp: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isBossMission?: boolean;
  isActivationMission?: boolean;
  activationId?: string;
  powerPointsReward?: number;
  isTrialMission?: boolean;
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

export interface ActivationTrial {
    id: string;
    shopItemId: StatCategory;
    statBonus: number;
    missionId: string;
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
  powerPoints: number;
  controlledKazuki: string[];
  xpMultiplier: number;
  consecutiveDaysFailed: number;
  onDemandMissionsGeneratedToday: number;
  boostedKazuki: Record<string, number>; // { [kazukiName]: boostedPower }
  lastSessionTimestamp: number;
  permanentStats: Partial<Record<StatCategory, number>>;
  pendingActivations: ActivationTrial[];
  kazukiPowerLevels: Record<string, number>; // { [kazukiName]: rolledPower }

  // Generic Ability Progression
  abilityLevels: Partial<Record<StatCategory, number>>;
  abilityXp: Partial<Record<StatCategory, number>>;
  testsAwaiting: Partial<Record<StatCategory, boolean>>;
  currentTests: Partial<Record<StatCategory, { question: string; isSubmitted: boolean }>>;
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

export interface Kazuki {
    name: string; // The cultural name, e.g., Zahhak
    title: string; // The in-game title, e.g., Ryojin, The Drifter
    description: string;
    difficulty: 'Novice' | 'Adept' | 'Master' | 'Grandmaster' | 'Legend' | 'Sage';
    encounterLevel: number;
    controlReward: string;
    strengths: string[];
    weaknesses: string[];
    powerPointsRange: [number, number];
    origin: string; // e.g., Persian
    domain: string; // e.g., Distraction, fragmented focus
}

export interface DailySummary {
    title: string;
    realm: string;
    xpPerMission: number;
    breathStyle: string;
    kazukiWatch: string;
}

export interface ShopItem {
    id: StatCategory;
    name: string;
    description: string;
    costPerPoint: number;
    icon: React.FC<{className?: string}>;
    promptSuggestion: string;
}

export interface SkillDefinition {
    name: string;
    description: string;
}

export interface AbilityLevelContent {
    level: number;
    title: string;
    description: string;
    skills: SkillDefinition[];
}

export interface AbilityLore {
    id: StatCategory;
    name: string;
    description: string;
    icon: React.FC<{className?: string}>;
    levels: AbilityLevelContent[];
    xpPerLevel: number;
}