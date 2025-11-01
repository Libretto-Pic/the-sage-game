
import React from 'react';
import { Mission, DailySummary } from '../types.js';
import DailyMissions from './DailyMissions.js';
import ReadingChallenge from './ReadingChallenge.js';

interface DailyMissionsPageProps {
    missions: Mission[];
    onCompleteMission: (id: string) => void;
    dailySummary: DailySummary | null;
    readingProgress: number;
    onCompleteReadingBlock: () => void;
}

const DailyMissionsPage = ({ missions, onCompleteMission, dailySummary, readingProgress, onCompleteReadingBlock }: DailyMissionsPageProps) => {
    const completedCount = missions.filter(m => m.isCompleted).length;
    const allCompleted = missions.length > 0 && completedCount === missions.length;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                {dailySummary && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h1 className="text-xl font-bold font-serif text-slate-700">{dailySummary.title}</h1>
                        <p className="text-sm text-slate-500 font-semibold">🧬 {dailySummary.realm}</p>
                        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <span><strong>XP per Task:</strong> {dailySummary.xpPerMission}</span>
                            <span><strong>Recommended Breath:</strong> {dailySummary.breathStyle}</span>
                            <span className="col-span-1 sm:col-span-2"><strong>Kazuki Watch:</strong> {dailySummary.kazukiWatch}</span>
                        </div>
                    </div>
                )}
                <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Today's Trials ({completedCount}/{missions.length})</h2>
                <p className="text-slate-600">Forge your will, one task at a time. The path to enlightenment is paved with small, consistent victories.</p>
            </div>
            
            <ReadingChallenge progress={readingProgress} onComplete={onCompleteReadingBlock} />
            <DailyMissions missions={missions} onCompleteMission={onCompleteMission} isPreview={false} />

            {allCompleted && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-6 rounded-xl shadow-sm text-center">
                    <h3 className="text-xl font-bold">All Trials Conquered!</h3>
                    <p className="mt-2">You have demonstrated discipline and resolve. The Sage is pleased. Rest and reflect on your victories.</p>
                </div>
            )}
        </div>
    );
};

export default DailyMissionsPage;
