import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PlayerState, View, Mission, RecurringMission, Achievement, MissionCategory, ActivationTrial, StatCategory, Kazuki } from '../types.ts';
import { XP_PER_LEVEL, MISSION_CATEGORIES } from '../constants.ts';
import { 
    generateNewMissions, 
    generateSingleMission, 
    generateActivationMission,
    generateAbilityTestQuestion,
    evaluateAbilityTestAnswer,
    generateKazukiTrialMission,
} from '../services/geminiService.ts';
import { audioService } from '../services/audioService.ts';
import { notificationService } from '../services/notificationService.ts';
import { PREGENERATED_JOURNEY } from '../services/pregeneratedMissions.ts';
import { ALL_ACHIEVEMENTS, ACHIEVEMENT_CONDITIONS } from '../services/achievements.ts';
import { ALL_KAZUKI } from '../services/kazukiLore.ts';
import { ALL_ABILITIES } from '../services/abilitiesLore.ts';

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
  lastSessionTimestamp: Date.now(),
  permanentStats: {},
  pendingActivations: [],
  kazukiPowerLevels: {},
  abilityLevels: { Intellect: 1, Physique: 1, Memory: 1 },
  abilityXp: { Intellect: 0, Physique: 0, Memory: 0 },
  testsAwaiting: {},
  currentTests: {},
};

// Helper to roll random power for Kazuki
const initializeKazukiPowers = (currentPowers: Record<string, number>): Record<string, number> => {
    const newPowers = { ...currentPowers };
    let updated = false;
    for (const kazuki of ALL_KAZUKI) {
        if (!newPowers[kazuki.name]) {
            const [min, max] = kazuki.powerPointsRange;
            newPowers[kazuki.name] = Math.floor(Math.random() * (max - min + 1)) + min;
            updated = true;
        }
    }
    return updated ? newPowers : currentPowers;
};


