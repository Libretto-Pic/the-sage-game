import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PlayerState, View, Mission, RecurringMission, Achievement } from '../types.ts';
import { XP_PER_LEVEL, MISSION_CATEGORIES } from '../constants.ts';
import { generateNewMissions } from '../services/geminiService.ts';
import { audioService } from '../services/audioService.ts';
import { notificationService } from '../services/notificationService.ts';
import { PREGENERATED_JOURNEY } from '../services/pregeneratedMissions.ts';
import { ALL_ACHIEVEMENTS, ACHIEVEMENT_CONDITIONS } from '../services/achievements.ts';

const initialPlayerState: PlayerState = {
  level: 30,
  xp: 0,
  day: 1,
  stats: { hp: 100, mp: 100, sp: 100, rp: 100 },
  missions: [],
  completedMissionHistory: [],
  journalEntries: [],
  soulCoins: 0,
  recurringMissions: [],
  hasSeenNewDayModal: false,
  notificationsEnabled: false,
  soundEnabled: true,
  unlockedAchievements: [],
};

const getInitialState = (): PlayerState | null => {
  try {
    const savedState = localStorage.getItem('sagesPathGameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Basic validation
      if (parsedState.level && parsedState.stats) {
        return { ...initialPlayerState, ...parsedState };
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
};

export const useGameState = () => {
  const [playerState, setPlayerState] = useState<PlayerState | null>(getInitialState());
  const [view, setView] = useState<View>('dashboard');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showNewDayModal, setShowNewDayModal] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  const checkAndUnlockAchievements = useCallback((currentState: PlayerState): { newState: PlayerState, newlyUnlocked: Achievement[] } => {
    const newlyUnlockedAchievements: Achievement[] = [];
    
    for (const achievement of ALL_ACHIEVEMENTS) {
        if (!currentState.unlockedAchievements.includes(achievement.id)) {
            const condition = ACHIEVEMENT_CONDITIONS[achievement.id];
            if (condition && condition(currentState)) {
                newlyUnlockedAchievements.push(achievement);
            }
        }
    }

    if (newlyUnlockedAchievements.length > 0) {
        const newIds = newlyUnlockedAchievements.map(a => a.id);
        const newState = {
            ...currentState,
            unlockedAchievements: [...currentState.unlockedAchievements, ...newIds]
        };
        return { newState, newlyUnlocked: newlyUnlockedAchievements };
    }

    return { newState: currentState, newlyUnlocked: [] };
  }, []);

  useEffect(() => {
    if (playerState) {
      localStorage.setItem('sagesPathGameState', JSON.stringify(playerState));
      if (!playerState.hasSeenNewDayModal && playerState.day > 1) {
        setShowNewDayModal(true);
      }
    }
  }, [playerState]);

  const startGame = useCallback(() => {
    setLoadingMessage("The Sage is preparing your first trials...");
    const firstDay = PREGENERATED_JOURNEY.find(j => j.day === 1);
    const missions: Mission[] = firstDay ? firstDay.missions.map(m => ({
        ...m,
        id: uuidv4(),
        isCompleted: false,
        xp: m.difficulty === 'Hard' ? firstDay.xp * 2 : firstDay.xp,
    })) : [];

    const newState = { ...initialPlayerState, missions, hasSeenNewDayModal: true };
    setPlayerState(newState);
    setLoadingMessage('');
  }, []);

  const importState = useCallback((newState: PlayerState) => {
    setPlayerState(newState);
    setView('dashboard');
  }, []);

  const handleLevelUp = useCallback((currentState: PlayerState): PlayerState => {
    if (currentState.xp < XP_PER_LEVEL) return currentState;

    if (currentState.soundEnabled) {
        audioService.playLevelUp();
    }
    let newXp = currentState.xp;
    let newLevel = currentState.level;
    let newSoulCoins = currentState.soulCoins;

    while (newXp >= XP_PER_LEVEL) {
      newXp -= XP_PER_LEVEL;
      newLevel += 1;
      newSoulCoins += 5; // Grant 5 Soul Coins per level up
    }

    // Restore stats on level up
    const newStats = { hp: 100, mp: 100, sp: 100, rp: 100 };

    return { ...currentState, level: newLevel, xp: newXp, soulCoins: newSoulCoins, stats: newStats };
  }, []);
  
  const completeMission = useCallback((id: string) => {
    if (!playerState) return;
    
    setPlayerState(prevState => {
      if (!prevState) return null;
      
      const newMissions = prevState.missions.map(mission => 
        mission.id === id ? { ...mission, isCompleted: true } : mission
      );
      
      const mission = prevState.missions.find(m => m.id === id);
      if (!mission || mission.isCompleted) return prevState;

      let newXp = prevState.xp + mission.xp;
      let newSoulCoins = prevState.soulCoins;

      const allCompleted = newMissions.every(m => m.isCompleted);
      if (allCompleted) {
        if (prevState.soundEnabled) audioService.playAllMissionsComplete();
        newXp += 10; 
        newSoulCoins += 2;
      } else {
        if (prevState.soundEnabled) audioService.playMissionComplete();
      }

      let tempState: PlayerState = {
        ...prevState,
        missions: newMissions,
        xp: newXp,
        soulCoins: newSoulCoins,
        completedMissionHistory: [...prevState.completedMissionHistory, mission.title]
      };

      let stateAfterLevelUp = handleLevelUp(tempState);
      
      const { newState: finalState, newlyUnlocked } = checkAndUnlockAchievements(stateAfterLevelUp);
      if (newlyUnlocked.length > 0) {
        setNewlyUnlocked(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
            return [...prev, ...uniqueNew];
        });
      }

      return finalState;
    });
  }, [playerState, handleLevelUp, checkAndUnlockAchievements]);
  
  const startNewDay = useCallback(async () => {
    if (!playerState) return;

    setLoadingMessage("The Sage is consulting the ethereal plane for today's trials...");
    
    const newDay = playerState.day + 1;
    let newMissions: (Omit<Mission, 'id' | 'isCompleted' | 'xp'> & { difficulty?: 'Easy' | 'Medium' | 'Hard' })[] = [];
    let missionXP = 20;

    const pregenDay = PREGENERATED_JOURNEY.find(j => j.day === newDay);
    if (pregenDay) {
        newMissions = pregenDay.missions;
        missionXP = pregenDay.xp;
    } else {
        const recurringToday = playerState.recurringMissions.filter(rm => {
            if (rm.frequencyType === 'daily') return true;
            if (rm.frequencyType === 'every_x_days') {
                return (newDay - rm.startDay) % rm.frequencyValue === 0;
            }
            return false;
        });

        const recurringMissionCategories = new Set(recurringToday.map(rm => rm.category));
        const dynamicCategories = MISSION_CATEGORIES.filter(cat => !recurringMissionCategories.has(cat));

        const generatedMissions = await generateNewMissions(
            playerState.level,
            playerState.completedMissionHistory,
            dynamicCategories
        );
        newMissions = [...recurringToday, ...generatedMissions];
    }
    
    const finalMissions = newMissions.map(m => ({ 
        ...m, 
        id: uuidv4(), 
        isCompleted: false, 
        xp: m.difficulty === 'Hard' ? missionXP * 2 : missionXP 
    }));

    setPlayerState(prevState => {
        if (!prevState) return null;
        const newState = {
            ...prevState,
            day: newDay,
            missions: finalMissions,
            hasSeenNewDayModal: false,
        };
        if (newState.notificationsEnabled) {
            notificationService.sendMissionReadyNotification(finalMissions.length);
        }
        
        const { newState: finalState, newlyUnlocked } = checkAndUnlockAchievements(newState);
        if (newlyUnlocked.length > 0) {
            setNewlyUnlocked(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
                return [...prev, ...uniqueNew];
            });
        }

        return finalState;
    });
    setLoadingMessage('');
  }, [playerState, checkAndUnlockAchievements]);

  const confirmNewDay = useCallback(() => {
    setPlayerState(prevState => prevState ? { ...prevState, hasSeenNewDayModal: true } : null);
    setShowNewDayModal(false);
  }, []);

  const saveJournalEntry = useCallback((entry: string) => {
    setPlayerState(prevState => {
        if (!prevState) return null;
        const newState = { ...prevState, journalEntries: [...prevState.journalEntries, entry] };
        const { newState: finalState, newlyUnlocked } = checkAndUnlockAchievements(newState);
        if (newlyUnlocked.length > 0) {
             setNewlyUnlocked(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
                return [...prev, ...uniqueNew];
            });
        }
        return finalState;
    });
  }, [checkAndUnlockAchievements]);
  
  const addRecurringMission = useCallback((mission: Omit<RecurringMission, 'id' | 'startDay'>) => {
    setPlayerState(prevState => {
      if (!prevState) return null;
      const newMission: RecurringMission = {
        ...mission,
        id: uuidv4(),
        startDay: prevState.day,
      };
      return { ...prevState, recurringMissions: [...prevState.recurringMissions, newMission]};
    });
  }, []);

  const deleteRecurringMission = useCallback((id: string) => {
    setPlayerState(prevState => prevState ? { ...prevState, recurringMissions: prevState.recurringMissions.filter(m => m.id !== id) } : null);
  }, []);

  const toggleNotifications = useCallback(async (): Promise<boolean> => {
    if (!playerState) return false;

    const currentlyEnabled = playerState.notificationsEnabled;
    if (currentlyEnabled) {
        setPlayerState(p => p ? { ...p, notificationsEnabled: false } : null);
        return true;
    } else {
        const permission = await notificationService.requestPermission();
        if (permission === 'granted') {
            setPlayerState(p => p ? { ...p, notificationsEnabled: true } : null);
            return true;
        }
        return false;
    }
  }, [playerState]);

  const toggleSound = useCallback(() => {
    setPlayerState(p => p ? { ...p, soundEnabled: !p.soundEnabled } : null);
    if (playerState && !playerState.soundEnabled) {
        // Play sound when enabling
        audioService.playMissionComplete();
    }
  }, [playerState]);

  const resetGame = useCallback(() => {
    localStorage.removeItem('sagesPathGameState');
    setPlayerState(null);
  }, []);

  return {
    playerState,
    view,
    loadingMessage,
    showNewDayModal,
    newlyUnlocked,
    startGame,
    importState,
    setView,
    completeMission,
    startNewDay,
    confirmNewDay,
    saveJournalEntry,
    addRecurringMission,
    deleteRecurringMission,
    toggleNotifications,
    toggleSound,
    resetGame,
    clearNewlyUnlocked,
  };
};