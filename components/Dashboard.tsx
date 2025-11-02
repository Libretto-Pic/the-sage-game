// Implemented the Dashboard component to serve as the main landing view.
import React from 'react';
import type { PlayerState } from '../types.ts';
import DailyMissions from './DailyMissions.tsx';
import StatSheet from './StatSheet.tsx';
import UnlockedPowers from './UnlockedPowers.tsx';
import ReflectionJournal from './ReflectionJournal.tsx';
import EmergencyMissionCard from './EmergencyMissionCard.tsx';
import ReadingChallenge from './ReadingChallenge.tsx';
import PowerPointsTracker from './PowerPointsTracker.tsx';
import SageGuidanceCard from './SageGuidanceCard.tsx';
import { LEVEL_TITLES } from '../services/lore.ts';

interface DashboardProps {
    playerState: PlayerState;
    saveJournalEntry: (entry: string) => void;
    onPracticeBreathing: (styleName: string) => void;
    completeReadingBlock: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ playerState, saveJournalEntry, onPracticeBreathing, completeReadingBlock }) => {
    const levelTitle = LEVEL_TITLES[playerState.level] || 'The Path Unfolds';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-serif text-slate-800">Day {playerState.day}: {levelTitle}</h1>
                <p className="mt-2 text-slate-600">The journey continues, Wanderer. What will you achieve today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {playerState.day <= 3 && <SageGuidanceCard />}
                    <ReadingChallenge progress={playerState.readingProgress} onComplete={completeReadingBlock} />
                    <DailyMissions missions={playerState.missions} onCompleteMission={() => {}} isPreview />
                    <StatSheet stats={playerState.stats} />
                </div>

                <div className="space-y-6">
                    <PowerPointsTracker powerPoints={playerState.powerPoints} />
                    <UnlockedPowers playerLevel={playerState.level} />
                    <EmergencyMissionCard onPracticeBreathing={onPracticeBreathing} />
                    <ReflectionJournal saveJournalEntry={saveJournalEntry} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;