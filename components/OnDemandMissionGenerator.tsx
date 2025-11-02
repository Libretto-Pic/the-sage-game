import React from 'react';
import type { MissionCategory, PlayerState } from '../types.ts';

const CategoryIcon: React.FC<{ category: MissionCategory }> = ({ category }) => {
    const icons = {
        Health: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        Wealth: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
        Mind: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        Soul: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    };
    return icons[category];
};

const PowerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.268l4.263 4.264a1 1 0 01-.707 1.707l-4.263-4.263V18a1 1 0 01-2 0V8.972l-4.263 4.263a1 1 0 01-1.414 0 1 1 0 010-1.414L8 7.586V2a1 1 0 01.707-.954 1 1 0 011.586 0z" clipRule="evenodd" />
    </svg>
);

interface OnDemandMissionGeneratorProps {
    playerState: PlayerState;
    onGenerate: (category: MissionCategory) => void;
    isGenerating: boolean;
}

const CATEGORIES: MissionCategory[] = ['Health', 'Wealth', 'Mind', 'Soul'];
const COST = 15;
const DAILY_LIMIT = 2;

const OnDemandMissionGenerator: React.FC<OnDemandMissionGeneratorProps> = ({ playerState, onGenerate, isGenerating }) => {
    const { powerPoints, onDemandMissionsGeneratedToday = 0 } = playerState;
    const canAfford = powerPoints >= COST;
    const remainingGenerations = DAILY_LIMIT - onDemandMissionsGeneratedToday;
    const limitReached = remainingGenerations <= 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-teal-500">
             <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Seek Further Trials</h3>
                 <p className="text-sm text-slate-600 mt-1">
                    Your daily trials are complete, but the path is endless. Expend your Essence of Will to forge a new challenge.
                </p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">You can forge up to {DAILY_LIMIT} extra trials per day. ({remainingGenerations} left)</p>
            </div>
            
            <div className="flex items-center justify-center mb-4 text-sm font-semibold">
                <div className="flex items-center justify-end text-slate-700 mr-4">
                    <span className="mr-1">Cost: {COST}</span>
                    <PowerIcon />
                </div>
                 <p className={`text-xs ${canAfford ? 'text-slate-500' : 'text-red-500'}`}>
                    (Your Essence: {powerPoints})
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => onGenerate(category)}
                        disabled={!canAfford || isGenerating || limitReached}
                        className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-200 transition-all duration-200 enabled:hover:bg-slate-100 enabled:hover:border-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CategoryIcon category={category} />
                        <span className="mt-2 font-bold text-slate-700">{category}</span>
                    </button>
                ))}
            </div>

            {isGenerating && (
                <p className="text-center text-sm text-slate-500 mt-4 animate-pulse">The Sage is contemplating...</p>
            )}
        </div>
    );
};

export default OnDemandMissionGenerator;
