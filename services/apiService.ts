// services/apiService.ts
// This service handles all communication with the browser's localStorage.

import type { PlayerState } from '../types';

const STORAGE_KEY = 'sages-path-player-state';

// Fetches player state from localStorage
export const getPlayerState = (): PlayerState | null => {
  try {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      // Ensure recurringMissions is present for backward compatibility
      if (!savedState.recurringMissions) {
        savedState.recurringMissions = [];
      }
      return savedState as PlayerState;
    }
    return null; // No saved state
  } catch (error) {
    console.error("API Service (localStorage): Failed to get player state.", error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

// Saves player state to localStorage
export const savePlayerState = (state: PlayerState): { success: boolean } => {
  try {
    const stateJSON = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, stateJSON);
    return { success: true };
  } catch (error) {
    console.error("API Service (localStorage): Failed to save player state.", error);
    return { success: false };
  }
};