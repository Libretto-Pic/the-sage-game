import React, { useState } from 'react';
import { BREATHING_STYLES } from '../constants';
import type { BreathingStyle as BreathingStyleType } from '../types';
import BreathingExercisePlayer from './BreathingExercisePlayer';

interface BreathingCodexProps {
    playerLevel: number;
}

const BreathingStyle: React.FC<{style: BreathingStyleType, isLocked: boolean, onPractice: () => void}> = ({ style, isLocked, onPractice }) => {
    
    const isPracticeable = !isLocked && style.structuredTechnique;
    
    const cardClasses = `
        bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300
        ${isLocked ? 'bg-slate-50 opacity-60' : ''}
    `;

    return (
        <div className={cardClasses}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${isLocked ? 'bg-slate-200' : 'bg-teal-100'}`}>
                         <style.icon className={`h-6 w-6 ${isLocked ? 'text-slate-400' : 'text-teal-600'}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{style.name}</h3>
                        <p className="text-sm text-slate-500">{style.description}</p>
                    </div>
                </div>
                {isLocked && (
                    <div className="flex items-center space-x-1 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                       <span>Locked</span>
                    </div>
                )}
            </div>
            
            <div className="space-y-4 mt-4">
                <div>
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">TECHNIQUE</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{style.technique}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">WHEN TO USE</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{style.whenToUse}</p>
                </div>
            </div>
            
            <div className="mt-6">
                <button
                    onClick={onPractice}
                    disabled={!isPracticeable}
                    className="w-full text-center bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    Practice Now
                </button>
            </div>
        </div>
    );
};

const BreathingCodex: React.FC<BreathingCodexProps> = ({ playerLevel }) => {
    const [activeExercise, setActiveExercise] = useState<BreathingStyleType | null>(null);

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold font-serif text-slate-800">Breathing Codex</h2>
                    <p className="mt-2 text-slate-600">Master the ancient breathing techniques. Each breath unlocks with progression through the realms.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BREATHING_STYLES.map(style => (
                        <BreathingStyle 
                            key={style.name}
                            style={style}
                            isLocked={playerLevel < style.unlockLevel}
                            onPractice={() => setActiveExercise(style)}
                        />
                    ))}
                </div>
            </div>
            {activeExercise && activeExercise.structuredTechnique && (
                <BreathingExercisePlayer 
                    exercise={activeExercise}
                    onClose={() => setActiveExercise(null)}
                />
            )}
        </>
    );
};

export default BreathingCodex;