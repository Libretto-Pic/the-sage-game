// Implemented the dedicated page for viewing and completing daily missions.
import React from 'react';
import type { Mission } from '../types';
import DailyMissions from './DailyMissions';

interface DailyMissionsPageProps {
    missions: Mission[];
    onCompleteMission: (id: string) => void;
}

const DailyMissionsPage: React.FC<DailyMissionsPageProps> = ({ missions, onCompleteMission }) => {
    const completedCount = missions.filter(m => m.isCompleted).length;
    const allCompleted = missions.length > 0 && completedCount === missions.length;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Today's Trials ({completedCount}/{missions.length})</h2>
                <p className="text-slate-600">Forge your will, one task at a time. The path to enlightenment is paved with small, consistent victories.</p>
            </div>
            
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
