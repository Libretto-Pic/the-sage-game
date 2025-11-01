// Implemented type definitions for the application state and models.
import React from 'react';

export interface PlayerStats {
  hp: number; // Health Points: physical well-being
  mp: number; // Mana Points: mental energy, focus
  sp: number; // Stamina Points: physical energy, endurance
  rp: number; // Resolve Points: emotional resilience, spirit
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'Health' | 'Wealth' | 'Mind';
  xp: number;
  isCompleted: boolean;
}

export interface RecurringMission {
  id: string;
  title: string;
  description: string;
  category: 'Health' | 'Wealth' | 'Mind';
  frequencyType: 'daily' | 'every_x_days';
  frequencyValue: number; // e.g., 2 for every 2 days
  startDay: number;
}

export interface PlayerState {
  level: number;
  xp: number;
  stats: PlayerStats;
  soulCoins: number;
  lastPlayedDate: string | null;
  journalEntries: string[];
  day: number;
  missions: Mission[];
  recurringMissions: RecurringMission[];
}

export interface StructuredTechnique {
  steps: { type: 'Inhale' | 'Exhale' | 'Hold'; duration: number }[];
  reps: number;
}

export interface BreathingStyle {
  name: string;
  description: string;
  technique: string;
  whenToUse: string;
  unlockLevel: number;
  icon: React.FC<{className?: string}>;
  structuredTechnique: StructuredTechnique | null;
}

export interface Realm {
    name: string;
    levelRange: string;
    theme: string;
}

export type View = 'dashboard' | 'missions' | 'progress' | 'codex' | 'journal' | 'bosses' | 'shop' | 'levels' | 'rituals';