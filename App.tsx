// Implemented the main App component to manage game state, views, and render the appropriate UI components. This includes handling loading states, the landing page for new users, and the main application layout with a sidebar.
import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyMissionsPage from './components/DailyMissionsPage';
import StatsAndProgress from './components/StatsAndProgress';
import BreathingCodex from './components/BreathingCodex';
import ReflectionJournalPage from './components/ReflectionJournalPage';
import BossBattlesPage from './components/BossBattlesPage';
import SoulShopPage from './components/SoulShopPage';
import LevelPage from './components/LevelPage';
import RitualsPage from './components/RitualsPage';
import SettingsPage from './components/SettingsPage';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import NewDayModal from './components/NewDayModal';
import { audioService } from './services/audioService';
import { exportPlayerState, importPlayerState } from './services/apiService';
import BreathingExercisePlayer from './components/BreathingExercisePlayer';
import type { BreathingStyle } from './types';
import { BREATHING_STYLES } from './constants';

const App: React.FC = () => {
    const { playerState, isLoading, view, showNewDayModal, actions } = useGameState();
    const [activeExercise, setActiveExercise] = useState<BreathingStyle | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };
    
    // Initialize audio context on the first user interaction
    const handleStartGame = () => {
        audioService.init();
        actions.startGame();
    };
    
    const handleExport = () => {
        if (playerState) {
            exportPlayerState(playerState);
        }
    };

    const handleImport = async () => {
        const importedState = await importPlayerState(showToast);
        if (importedState) {
            audioService.init();
            actions.overwriteState(importedState);
            actions.setView('dashboard');
        }
    };

    const handlePracticeBreathing = (styleName: string) => {
        // FIX: Corrected a typo from BREATHING_STYYLES to BREATHING_STYLES.
        const style = BREATHING_STYLES.find(s => s.name === styleName);
        if (style && style.structuredTechnique) {
            setActiveExercise(style);
        }
    };
    
    const handleToggleNotifications = async () => {
        const success = await actions.toggleNotifications();
        if (!success) {
            showToast("Notification permission was not granted. Please enable it in your browser settings.", 'error');
        } else {
             const message = playerState?.notificationsEnabled ? "Notifications disabled." : "Notifications enabled!";
             showToast(message, 'success');
        }
    };

    const renderContent = () => {
        if (!playerState) return null;

        switch (view) {
            case 'dashboard':
                return <Dashboard playerState={playerState} saveJournalEntry={actions.saveJournalEntry} onPracticeBreathing={handlePracticeBreathing} />;
            case 'missions':
                return <DailyMissionsPage missions={playerState.missions} onCompleteMission={actions.completeMission} dailySummary={playerState.dailySummary} />;
            case 'progress':
                return <StatsAndProgress playerState={playerState} />;
            case 'codex':
                return <BreathingCodex playerLevel={playerState.level} onPractice={handlePracticeBreathing} />;
            case 'journal':
                return <ReflectionJournalPage saveJournalEntry={actions.saveJournalEntry} journalEntries={playerState.journalEntries} />;
            case 'bosses':
                return <BossBattlesPage />;
            case 'shop':
                return <SoulShopPage />;
            case 'levels':
                return <LevelPage playerLevel={playerState.level} />;
            case 'rituals':
                return <RitualsPage recurringMissions={playerState.recurringMissions} addRecurringMission={actions.addRecurringMission} deleteRecurringMission={actions.deleteRecurringMission} />;
            case 'settings':
                return <SettingsPage notificationsEnabled={playerState.notificationsEnabled} onToggleNotifications={handleToggleNotifications} />;
            default:
                return <Dashboard playerState={playerState} saveJournalEntry={actions.saveJournalEntry} onPracticeBreathing={handlePracticeBreathing} />;
        }
    };

    if (isLoading) {
        return <LoadingScreen message="The Sage is contemplating your path..." />;
    }

    if (!playerState) {
        return <LandingPage onStart={handleStartGame} onImport={handleImport} />;
    }

    return (
        <div className="flex bg-slate-100 min-h-screen font-sans">
            <Sidebar 
                currentView={view} 
                setView={actions.setView} 
                playerLevel={playerState.level}
                onExport={handleExport}
                onImport={handleImport}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm p-8">
                     {renderContent()}
                </div>
            </main>
            {toast && (
                <div 
                    className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-2xl text-white font-bold ${toast.type === 'success' ? 'bg-teal-500' : 'bg-red-500'} animate-fade-in-up z-50`}
                >
                    {toast.message}
                </div>
            )}
            {showNewDayModal && <NewDayModal onConfirm={actions.startNewDay} />}
            {activeExercise && activeExercise.structuredTechnique && (
                <BreathingExercisePlayer
                    exercise={activeExercise}
                    onClose={() => setActiveExercise(null)}
                />
            )}
            <style>{`
                @keyframes fade-in-up {
                  0% {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fade-in-up {
                  animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default App;