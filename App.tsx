// Implemented the main App component to manage views, state, and routing.
import React, { useState, useEffect } from 'react';
import useGameState from './hooks/useGameState';

import LoadingScreen from './components/LoadingScreen';
import NewDayModal from './components/NewDayModal';
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
import type { View } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
    const { playerState, isLoading, loadingMessage, error, isNewDay, actions } = useGameState();
    const [currentView, setCurrentView] = useState<View>('dashboard');

    // Initialize audio context on first user interaction (app load)
    useEffect(() => {
        const initAudio = () => {
            audioService.init();
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };

        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);
        
        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
    }, []);

    if (isLoading || !playerState) {
        return <LoadingScreen message={loadingMessage || "Waking the ancient spirits..."} />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard playerState={playerState} saveJournalEntry={actions.saveJournalEntry} />;
            case 'missions':
                return <DailyMissionsPage missions={playerState.missions} onCompleteMission={actions.completeMission} />;
            case 'progress':
                return <StatsAndProgress playerState={playerState} />;
            case 'codex':
                return <BreathingCodex playerLevel={playerState.level} />;
            case 'journal':
                return <ReflectionJournalPage saveJournalEntry={actions.saveJournalEntry} journalEntries={playerState.journalEntries} />;
            case 'bosses':
                return <BossBattlesPage />;
            case 'shop':
                return <SoulShopPage />;
            case 'levels':
                return <LevelPage playerLevel={playerState.level} />;
            case 'rituals':
                return <RitualsPage 
                            recurringMissions={playerState.recurringMissions} 
                            addRecurringMission={actions.addRecurringMission}
                            deleteRecurringMission={actions.deleteRecurringMission} 
                        />;
            default:
                return <Dashboard playerState={playerState} saveJournalEntry={actions.saveJournalEntry} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            {isNewDay && <NewDayModal onConfirm={actions.startNewDay} />}
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} playerLevel={playerState.level} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
                {renderView()}
            </main>
        </div>
    );
};

export default App;