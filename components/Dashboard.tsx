// Implemented the Dashboard component to serve as the main landing view.
import React from 'react';
import type { PlayerState } from '../types';
import DailyMissions from './DailyMissions';
import StatSheet from './StatSheet';
import UnlockedPowers from './UnlockedPowers';
import ReflectionJournal from './ReflectionJournal';
import EmergencyMissionCard from './EmergencyMissionCard';

interface DashboardProps {
    playerState: PlayerState;
    saveJournalEntry: (entry: string) => void;
    onPracticeBreathing: (styleName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ playerState, saveJournalEntry, onPracticeBreathing }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-serif text-slate-800">Day {playerState.day}: The Path Unfolds</h1>
                <p className="mt-2 text-slate-600">The journey continues, Wanderer. What will you achieve today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DailyMissions missions={playerState.missions} onCompleteMission={() => {}} isPreview />
                    <StatSheet stats={playerState.stats} />
                </div>

                <div className="space-y-6">
                    <UnlockedPowers playerLevel={playerState.level} />
                    <EmergencyMissionCard onPracticeBreathing={onPracticeBreathing} />
                    <ReflectionJournal saveJournalEntry={saveJournalEntry} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;