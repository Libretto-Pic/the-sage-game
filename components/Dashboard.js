
import React from 'react';
import { PlayerState } from '../types.js';
import DailyMissions from './DailyMissions.js';
import StatSheet from './StatSheet.js';
import UnlockedPowers from './UnlockedPowers.js';
import ReflectionJournal from './ReflectionJournal.js';
import EmergencyMissionCard from './EmergencyMissionCard.js';
import ReadingChallenge from './ReadingChallenge.js';
import { LEVEL_TITLES } from '../services/lore.js';

interface DashboardProps {
    playerState: PlayerState;
    saveJournalEntry: (entry: string) => void;
    onPracticeBreathing: (styleName: string) => void;
    completeReadingBlock: () => void;
}

const Dashboard = ({ playerState, saveJournalEntry, onPracticeBreathing, completeReadingBlock }: DashboardProps) => {
    const levelTitle = LEVEL_TITLES[playerState.level] || 'The Path Unfolds';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-serif text-slate-800">Day {playerState.day}: {levelTitle}</h1>
                <p className="mt-2 text-slate-600">The journey continues, Wanderer. What will you achieve today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ReadingChallenge progress={playerState.readingProgress} onComplete={completeReadingBlock} />
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
