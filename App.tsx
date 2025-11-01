
import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyMissionsPage from './components/DailyMissionsPage';
import StatsAndProgress from './components/StatsAndProgress';
import LevelPage from './components/LevelPage';
import BreathingCodex from './components/BreathingCodex';
import ReflectionJournalPage from './components/ReflectionJournalPage';
import RitualsPage from './components/RitualsPage';
import BossBattlesPage from './components/BossBattlesPage';
import SoulShopPage from './components/SoulShopPage';
import SettingsPage from './components/SettingsPage';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import NewDayModal from './components/NewDayModal';
import BreathingExercisePlayer from './components/BreathingExercisePlayer';
import { PREGENERATED_JOURNEY } from './services/pregeneratedMissions';
import { exportPlayerState, importPlayerState } from './services/apiService';
import { audioService } from './services/audioService';
import { notificationService } from './services/notificationService';
import { BREATHING_STYLES } from './constants';
import type { PlayerState } from './types';


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
        playerState, view, loadingMessage, showNewDayModal,
        startGame, importState, setView, completeMission, 
        startNewDay, confirmNewDay, saveJournalEntry,
        addRecurringMission, deleteRecurringMission 
    } = useGameState();
    const [activeBreathingExercise, setActiveBreathingExercise] = useState<string | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(notificationService.getPermissionStatus() === 'granted');

    const showToast = useToast();

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

    const toggleNotifications = async () => {
        if (notificationsEnabled) {
            setNotificationsEnabled(false);
            showToast("Notifications disabled in-app.", 'success');
        } else {
            const permission = await notificationService.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
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

    // Initialize audio on first user interaction
    React.useEffect(() => {
        const init = () => {
            audioService.init();
            window.removeEventListener('click', init);
        };
        window.addEventListener('click', init);
        return () => window.removeEventListener('click', init);
    }, []);

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
            case 'bosses':
                return <BossBattlesPage />;
            case 'shop':
                return <SoulShopPage />;
            case 'settings':
                return <SettingsPage notificationsEnabled={notificationsEnabled} onToggleNotifications={toggleNotifications} />;
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
