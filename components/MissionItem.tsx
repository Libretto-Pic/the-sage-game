
// Implemented the MissionItem component to display individual mission details and actions.
import React from 'react';
import type { Mission } from '../types.ts';

interface MissionItemProps {
    mission: Mission;
    onComplete: (id: string) => void;
    isCompletable: boolean;
}

const MissionCategoryIcon: React.FC<{ category: Mission['category'] }> = ({ category }) => {
    const styles = {
        Health: { bg: 'bg-red-100', text: 'text-red-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
        Wealth: { bg: 'bg-green-100', text: 'text-green-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg> },
        Mind: { bg: 'bg-blue-100', text: 'text-blue-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> }
    };
    const { bg, text, icon } = styles[category];
    return <div className={`flex-shrink-0 p-3 rounded-full ${bg} ${text}`}>{icon}</div>;
}

const MissionItem: React.FC<MissionItemProps> = ({ mission, onComplete, isCompletable }) => {
    return (
        <div className={`p-4 rounded-lg flex items-center transition-colors duration-300 ${mission.isCompleted ? 'bg-slate-100' : 'bg-white border border-slate-200'}`}>
            <MissionCategoryIcon category={mission.category} />
            <div className="flex-grow mx-4">
                <p className={`font-bold text-slate-800 ${mission.isCompleted ? 'line-through text-slate-500' : ''}`}>{mission.title}</p>
                <p className={`text-sm text-slate-500 ${mission.isCompleted ? 'line-through' : ''}`}>{mission.description}</p>
            </div>
            <div className="flex items-center space-x-4">
                {isCompletable && (
                    <button 
                        onClick={() => onComplete(mission.id)}
                        disabled={mission.isCompleted}
                        className="flex-shrink-0 bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        {mission.isCompleted ? 'Done' : 'Complete'}
                    </button>
                )}
                <div className={`font-bold text-teal-600 transition-opacity duration-500 ${mission.isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                    +{mission.xp} XP
                </div>
            </div>
        </div>
    );
};

export default MissionItem;