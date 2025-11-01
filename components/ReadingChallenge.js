
import React from 'react';

interface ReadingChallengeProps {
    progress: number;
    onComplete: () => void;
}

const XP_REWARDS = [25, 20, 15];

const ReadingChallenge = ({ progress, onComplete }: ReadingChallengeProps) => {
    const isCompleted = progress >= 3;
    const nextXp = isCompleted ? 0 : XP_REWARDS[progress];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-dashed border-teal-300">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">The Scholar's Ritual</h3>
                    <p className="text-sm text-slate-500 mt-1">Read for 30 minutes to cultivate your mind. (Progress: {progress}/3)</p>
                </div>
                {!isCompleted && (
                    <div className="text-lg font-bold text-teal-600">
                        +{nextXp} XP
                    </div>
                )}
            </div>
            <div className="mt-4 flex items-center gap-4">
                <div className="w-full bg-slate-200 rounded-full h-4">
                    <div 
                        className="bg-teal-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(progress / 3) * 100}%` }}
                    ></div>
                </div>
                <button
                    onClick={onComplete}
                    disabled={isCompleted}
                    className="flex-shrink-0 bg-teal-500 text-white font-bold py-2 px-6 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {isCompleted ? 'Done' : 'Complete Block'}
                </button>
            </div>
        </div>
    );
};

export default ReadingChallenge;
