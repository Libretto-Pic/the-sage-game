// Implemented the LevelPage to display the player's journey through the different realms.
import React from 'react';
import { REALMS } from '../constants';

interface LevelPageProps {
  playerLevel: number;
}

const LevelPage: React.FC<LevelPageProps> = ({ playerLevel }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800">The 7 Realms of Progression</h2>
        <p className="mt-2 text-slate-600">Your journey from Level 30 to 100 is divided into seven distinct realms, each with its own theme and challenges.</p>
      </div>

      <div className="space-y-6">
        {REALMS.map((realm, index) => {
          const levelRange = realm.levelRange.replace('Levels ', '').split('-');
          const startLevel = parseInt(levelRange[0]);
          const endLevel = parseInt(levelRange[1]);
          const isCurrent = playerLevel >= startLevel && playerLevel <= endLevel;
          const isUnlocked = playerLevel >= startLevel;

          return (
            <div 
              key={index} 
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                isCurrent ? 'bg-teal-50 border-teal-500 shadow-lg' :
                isUnlocked ? 'bg-white border-slate-200' :
                'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-bold uppercase tracking-widest text-sm ${isCurrent ? 'text-teal-600' : 'text-slate-500'}`}>{realm.levelRange}</p>
                    <h3 className="text-2xl font-bold font-serif mt-1 text-slate-800">{realm.name}</h3>
                  </div>
                  {isCurrent && <span className="text-sm font-bold bg-teal-500 text-white px-3 py-1 rounded-full">Current Realm</span>}
                  {!isUnlocked && <span className="text-sm font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">Locked</span>}
              </div>
              <p className="mt-3 text-slate-600">{realm.theme}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPage;
