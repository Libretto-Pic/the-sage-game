// Implemented the useGameState hook to manage all player state and game logic.
import { useState, useEffect, useCallback } from 'react';
import type { PlayerState, Mission, RecurringMission } from '../types';
import { XP_PER_LEVEL, MISSION_CATEGORIES } from '../constants';
import { generateNewMissions } from '../services/geminiService';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

// A simple UUID generator to avoid external dependencies.
const uuidv4 = () => `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (parseInt(c, 10) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c, 10) / 4).toString(16));

const initialPlayerState: PlayerState = {
  level: 30,
  xp: 0,
  stats: { hp: 100, mp: 100, sp: 100, rp: 100 },
  soulCoins: 0,
  lastPlayedDate: null,
  journalEntries: [],
  day: 1,
  missions: [],
  recurringMissions: [],
};

const useGameState = () => {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewDay, setIsNewDay] = useState(false);
  const [isGeneratingMissions, setIsGeneratingMissions] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sages-path-gamestate');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Ensure recurringMissions is present
        if (!parsedState.recurringMissions) {
          parsedState.recurringMissions = [];
        }
        setPlayerState(parsedState);
      } else {
        setPlayerState(initialPlayerState);
      }
    } catch (e) {
      console.error("Failed to load game state:", e);
      setError("Could not load your progress. Starting fresh.");
      setPlayerState(initialPlayerState);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (playerState) {
      try {
        localStorage.setItem('sages-path-gamestate', JSON.stringify(playerState));
      } catch (e) {
        console.error("Failed to save game state:", e);
        setError("Could not save your progress.");
      }
    }
  }, [playerState]);

  const startNewDay = useCallback(async () => {
    if (!playerState) return;
    
    setIsGeneratingMissions(true);
    try {
      const missionsForToday: Mission[] = [];
      const categoriesFilled = new Set<string>();

      // 1. Process recurring missions
      if (playerState.recurringMissions) {
        playerState.recurringMissions.forEach(rm => {
          let isDue = false;
          if (rm.frequencyType === 'daily') {
            isDue = true;
          } else if (rm.frequencyType === 'every_x_days' && rm.frequencyValue > 0) {
            if ((playerState.day - rm.startDay) % rm.frequencyValue === 0) {
              isDue = true;
            }
          }

          if (isDue && !categoriesFilled.has(rm.category)) {
            missionsForToday.push({
              id: uuidv4(),
              title: rm.title,
              description: rm.description,
              category: rm.category,
              xp: 15, // Recurring missions are worth slightly more
              isCompleted: false,
            });
            categoriesFilled.add(rm.category);
          }
        });
      }

      const categoriesToGenerate = MISSION_CATEGORIES.filter(c => !categoriesFilled.has(c));
      let aiMissions: Mission[] = [];

      // 2. Generate remaining missions with Gemini
      if (categoriesToGenerate.length > 0) {
        const newMissionTemplates = await generateNewMissions(playerState.level, [], categoriesToGenerate);
        aiMissions = newMissionTemplates.map(m => ({
          ...m,
          id: uuidv4(),
          isCompleted: false,
          xp: 10 + Math.floor(playerState.level / 10) * 5,
        }));
      }

      const allNewMissions = [...missionsForToday, ...aiMissions];

      setPlayerState(prevState => {
        if (!prevState) return null;
        const isFirstDay = prevState.lastPlayedDate === null;
        return {
          ...prevState,
          missions: allNewMissions,
          lastPlayedDate: getTodayDateString(),
          day: isFirstDay ? 1 : prevState.day + 1,
        };
      });
      setIsNewDay(false);
    } catch(e) {
      console.error("Failed to start new day:", e);
      setError("The Sage could not divine your new missions. Please try again.");
    } finally {
      setIsGeneratingMissions(false);
    }
  }, [playerState]);
  
  useEffect(() => {
    if (playerState && !isLoading) {
      const today = getTodayDateString();
      if (playerState.lastPlayedDate !== today) {
        setIsNewDay(true);
      }
    }
  }, [playerState, isLoading]);


  const completeMission = (missionId: string) => {
    setPlayerState(prevState => {
      if (!prevState) return null;

      let missionCompleted: Mission | undefined;
      const updatedMissions = prevState.missions.map(m => {
        if (m.id === missionId && !m.isCompleted) {
          missionCompleted = m;
          return { ...m, isCompleted: true };
        }
        return m;
      });

      if (!missionCompleted) return prevState;

      const newXp = prevState.xp + missionCompleted.xp;
      const newLevel = prevState.level + Math.floor(newXp / XP_PER_LEVEL);
      const remainingXp = newXp % XP_PER_LEVEL;

      const newStats = newLevel > prevState.level 
        ? { hp: 100, mp: 100, sp: 100, rp: 100 }
        : { ...prevState.stats }; 
      
      newStats.mp = Math.max(0, newStats.mp - 10);
      newStats.sp = Math.max(0, newStats.sp - 5);

      return {
        ...prevState,
        missions: updatedMissions,
        xp: remainingXp,
        level: newLevel,
        stats: newStats
      };
    });
  };
  
  const saveJournalEntry = (entry: string) => {
    setPlayerState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        journalEntries: [...prevState.journalEntries, entry],
        stats: {
          ...prevState.stats,
          rp: Math.min(100, prevState.stats.rp + 15),
        }
      }
    })
  };

  const startGame = () => {
      if (playerState?.lastPlayedDate === null) {
          startNewDay();
      }
  };

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
        recurringMissions: [...prevState.recurringMissions, newMission],
      };
    });
  }, []);

  const deleteRecurringMission = useCallback((missionId: string) => {
    setPlayerState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        recurringMissions: prevState.recurringMissions.filter(m => m.id !== missionId),
      };
    });
  }, []);

  return {
    playerState,
    isLoading: isLoading || isGeneratingMissions,
    loadingMessage: isGeneratingMissions ? "The Sage is divining your tasks for the day..." : "Awakening your inner spirit...",
    error,
    isNewDay,
    actions: {
      completeMission,
      saveJournalEntry,
      startNewDay,
      startGame,
      addRecurringMission,
      deleteRecurringMission,
    },
  };
};

export default useGameState;