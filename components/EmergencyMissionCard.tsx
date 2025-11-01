
import React from 'react';

interface EmergencyMissionCardProps {
    onPracticeBreathing: (styleName: string) => void;
}

const EmergencyMissionCard: React.FC<EmergencyMissionCardProps> = ({ onPracticeBreathing }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-400">
            <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-full bg-yellow-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Emergency Protocol: The Fog</h3>
                    <p className="text-sm text-slate-500 font-medium">WHEN CHAOS REIGNS</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
                Feeling overwhelmed or lost in the digital haze? The path is slipping. Recenter immediately.
            </p>
            <button 
                onClick={() => onPracticeBreathing('Breath of Stone (Box Breathing)')}
                className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:bg-yellow-600"
            >
                Perform Breath of Stone (~3 min)
            </button>
        </div>
    );
};

export default EmergencyMissionCard;
