// Implemented the DailyMissions component to display missions on the dashboard and missions page.
import React from 'react';
import type { Mission } from '../types.js';
import MissionItem from './MissionItem.js';

interface DailyMissionsProps {
    missions: Mission[];
    onCompleteMission: (id: string) => void;
    isPreview?: boolean;
}

const DailyMissions: React.FC<DailyMissionsProps> = ({ missions, onCompleteMission, isPreview = false }) => {
    const title = isPreview ? "Today's Trials" : "Daily Missions";
    const description = isPreview 
        ? "A summary of your objectives. Navigate to the Missions tab to complete them."
        : "Complete these 3 missions to earn XP and strengthen your resolve.";

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">{description}</p>
            
            <div className="space-y-4">
                {missions && missions.length > 0 ? (
                    missions.map(mission => (
                        <MissionItem 
                            key={mission.id}
                            mission={mission}
                            onComplete={onCompleteMission}
                            isCompletable={!isPreview}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500">Missions for today are being generated...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyMissions;