
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onImport: () => void;
}

const LandingPage = ({ onStart, onImport }: LandingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-teal-600 font-serif mb-4">The Sage's Path</h1>
        <p className="text-lg md:text-xl text-slate-700 mb-8">
          Escape the Fog of Modern Life. Gamify your self-improvement journey, conquer inner demons, and walk the path to enlightenment.
        </p>
        <p className="text-md text-slate-600 mb-12">
          This is not just an app; it's a new operating system for your mind. A system built on discipline, reflection, and consistent action. Are you ready to begin?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="bg-teal-500 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
            >
              Begin New Journey
            </button>
            <button
                onClick={onImport}
                className="bg-slate-200 text-slate-700 font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:bg-slate-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
                Import Progress
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