const getInitialState = (): PlayerState | null => {
  try {
    const savedState = localStorage.getItem('sagesPathGameState');
    if (savedState) {
      let parsedState = JSON.parse(savedState);
      // Basic validation and migration for older save files
      if (parsedState.level && parsedState.stats) {
        let migratedState = { ...initialPlayerState, ...parsedState };
        
        // Migration from old Intellect system
        if (parsedState.intellectLevel) {
            migratedState.abilityLevels = {
                ...migratedState.abilityLevels,
                Intellect: parsedState.intellectLevel,
            };
            migratedState.abilityXp = {
                ...migratedState.abilityXp,
                Intellect: parsedState.intellectXp || 0,
            };
            if (parsedState.isAwaitingIntellectTest) {
                migratedState.testsAwaiting = { ...migratedState.testsAwaiting, Intellect: true };
            }
            if (parsedState.currentIntellectTest) {
                migratedState.currentTests = { ...migratedState.currentTests, Intellect: parsedState.currentIntellectTest };
            }
             // Delete old keys
            delete migratedState.intellectLevel;
            delete migratedState.intellectXp;
            delete migratedState.isAwaitingIntellectTest;
            delete migratedState.currentIntellectTest;
        }

        // Ensure new fields exist
        migratedState.lastSessionTimestamp = migratedState.lastSessionTimestamp || Date.now();
        migratedState.permanentStats = migratedState.permanentStats || {};
        migratedState.pendingActivations = migratedState.pendingActivations || [];
        migratedState.abilityLevels = migratedState.abilityLevels || { Intellect: 1, Physique: 1, Memory: 1 };
        migratedState.abilityXp = migratedState.abilityXp || { Intellect: 0, Physique: 0, Memory: 0 };
        migratedState.testsAwaiting = migratedState.testsAwaiting || {};
        migratedState.currentTests = migratedState.currentTests || {};
        migratedState.kazukiPowerLevels = initializeKazukiPowers(migratedState.kazukiPowerLevels || {});
        
        return migratedState;
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
  const playerStateRef = useRef(playerState);
  const [view, setView] = useState<View>('dashboard');
  const [activeAbility, setActiveAbility] = useState<StatCategory | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showNewDayModal, setShowNewDayModal] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);


  useEffect(() => {
      playerStateRef.current = playerState;
  }, [playerState]);

  const selectAbility = useCallback((ability: StatCategory) => {
    setActiveAbility(ability);
    setView('abilityDetail');
  }, []);

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
  
  const startNewDay = useCallback(async (force: boolean = false) => {
    // Prevent starting a new day if one is already in progress and not completed.
    if (!playerStateRef.current) return;
    const allMissionsCompleted = playerStateRef.current.missions.every(m => m.isCompleted);
    if (!allMissionsCompleted && !force) return;

    setLoadingMessage("The Sage is consulting the ethereal plane for today's trials...");
    
    // Using ref here to get the absolute latest state
    const currentState = playerStateRef.current;
    
    // --- Failure Logic ---
    const previousDayMissions = currentState.missions.filter(m => !m.isBossMission && !m.isTrialMission);
    const didFailDay = previousDayMissions.length > 0 && previousDayMissions.some(m => !m.isCompleted);
    let newConsecutiveDaysFailed = currentState.consecutiveDaysFailed || 0;
    let newBoostedKazuki = { ...(currentState.boostedKazuki || {}) };
    let newJournalEntries = currentState.journalEntries;

    if (didFailDay) {
        newConsecutiveDaysFailed++;
    } else {
        newConsecutiveDaysFailed = 0; // Reset on a successful day
    }
    
    if (newConsecutiveDaysFailed >= 3) {
        const activeKazuki = ALL_KAZUKI.find(k => currentState.level >= k.encounterLevel && !currentState.controlledKazuki.includes(k.name));

        if (activeKazuki) {
            const kazukiPower = currentState.kazukiPowerLevels[activeKazuki.name];
            const currentPower = newBoostedKazuki[activeKazuki.name] || kazukiPower;
            const boostedPower = Math.floor(currentPower * 1.25); // 25% stronger
            newBoostedKazuki[activeKazuki.name] = boostedPower;
            newJournalEntries = [...newJournalEntries, `The Sage's Whisper: Your resolve wavers. Three days of neglect have fed ${activeKazuki.name}, The ${activeKazuki.title}. Its power grows.`];
            newConsecutiveDaysFailed = 0; // Reset counter after penalty
        }
    }
    
    const newDay = currentState.day + 1;
    let newMissions: (Omit<Mission, 'id' | 'isCompleted'>)[] = [];
    let missionXP = 20;

    const pregenDay = PREGENERATED_JOURNEY.find(j => j.day === newDay);
    if (pregenDay) {
        newMissions = pregenDay.missions.map(m => ({ ...m, xp: m.difficulty === 'Hard' ? pregenDay.xp * 2 : pregenDay.xp }));
        missionXP = pregenDay.xp;
    } else {
        const recurringTodaySource = currentState.recurringMissions.filter(rm => {
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
        
        const recentHistory = currentState.completedMissionHistory.slice(-100);

        const generatedMissions = await generateNewMissions(
            currentState.level,
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
            m => (m.isBossMission || m.isActivationMission || m.isTrialMission) && !m.isCompleted
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
            lastSessionTimestamp: Date.now(),
        };

        if (newState.notificationsEnabled) {
            notificationService.sendMissionReadyNotification(finalMissions.length);
        }
        
        const { newState: stateAfterAchievements, newlyUnlocked } = checkAndUnlockAchievements(newState);
        if (newlyUnlocked.length > 0) {
            setNewlyUnlocked(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
                return [...prev, ...uniqueNew];
            });
        }

        return stateAfterAchievements;
    });
    setLoadingMessage('');
  }, [checkAndUnlockAchievements]);

  useEffect(() => {
    if (playerState) {
      localStorage.setItem('sagesPathGameState', JSON.stringify(playerState));
      if (!playerState.hasSeenNewDayModal && playerState.day > 1) {
        setShowNewDayModal(true);
      }

      // Check for automatic new day
      const now = new Date();
      const lastSessionDate = new Date(playerState.lastSessionTimestamp);
      if(now.getFullYear() > lastSessionDate.getFullYear() || now.getMonth() > lastSessionDate.getMonth() || now.getDate() > lastSessionDate.getDate()) {
          startNewDay(true); // Force start a new day if it's a new calendar day
      }

    }
  }, [playerState, startNewDay]);

  const startGame = useCallback(() => {
    setLoadingMessage("The Sage is preparing your first trials...");
    const firstDay = PREGENERATED_JOURNEY.find(j => j.day === 1);
    const missions: Mission[] = firstDay ? firstDay.missions.map(m => ({
        ...m,
        id: uuidv4(),
        isCompleted: false,
        xp: m.difficulty === 'Hard' ? firstDay.xp * 2 : firstDay.xp,
    })) : [];

    let newState = { ...initialPlayerState, missions, hasSeenNewDayModal: true, lastSessionTimestamp: Date.now() };
    newState.kazukiPowerLevels = initializeKazukiPowers({});
    setPlayerState(newState);
    setLoadingMessage('');
  }, []);

  const importState = useCallback((newState: PlayerState) => {
    setPlayerState(newState);
    setView('dashboard');
  }, []);

  const handleAbilityLevelUp = useCallback((currentState: PlayerState, abilityId: StatCategory): PlayerState => {
      const abilityLore = ALL_ABILITIES.find(a => a.id === abilityId);
      if (!abilityLore) return currentState;

      const currentLevel = currentState.abilityLevels[abilityId] || 1;
      let currentXp = currentState.abilityXp[abilityId] || 0;
      const xpPerLevel = abilityLore.xpPerLevel;

      if (currentXp < xpPerLevel) return currentState;
      
      let newLevel = currentLevel;
      while (currentXp >= xpPerLevel) {
          currentXp -= xpPerLevel;
          newLevel++;
      }

      return {
          ...currentState,
          abilityLevels: { ...currentState.abilityLevels, [abilityId]: newLevel },
          abilityXp: { ...currentState.abilityXp, [abilityId]: currentXp },
          testsAwaiting: { ...currentState.testsAwaiting, [abilityId]: true },
          currentTests: { ...currentState.currentTests, [abilityId]: undefined },
      };
  }, []);


  const handleLevelUp = useCallback(async (currentState: PlayerState): Promise<PlayerState> => {
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
        const missionExists = stateAfterLevelUp.missions.some(m => m.isTrialMission && m.title.includes(kazuki.name));

        if (stateAfterLevelUp.level >= kazuki.encounterLevel && !isAlreadyControlled && !missionExists) {
            setLoadingMessage(`A new presence reveals itself... The Sage is interpreting the trial of ${kazuki.name}...`);
            const trialData = await generateKazukiTrialMission(stateAfterLevelUp.level, kazuki);
            setLoadingMessage('');

            const kazukiPower = stateAfterLevelUp.kazukiPowerLevels[kazuki.name];

            const trialMission: Mission = {
                id: uuidv4(),
                title: `Trial of ${kazuki.name}: ${trialData.title}`,
                description: trialData.description,
                category: 'Soul',
                isCompleted: false,
                xp: 50, // Trials give some base XP
                powerPointsReward: Math.floor(kazukiPower / 5), // Reward is 20% of the demon's power
                difficulty: 'Hard',
                isTrialMission: true,
            };
            stateAfterLevelUp = {
                ...stateAfterLevelUp,
                missions: [...stateAfterLevelUp.missions, trialMission]
            };
        }
    }

    return stateAfterLevelUp;
  }, []);
  
  const completeMission = useCallback(async (id: string) => {
    const prevState = playerStateRef.current;
    if (!prevState) return;
    
    const mission = prevState.missions.find(m => m.id === id);
    if (!mission || mission.isCompleted) return;

    const newMissions = prevState.missions.map(m => 
      m.id === id ? { ...m, isCompleted: true } : m
    );
      
    const xpMultiplier = prevState.xpMultiplier || 1.0;
    const xpGained = Math.round(mission.xp * xpMultiplier);
    let newXp = prevState.xp + xpGained;
    let newSoulCoins = prevState.soulCoins;
    let newPowerPoints = prevState.powerPoints + Math.floor(xpGained * 2 / 5) + (mission.powerPointsReward || 0);
    
    const allCompleted = newMissions.every(m => m.isCompleted);
    if (allCompleted) {
      if (prevState.soundEnabled) audioService.playAllMissionsComplete();
      newXp += 10; 
      newSoulCoins += 2;
      newPowerPoints += Math.floor(10 * 2 / 5); // 4 power points
    } else {
      if (prevState.soundEnabled) audioService.playMissionComplete();
    }
    
    // Handle Activation Missions
    let newPermanentStats = { ...prevState.permanentStats };
    let newPendingActivations = [...prevState.pendingActivations];
    if (mission.isActivationMission && mission.activationId) {
        const activation = newPendingActivations.find(p => p.id === mission.activationId);
        if (activation) {
            const stat = activation.shopItemId;
            newPermanentStats[stat] = (newPermanentStats[stat] || 0) + activation.statBonus;
            newPendingActivations = newPendingActivations.filter(p => p.id !== mission.activationId);
        }
    }

    let tempState: PlayerState = {
      ...prevState,
      missions: newMissions,
      xp: newXp,
      soulCoins: newSoulCoins,
      powerPoints: newPowerPoints,
      completedMissionHistory: [...prevState.completedMissionHistory, mission.title],
      permanentStats: newPermanentStats,
      pendingActivations: newPendingActivations,
    };
    
    // Grant Ability XP
    const categoryToAbilityMap: Record<MissionCategory, StatCategory | null> = { 'Health': 'Physique', 'Mind': 'Intellect', 'Soul': 'Memory', 'Wealth': null };
    const mappedAbility = categoryToAbilityMap[mission.category];

    let stateAfterAbilityUpdate = tempState;
    if (mappedAbility) {
        const newAbilityXp = (tempState.abilityXp[mappedAbility] || 0) + Math.floor(xpGained / 2); // Gain half of XP as Ability XP
        stateAfterAbilityUpdate = {
            ...tempState,
            abilityXp: {
                ...tempState.abilityXp,
                [mappedAbility]: newAbilityXp,
            },
        };
        stateAfterAbilityUpdate = handleAbilityLevelUp(stateAfterAbilityUpdate, mappedAbility);
    }


    let stateAfterLevelUp = await handleLevelUp(stateAfterAbilityUpdate);
    
    const { newState: finalState, newlyUnlocked } = checkAndUnlockAchievements(stateAfterLevelUp);
    if (newlyUnlocked.length > 0) {
      setNewlyUnlocked(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
          return [...prev, ...uniqueNew];
      });
    }

    setPlayerState(finalState);
  }, [handleLevelUp, checkAndUnlockAchievements, handleAbilityLevelUp]);

  const completeReadingBlock = useCallback(async () => {
    const prevState = playerStateRef.current;
    if (!prevState || prevState.readingProgress >= 3) return;

    const xpRewards = [25, 20, 15];
    const xpEarned = xpRewards[prevState.readingProgress];
    
    if (prevState.soundEnabled) audioService.playMissionComplete();
    
    const xpMultiplier = prevState.xpMultiplier || 1.0;
    const xpGained = Math.round(xpEarned * xpMultiplier);

    const newIntellectXp = (prevState.abilityXp['Intellect'] || 0) + Math.floor(xpGained / 2);
    
    let tempState: PlayerState = {
        ...prevState,
        xp: prevState.xp + xpGained,
        powerPoints: prevState.powerPoints + Math.floor(xpGained * 2 / 5),
        readingProgress: prevState.readingProgress + 1,
        abilityXp: {
            ...prevState.abilityXp,
            Intellect: newIntellectXp,
        }
    };
    
    let stateAfterAbilityLevelUp = handleAbilityLevelUp(tempState, 'Intellect');
    let stateAfterLevelUp = await handleLevelUp(stateAfterAbilityLevelUp);
    
    const { newState: finalState, newlyUnlocked } = checkAndUnlockAchievements(stateAfterLevelUp);
    if (newlyUnlocked.length > 0) {
        setNewlyUnlocked(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNew = newlyUnlocked.filter(n => !existingIds.has(n.id));
            return [...prev, ...uniqueNew];
        });
    }
    
    setPlayerState(finalState);
  }, [handleLevelUp, checkAndUnlockAchievements, handleAbilityLevelUp]);

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

  const purchaseStatBoost = useCallback(async (itemId: StatCategory, pointsToBuy: number, cost: number, promptSuggestion: string): Promise<{success: boolean, reason?: string}> => {
      if (!playerState) return { success: false, reason: 'No player state.'};
      if (playerState.soulCoins < cost) return { success: false, reason: 'Not enough Soul Coins.'};

      setLoadingMessage("The Sage is forging your activation trial...");

      try {
          const missionData = await generateActivationMission(playerState.level, itemId, pointsToBuy, cost, promptSuggestion);
          
          const missionId = uuidv4();
          const activationId = uuidv4();

          const newMission: Mission = {
              ...missionData,
              id: missionId,
              category: 'Soul', // Activation missions are always Soul category
              isCompleted: false,
              xp: Math.floor(cost * 1.5), // High XP for activation
              isActivationMission: true,
              activationId: activationId
          };

          const newActivation: ActivationTrial = {
              id: activationId,
              shopItemId: itemId,
              statBonus: pointsToBuy,
              missionId: missionId
          };

          setPlayerState(p => {
              if (!p) return null;
              return {
                  ...p,
                  soulCoins: p.soulCoins - cost,
                  missions: [...p.missions, newMission],
                  pendingActivations: [...p.pendingActivations, newActivation],
              }
          });
          return { success: true };
      } catch (error) {
          console.error("Failed to generate activation mission:", error);
          return { success: false, reason: 'The Sage could not forge this trial. Please try again.'};
      } finally {
          setLoadingMessage("");
      }

  }, [playerState]);

  const controlKazuki = useCallback(async (kazukiName: string): Promise<{success: boolean, reason?: string}> => {
      if (!playerState) return { success: false, reason: 'No player state.'};
      
      const kazukiPower = playerState.boostedKazuki?.[kazukiName] || playerState.kazukiPowerLevels?.[kazukiName];
      if (!kazukiPower) return { success: false, reason: 'Kazuki power not found.'};
      if (playerState.powerPoints < kazukiPower) return { success: false, reason: 'Not enough Power Points.'};

      // Play sound
      if(playerState.soundEnabled) audioService.playAllMissionsComplete(); // A triumphant sound

      setPlayerState(p => {
          if (!p) return null;
          const newControlledKazuki = [...(p.controlledKazuki || []), kazukiName];
          const newXpMultiplier = (p.xpMultiplier || 1.0) + 0.1;
          
          return {
              ...p,
              powerPoints: p.powerPoints - kazukiPower,
              controlledKazuki: newControlledKazuki,
              xpMultiplier: newXpMultiplier,
          };
      });

      return { success: true };
  }, [playerState]);

  const startAbilityTest = useCallback(async (abilityId: StatCategory): Promise<string | null> => {
      if (!playerState || !playerState.testsAwaiting[abilityId]) return null;
      setLoadingMessage("The Sage is preparing your worthiness test...");
      try {
          const abilityLevel = playerState.abilityLevels[abilityId] || 1;
          const question = await generateAbilityTestQuestion(abilityId, abilityLevel);
          setPlayerState(p => p ? { ...p, currentTests: { ...p.currentTests, [abilityId]: { question, isSubmitted: false } } } : null);
          return question;
      } catch (error) {
          console.error(`Failed to generate ${abilityId} test:`, error);
          return "The Sage could not conjure a question. Please try again later.";
      } finally {
          setLoadingMessage("");
      }
  }, [playerState]);

  const submitAbilityTestAnswer = useCallback(async (abilityId: StatCategory, answer: string): Promise<{evaluation: string, isWorthy: boolean} | null> => {
      if (!playerState || !playerState.currentTests[abilityId]) return null;
      setLoadingMessage("The Sage is evaluating your response...");
      try {
          const { question } = playerState.currentTests[abilityId]!;
          const result = await evaluateAbilityTestAnswer(question, answer, abilityId);
          
          setPlayerState(p => {
              if (!p) return null;
              if (result.isWorthy) {
                  return { 
                      ...p, 
                      testsAwaiting: { ...p.testsAwaiting, [abilityId]: false },
                      currentTests: { ...p.currentTests, [abilityId]: undefined } 
                  };
              } else {
                  // Allow retry
                  const updatedTest = { ...p.currentTests[abilityId]!, isSubmitted: true };
                  return { ...p, currentTests: { ...p.currentTests, [abilityId]: updatedTest } };
              }
          });

          return result;

      } catch (error) {
          console.error(`Error submitting ${abilityId} test answer:`, error);
          return { evaluation: "The connection to the Sage was lost. Please try again.", isWorthy: false };
      } finally {
          setLoadingMessage("");
      }
  }, [playerState]);
  

  return {
    playerState,
    view,
    loadingMessage,
    showNewDayModal,
    newlyUnlocked,
    isGeneratingMission,
    activeAbility,
    startGame,
    importState,
    setView,
    selectAbility,
    completeMission,
    completeReadingBlock,
    startNewDay: () => startNewDay(true), // Manual start is always a force
    confirmNewDay,
    saveJournalEntry,
    addRecurringMission,
    deleteRecurringMission,
    toggleNotifications,
    toggleSound,
    resetGame,
    clearNewlyUnlocked,
    generateMissionByCategory,
    purchaseStatBoost,
    startAbilityTest,
    submitAbilityTestAnswer,
    controlKazuki,
  };
};