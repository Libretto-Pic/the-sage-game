import React, { useState } from 'react';
import type { Kazuki } from '../types.ts';

const StrengthIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

const WeaknessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17l-5-5m0 0l5-5m-5 5h12" />
    </svg>
);

interface KazukiProfileProps {
    kazuki: Kazuki;
    playerPowerPoints: number;
    isControlled: boolean;
    boostedPower?: number;
    powerLevel: number;
    onControl: (kazukiName: string) => Promise<{success: boolean, reason?: string}>;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const KazukiProfile: React.FC<KazukiProfileProps> = ({ kazuki, playerPowerPoints, isControlled, boostedPower, powerLevel, onControl, showToast }) => {
    const [isControlling, setIsControlling] = useState(false);
    const currentPower = boostedPower || powerLevel;
    const powerRatio = Math.min((playerPowerPoints / currentPower) * 100, 100);
    const canControl = playerPowerPoints >= currentPower;

    const handleControl = async () => {
        setIsControlling(true);
        const result = await onControl(kazuki.name);
        if (result.success) {
            showToast(`${kazuki.name} has been controlled! Your resolve deepens.`, 'success');
        } else {
            showToast(result.reason || `Failed to control ${kazuki.name}.`, 'error');
        }
        setIsControlling(false);
    }

    if (isControlled) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-500">
                <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-slate-200">
                    <p className="font-bold uppercase tracking-widest text-sm text-green-600">CONTROLLED</p>
                    <h3 className="text-4xl font-bold font-serif mt-1 text-slate-800">{kazuki.name}</h3>
                    <p className="text-lg text-slate-500">{kazuki.title}</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-700 italic bg-green-50 p-4 rounded-lg border border-green-200">"You have tamed this inner demon. Its power over you is broken. Remain vigilant, for the shadows of old habits are long."</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-slate-200">
                <p className="font-bold uppercase tracking-widest text-sm text-red-600">{kazuki.difficulty} Kazuki</p>
                <h3 className="text-4xl font-bold font-serif mt-1 text-slate-800">{kazuki.name}</h3>
                <p className="text-lg text-slate-500">{kazuki.title}</p>
            </div>

            {/* Sage's Notes */}
            <div className="mb-6">
                 <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-2">Sage's Notes</h4>
                 <p className="text-slate-700 italic text-center bg-slate-50 p-4 rounded-lg border border-slate-200">{kazuki.description}</p>
            </div>
            
            {/* Details */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="font-semibold text-slate-500 text-xs uppercase">Origin</p>
                    <p className="font-bold text-slate-800">{kazuki.origin}</p>
                </div>
                 <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="font-semibold text-slate-500 text-xs uppercase">Domain</p>
                    <p className="font-bold text-slate-800">{kazuki.domain}</p>
                </div>
            </div>

            {/* Power Bar */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-2 text-center">Power Struggle</h4>
                 {boostedPower && (
                    <p className="text-center text-sm font-semibold text-red-600 mb-2 animate-pulse">
                        Your neglect has strengthened this Kazuki!
                    </p>
                )}
                <div className="bg-red-200 rounded-full h-6 p-1 border border-red-300 shadow-inner">
                    <div 
                        className="bg-teal-500 h-full rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                        style={{ width: `${powerRatio}%` }}
                    >
                        {powerRatio > 15 ? `${playerPowerPoints}` : ''}
                    </div>
                </div>
                <div className="flex justify-between text-sm font-bold mt-1">
                    <span className="text-teal-600">Your Power: {playerPowerPoints}</span>
                    <span className="text-red-600">{kazuki.name}'s Power: {currentPower}</span>
                </div>
                
                {canControl ? (
                     <button 
                        onClick={handleControl}
                        disabled={isControlling}
                        className="w-full mt-4 bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-400"
                    >
                       {isControlling ? 'Controlling...' : `Attempt Control (${currentPower} PP)`}
                    </button>
                ) : (
                    <p className="text-center text-sm text-slate-500 mt-2">Complete trials to gather enough power to overcome this demon.</p>
                )}
            </div>


            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-slate-200">
                <div>
                    <h4 className="font-bold text-red-700 mb-3 text-center">How It Strengthens</h4>
                    <ul className="space-y-3">
                        {kazuki.strengths.map((item, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1"><StrengthIcon /></div>
                                <span className="text-slate-600 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-green-700 mb-3 text-center">How to Weaken It</h4>
                     <ul className="space-y-3">
                        {kazuki.weaknesses.map((item, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1"><WeaknessIcon /></div>
                                <span className="text-slate-600 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default KazukiProfile;