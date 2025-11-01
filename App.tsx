
import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import DailyMissionsPage from './components/DailyMissionsPage.tsx';
import StatsAndProgress from './components/StatsAndProgress.tsx';
import LevelPage from './components/LevelPage.tsx';
import BreathingCodex from './components/BreathingCodex.tsx';
import ReflectionJournalPage from './components/ReflectionJournalPage.tsx';
import RitualsPage from './components/RitualsPage.tsx';
import BossBattlesPage from './components/BossBattlesPage.tsx';
import SoulShopPage from './components/SoulShopPage.tsx';
import SettingsPage from './components/SettingsPage.tsx';
import LandingPage from './components/LandingPage.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import NewDayModal from './components/NewDayModal.tsx';
import BreathingExercisePlayer from './components/BreathingExercisePlayer.tsx';
import AchievementsPage from './components/AchievementsPage.tsx';
import { PREGENERATED_JOURNEY } from './services/pregeneratedMissions.ts';
import { exportPlayerState, importPlayerState } from './services/apiService.ts';
import { audioService } from './services/audioService.ts';
import { BREATHING_STYLES } from './services/lore.ts';
import type { PlayerState } from './types.ts';


// A simple Toast provider and hook to show notifications
const ToastContext = React.createContext<(message: string, type: 'success' | 'error') => void>(() => {});

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [toasts, setToasts] = useState<{id: number; message: string; type: 'success' | 'error'}[]>([]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`px-6 py-3 rounded-md text-white shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};


const AppContent: React.FC = () => {
    const { 
        playerState, view, loadingMessage, showNewDayModal, newlyUnlocked,
        startGame, importState, setView, completeMission, 
        startNewDay, confirmNewDay, saveJournalEntry,
        addRecurringMission, deleteRecurringMission, toggleNotifications,
        toggleSound, resetGame, clearNewlyUnlocked
    } = useGameState();
    const [activeBreathingExercise, setActiveBreathingExercise] = useState<string | null>(null);
    
    const showToast = useToast();

    // Moved this hook to the top of the component to obey the Rules of Hooks.
    // It must be called unconditionally on every render.
    React.useEffect(() => {
        const init = () => {
            audioService.init();
            window.removeEventListener('click', init);
        };
        window.addEventListener('click', init);
        return () => window.removeEventListener('click', init);
    }, []);

    React.useEffect(() => {
        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach(achievement => {
                showToast(`🏆 Achievement Unlocked: ${achievement.name}`, 'success');
            });
            clearNewlyUnlocked();
        }
    }, [newlyUnlocked, showToast, clearNewlyUnlocked]);

    const handleImport = async () => {
        const state: PlayerState | null = await importPlayerState(showToast);
        if (state) {
            importState(state);
        }
    };

    const handleExport = () => {
        if (playerState) {
            exportPlayerState(playerState);
            showToast("Progress exported successfully!", 'success');
        }
    };

    const handleToggleNotifications = async () => {
        if (!playerState) return;
        const success = await toggleNotifications();
        if (playerState.notificationsEnabled) {
             showToast("Notifications disabled.", 'success');
        } else {
            if (success) {
                showToast("Notifications enabled!", 'success');
            } else {
                showToast("Notification permissions were not granted.", 'error');
            }
        }
    };

    if (loadingMessage) {
        return <LoadingScreen message={loadingMessage} />;
    }

    if (!playerState) {
        return <LandingPage onStart={startGame} onImport={handleImport} />;
    }

    const allMissionsCompleted = playerState.missions.every(m => m.isCompleted);
    const dailySummary = PREGENERATED_JOURNEY.find(d => d.day === playerState.day);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard playerState={playerState} saveJournalEntry={saveJournalEntry} onPracticeBreathing={setActiveBreathingExercise} />;
            case 'missions':
                return <DailyMissionsPage missions={playerState.missions} onCompleteMission={completeMission} dailySummary={dailySummary ? {title: dailySummary.title, realm: dailySummary.realm, xpPerMission: dailySummary.xp, breathStyle: dailySummary.breathStyle, kazukiWatch: dailySummary.kazukiWatch } : null} />;
            case 'progress':
                return <StatsAndProgress playerState={playerState} />;
            case 'levels':
                return <LevelPage playerLevel={playerState.level} />;
            case 'codex':
                return <BreathingCodex playerLevel={playerState.level} onPractice={setActiveBreathingExercise} />;
            case 'journal':
                return <ReflectionJournalPage saveJournalEntry={saveJournalEntry} journalEntries={playerState.journalEntries} />;
            case 'rituals':
                return <RitualsPage recurringMissions={playerState.recurringMissions} addRecurringMission={addRecurringMission} deleteRecurringMission={deleteRecurringMission} />;
            case 'achievements':
                return <AchievementsPage unlockedAchievements={playerState.unlockedAchievements} />;
            case 'bosses':
                return <BossBattlesPage />;
            case 'shop':
                return <SoulShopPage />;
            case 'settings':
                return <SettingsPage 
                            notificationsEnabled={playerState.notificationsEnabled} 
                            onToggleNotifications={handleToggleNotifications}
                            soundEnabled={playerState.soundEnabled}
                            onToggleSound={toggleSound}
                            onResetGame={resetGame}
                        />;
            default:
                return <Dashboard playerState={playerState} saveJournalEntry={saveJournalEntry} onPracticeBreathing={setActiveBreathingExercise}/>;
        }
    };
    
    const exercise = BREATHING_STYLES.find(bs => bs.name === activeBreathingExercise);

    return (
        <div className="flex bg-slate-100 min-h-screen font-sans">
            {showNewDayModal && <NewDayModal onConfirm={confirmNewDay} />}
            {exercise && <BreathingExercisePlayer exercise={exercise} onClose={() => setActiveBreathingExercise(null)} />}
            
            <Sidebar currentView={view} setView={setView} playerLevel={playerState.level} onExport={handleExport} onImport={handleImport} />

            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
                {allMissionsCompleted && view !== 'missions' && playerState.missions.length > 0 && (
                    <div className="fixed bottom-8 right-8">
                         <button
                            onClick={startNewDay}
                            className="bg-teal-500 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-2xl transition-transform duration-300 hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
                        >
                            Begin New Day
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};


const App = () => (
    <ToastProvider>
        <AppContent />
    </ToastProvider>
);

export default App;