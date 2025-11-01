import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PlayerState, Mission, RecurringMission, View, DailySummary } from '../types';
import { XP_PER_LEVEL } from '../constants';
import { generateNewMissions } from '../services/geminiService';
import { PREGENERATED_JOURNEY } from '../services/pregeneratedMissions';
import { audioService } from '../services/audioService';
import { notificationService } from '../services/notificationService';

const isToday = (someDate: string) => {
  const today = new Date();
  const date = new Date(someDate);
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const getInitialState = (): PlayerState => ({
  level: 30,
  xp: 0,
  stats: { hp: 100, mp: 100, sp: 100, rp: 100 },
  soulCoins: 0,
  lastPlayedDate: null,
  journalEntries: [],
  day: 1,
  missions: [],
  recurringMissions: [],
  notificationsEnabled: false,
  dailySummary: null,
});

export const useGameState = () => {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMissions, setIsGeneratingMissions] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [showNewDayModal, setShowNewDayModal] = useState(false);

  const startGame = useCallback(() => {
    const initialState = getInitialState();
    startNewDay(initialState, true);
  }, []);

  const setupNewDayMissions = useCallback(async (currentState: PlayerState) => {
    setIsGeneratingMissions(true);
    
    let newMissions: Mission[] = [];
    let dailySummary: DailySummary | null = null;
    
    try {
        // Use pre-generated content for the first 30 days
        if (currentState.day <= PREGENERATED_JOURNEY.length) {
            const dayContent = PREGENERATED_JOURNEY[currentState.day - 1];
            newMissions = dayContent.missions.map(m => ({
                ...m,
                id: uuidv4(),
                isCompleted: false,
                xp: dayContent.xp,
            }));
            dailySummary = {
                title: dayContent.title,
                realm: dayContent.realm,
                xpPerMission: dayContent.xp,
                breathStyle: dayContent.breathStyle,
                kazukiWatch: dayContent.kazukiWatch,
            };
        } else {
            // After day 30, switch to dynamic generation
            const existingMissionTitles = currentState.missions.map(m => m.title);
            const generatedMissions = await generateNewMissions(currentState.level, existingMissionTitles, ['Health', 'Wealth', 'Mind']);
            newMissions = generatedMissions.map(m => ({ ...m, id: uuidv4(), isCompleted: false, xp: 15 }));
            // We can create a basic summary for dynamic days too if needed, or leave it null
            dailySummary = {
                title: `Day ${currentState.day}: The Unwritten Path`,
                realm: "Realm of Emergence",
                xpPerMission: 15, // Default XP for dynamic missions
                breathStyle: "The Eternal Breath",
                kazukiWatch: "The unknown demons of habit."
            };
        }
        
        const finalState: PlayerState = {
            ...currentState,
            missions: newMissions,
            dailySummary: dailySummary,
            lastPlayedDate: new Date().toISOString(),
        };

        if (finalState.notificationsEnabled && newMissions.length > 0) {
            notificationService.sendMissionReadyNotification(newMissions.length);
        }

        setPlayerState(finalState);

    } catch (error) {
        console.error("Error setting up new day missions", error);
        setPlayerState(currentState); // Revert to pre-generation state on error
    } finally {
        setIsGeneratingMissions(false);
    }
  }, []);

  const startNewDay = useCallback(async (state: PlayerState, isFirstDay = false) => {
    const newState = {
      ...state,
      day: isFirstDay ? 1 : state.day + 1,
      lastPlayedDate: new Date().toISOString()
    };
    if (!isFirstDay) {
        newState.stats.hp = Math.min(100, newState.stats.hp + 5);
        newState.stats.mp = Math.min(100, newState.stats.mp + 10);
        newState.stats.sp = Math.min(100, newState.stats.sp + 5);
        newState.stats.rp = Math.min(100, newState.stats.rp + 10);
    }
    setPlayerState(newState);
    setShowNewDayModal(false);
    await setupNewDayMissions(newState);
  }, [setupNewDayMissions]);

  const completeMission = useCallback((missionId: string) => {
    if (!playerState) return;

    const mission = playerState.missions.find(m => m.id === missionId);
    if (!mission || mission.isCompleted) return;
    
    audioService.playMissionComplete();

    const newXp = playerState.xp + mission.xp;
    let newLevel = playerState.level;
    let xpForNextLevel = newXp;

    if (newXp >= XP_PER_LEVEL) {
        newLevel += 1;
        xpForNextLevel = newXp - XP_PER_LEVEL;
        audioService.playLevelUp();
    }
    
    const newMissions = playerState.missions.map(m => m.id === missionId ? { ...m, isCompleted: true } : m);
    const allCompleted = newMissions.every(m => m.isCompleted);
    if (allCompleted) {
        audioService.playAllMissionsComplete();
    }

    const newStats = { ...playerState.stats };
    switch(mission.category) {
        case 'Health':
            newStats.hp = Math.min(100, newStats.hp + 5);
            newStats.sp = Math.min(100, newStats.sp + 5);
            break;
        case 'Wealth':
            newStats.mp = Math.min(100, newStats.mp + 5);
            break;
        case 'Mind':
            newStats.mp = Math.min(100, newStats.mp + 5);
            newStats.rp = Math.min(100, newStats.rp + 5);
            break;
    }

    setPlayerState(prevState => ({
        ...prevState!,
        level: newLevel,
        xp: xpForNextLevel,
        stats: newStats,
        missions: newMissions,
    }));
  }, [playerState]);

  const saveJournalEntry = useCallback((entry: string) => {
    setPlayerState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        journalEntries: [...prevState.journalEntries, entry],
      };
    });
  }, []);
  
  const addRecurringMission = useCallback((mission: Omit<RecurringMission, 'id' | 'startDay'>) => {
      setPlayerState(prevState => {
        if (!prevState) return null;
        const newMission: RecurringMission = {
            ...mission,
            id: uuidv4(),
            startDay: prevState.day,
        };
        return {
            ...prevState,
            recurringMissions: [...prevState.recurringMissions, newMission]
        }
      });
  }, []);

  const deleteRecurringMission = useCallback((id: string) => {
    setPlayerState(prevState => {
      if (!prevState) return null;
      return {
          ...prevState,
          recurringMissions: prevState.recurringMissions.filter(m => m.id !== id)
      }
    });
  }, []);

  const overwriteState = useCallback((newState: PlayerState) => {
    setPlayerState(newState);
    if (newState.lastPlayedDate && !isToday(newState.lastPlayedDate)) {
      setShowNewDayModal(true);
    }
  }, []);

  const toggleNotifications = useCallback(async (): Promise<boolean> => {
    if (!playerState) return false;

    if (!playerState.notificationsEnabled) {
        const permission = await notificationService.requestPermission();
        if (permission !== 'granted') {
            return false; // Failure
        }
    }
    
    setPlayerState(prevState => ({
        ...prevState!,
        notificationsEnabled: !prevState!.notificationsEnabled,
    }));
    return true; // Success
  }, [playerState]);

  return {
    playerState,
    isLoading: isLoading || (playerState !== null && isGeneratingMissions),
    isGeneratingMissions,
    view,
    showNewDayModal,
    actions: {
      startGame,
      startNewDay: () => playerState && startNewDay(playerState),
      completeMission,
      saveJournalEntry,
      setView,
      addRecurringMission,
      deleteRecurringMission,
      overwriteState,
      toggleNotifications,
    }
  };
};