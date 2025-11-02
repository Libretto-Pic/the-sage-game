import React from 'react';

const PowerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.268l4.263 4.264a1 1 0 01-.707 1.707l-4.263-4.263V18a1 1 0 01-2 0V8.972l-4.263 4.263a1 1 0 01-1.414 0 1 1 0 010-1.414L8 7.586V2a1 1 0 01.707-.954 1 1 0 011.586 0z" clipRule="evenodd" />
    </svg>
);

const PowerPointsTracker: React.FC<{ powerPoints: number }> = ({ powerPoints }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-full bg-yellow-100">
                    <PowerIcon />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Essence of Will</h2>
                    <p className="text-sm text-slate-500 font-medium">POWER POINTS</p>
                </div>
            </div>
            <p className="text-5xl font-bold text-center text-slate-800">{powerPoints}</p>
        </div>
    );
};

export default PowerPointsTracker;
