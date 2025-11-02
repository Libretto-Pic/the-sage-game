import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PlayerState, View, Mission, RecurringMission, Achievement, MissionCategory } from '../types.ts';
import { XP_PER_LEVEL, MISSION_CATEGORIES } from '../constants.ts';
import { generateNewMissions, generateSingleMission } from '../services/geminiService.ts';
import { audioService } from '../services/audioService.ts';
import { notificationService } from '../services/notificationService.ts';
import { PREGENERATED_JOURNEY } from '../services/pregeneratedMissions.ts';
import { ALL_ACHIEVEMENTS, ACHIEVEMENT_CONDITIONS } from '../services/achievements.ts';
import { ALL_KAZUKI } from '../services/kazukiLore.ts';

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
  readingProgress: 0,
  powerPoints: 0,
  controlledKazuki: [],
  xpMultiplier: 1.0,
  consecutiveDaysFailed: 0,
  onDemandMissionsGeneratedToday: 0,
  boostedKazuki: {},
};

const getInitialState = (): PlayerState | null => {
  try {
    const savedState = localStorage.getItem('sagesPathGameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Basic validation and migration for older save files
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
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);

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

    let stateAfterLevelUp: PlayerState = { ...currentState, level: newLevel, xp: newXp, soulCoins: newSoulCoins, stats: newStats };
    
    // Check for new Kazuki encounters
    for (const kazuki of ALL_KAZUKI) {
        const isAlreadyControlled = (stateAfterLevelUp.controlledKazuki || []).includes(kazuki.name);
        const missionExists = stateAfterLevelUp.missions.some(m => m.isBossMission && m.title.includes(kazuki.name));

        if (stateAfterLevelUp.level >= kazuki.encounterLevel && !isAlreadyControlled && !missionExists) {
            const bossMission: Mission = {
                id: uuidv4(),
                title: `Confront ${kazuki.name}: ${kazuki.title}`,
                description: `A new inner demon has revealed itself. Confront and control ${kazuki.name}. Study its nature in the Kazuki Codex.`,
                category: 'Soul',
                isCompleted: false,
                xp: Math.floor(kazuki.powerPoints / 10), // High XP reward based on power
                difficulty: 'Hard',
                isBossMission: true,
            };
            stateAfterLevelUp = {
                ...stateAfterLevelUp,
                missions: [...stateAfterLevelUp.missions, bossMission]
            };
        }
    }

    return stateAfterLevelUp;
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
      
      const xpMultiplier = prevState.xpMultiplier || 1.0;
      const xpGained = Math.round(mission.xp * xpMultiplier);
      let newXp = prevState.xp + xpGained;
      let newSoulCoins = prevState.soulCoins;
      let newPowerPoints = prevState.powerPoints + Math.floor(xpGained * 2 / 5);

      const allCompleted = newMissions.every(m => m.isCompleted);
      if (allCompleted) {
        if (prevState.soundEnabled) audioService.playAllMissionsComplete();
        newXp += 10; 
        newSoulCoins += 2;
        newPowerPoints += Math.floor(10 * 2 / 5); // 4 power points
      } else {
        if (prevState.soundEnabled) audioService.playMissionComplete();
      }
      
      let newControlledKazuki = prevState.controlledKazuki || [];
      let newXpMultiplier = prevState.xpMultiplier || 1.0;
      if (mission.isBossMission) {
          const controlledKazukiName = ALL_KAZUKI.find(k => mission.title.includes(k.name))?.name;
          if (controlledKazukiName && !newControlledKazuki.includes(controlledKazukiName)) {
              newControlledKazuki = [...newControlledKazuki, controlledKazukiName];
              newXpMultiplier += 0.1;
          }
      }

      let tempState: PlayerState = {
        ...prevState,
        missions: newMissions,
        xp: newXp,
        soulCoins: newSoulCoins,
        powerPoints: newPowerPoints,
        completedMissionHistory: [...prevState.completedMissionHistory, mission.title],
        controlledKazuki: newControlledKazuki,
        xpMultiplier: newXpMultiplier,
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

  const completeReadingBlock = useCallback(() => {
    if (!playerState || playerState.readingProgress >= 3) return;

    const xpRewards = [25, 20, 15];
    const xpEarned = xpRewards[playerState.readingProgress];

    setPlayerState(prevState => {
        if (!prevState) return null;
        
        if (prevState.soundEnabled) audioService.playMissionComplete();
        
        const xpMultiplier = prevState.xpMultiplier || 1.0;
        const xpGained = Math.round(xpEarned * xpMultiplier);

        let tempState: PlayerState = {
            ...prevState,
            xp: prevState.xp + xpGained,
            powerPoints: prevState.powerPoints + Math.floor(xpGained * 2 / 5),
            readingProgress: prevState.readingProgress + 1,
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
    
    // --- Failure Logic ---
    const previousDayMissions = playerState.missions.filter(m => !m.isBossMission);
    const didFailDay = previousDayMissions.length > 0 && previousDayMissions.some(m => !m.isCompleted);
    let newConsecutiveDaysFailed = playerState.consecutiveDaysFailed || 0;
    let newBoostedKazuki = { ...(playerState.boostedKazuki || {}) };
    let newJournalEntries = playerState.journalEntries;
    let penaltyApplied = false;

    if (didFailDay) {
        newConsecutiveDaysFailed++;
    } else {
        newConsecutiveDaysFailed = 0; // Reset on a successful day
    }
    
    if (newConsecutiveDaysFailed >= 3) {
        const activeBossMission = playerState.missions.find(m => m.isBossMission && !m.isCompleted);
        if (activeBossMission) {
            const kazukiData = ALL_KAZUKI.find(k => activeBossMission.title.includes(k.name));
            if (kazukiData) {
                const currentPower = newBoostedKazuki[kazukiData.name] || kazukiData.powerPoints;
                const boostedPower = Math.floor(currentPower * 1.25); // 25% stronger
                newBoostedKazuki[kazukiData.name] = boostedPower;

                newJournalEntries = [...newJournalEntries, `The Sage's Whisper: Your resolve wavers. Three days of neglect have fed ${kazukiData.name}, The ${kazukiData.title}. Its power grows.`];
                
                newConsecutiveDaysFailed = 0; // Reset counter after penalty
                penaltyApplied = true;
            }
        }
    }
    
    const newDay = playerState.day + 1;
    let newMissions: (Omit<Mission, 'id' | 'isCompleted'>)[] = [];
    let missionXP = 20;

    const pregenDay = PREGENERATED_JOURNEY.find(j => j.day === newDay);
    if (pregenDay) {
        newMissions = pregenDay.missions.map(m => ({ ...m, xp: m.difficulty === 'Hard' ? pregenDay.xp * 2 : pregenDay.xp }));
        missionXP = pregenDay.xp;
    } else {
        const recurringTodaySource = playerState.recurringMissions.filter(rm => {
            if (rm.frequencyType === 'daily') return true;
            if (rm.frequencyType === 'every_x_days') {
                return (newDay - rm.startDay) % rm.frequencyValue === 0;
            }
            return false;
        });

        let ritualXPSoFar = 0;
        const RITUAL_XP_CAP = 50;
        const recurringToday = [];
        for (const rm of recurringTodaySource) {
            if (ritualXPSoFar + rm.xp <= RITUAL_XP_CAP) {
                recurringToday.push(rm);
                ritualXPSoFar += rm.xp;
            }
        }

        const recurringMissionCategories = new Set(recurringToday.map(rm => rm.category));
        const dynamicCategories = MISSION_CATEGORIES.filter(cat => !recurringMissionCategories.has(cat));
        
        const recentHistory = playerState.completedMissionHistory.slice(-100);

        const generatedMissions = await generateNewMissions(
            playerState.level,
            recentHistory,
            dynamicCategories
        );
        const generatedMissionsWithXP = generatedMissions.map(m => ({
            ...m,
            xp: m.difficulty === 'Hard' ? missionXP * 2 : m.difficulty === 'Medium' ? missionXP : missionXP / 2
        }));

        newMissions = [...recurringToday, ...generatedMissionsWithXP];
    }
    
    const finalMissions = newMissions.map(m => ({ 
        ...m, 
        id: uuidv4(), 
        isCompleted: false, 
    }));

    setPlayerState(prevState => {
        if (!prevState) return null;

        const persistentMissions = prevState.missions.filter(
            m => m.isBossMission && !m.isCompleted
        );
        
        const newState = {
            ...prevState,
            day: newDay,
            missions: [...finalMissions, ...persistentMissions],
            hasSeenNewDayModal: false,
            readingProgress: 0,
            onDemandMissionsGeneratedToday: 0,
            consecutiveDaysFailed: newConsecutiveDaysFailed,
            boostedKazuki: newBoostedKazuki,
            journalEntries: newJournalEntries,
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

  const generateMissionByCategory = useCallback(async (category: MissionCategory): Promise<{ success: boolean, reason?: 'no_points' | 'limit_reached' | 'api_error'}> => {
    if (!playerState) return { success: false };
    if ((playerState.onDemandMissionsGeneratedToday || 0) >= 2) {
        return { success: false, reason: 'limit_reached' };
    }
    if (playerState.powerPoints < 15) {
        return { success: false, reason: 'no_points' };
    }

    setIsGeneratingMission(true);
    
    try {
        const recentHistory = playerState.completedMissionHistory.slice(-50);
        const existingTitles = [...playerState.missions.map(m => m.title), ...recentHistory];
        const newMissionData = await generateSingleMission(playerState.level, existingTitles, category);

        const missionXP = newMissionData.difficulty === 'Hard' ? 40 : newMissionData.difficulty === 'Medium' ? 25 : 15;

        const newMission: Mission = {
            ...newMissionData,
            id: uuidv4(),
            category: category,
            isCompleted: false,
            xp: missionXP,
        };

        setPlayerState(prevState => {
            if (!prevState) return null;
            return {
                ...prevState,
                missions: [...prevState.missions, newMission],
                powerPoints: prevState.powerPoints - 15,
                onDemandMissionsGeneratedToday: (prevState.onDemandMissionsGeneratedToday || 0) + 1,
            };
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to generate and add mission", error);
        return { success: false, reason: 'api_error' };
    } finally {
        setIsGeneratingMission(false);
    }
  }, [playerState]);

  return {
    playerState,
    view,
    loadingMessage,
    showNewDayModal,
    newlyUnlocked,
    isGeneratingMission,
    startGame,
    importState,
    setView,
    completeMission,
    completeReadingBlock,
    startNewDay,
    confirmNewDay,
    saveJournalEntry,
    addRecurringMission,
    deleteRecurringMission,
    toggleNotifications,
    toggleSound,
    resetGame,
    clearNewlyUnlocked,
    generateMissionByCategory,
  };
};
