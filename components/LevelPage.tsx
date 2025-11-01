// Implemented the LevelPage to display the player's journey through the different realms.
import React from 'react';
import { REALMS } from '../services/lore.js';

interface LevelPageProps {
  playerLevel: number;
}

const LevelPage: React.FC<LevelPageProps> = ({ playerLevel }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800">The 8 Realms of Self-Mastery</h2>
        <p className="mt-2 text-slate-600">Your journey from Level 30 to 100 is a pilgrimage through eight distinct realms of consciousness, each with its own trials, demons, and revelations.</p>
      </div>

      <div className="space-y-6">
        {REALMS.map((realm, index) => {
          const levelRangeStr = realm.levelRange.replace('Levels ', '');
          const startLevel = parseInt(levelRangeStr.split('-')[0]);
          
          let isCurrent = false;
          if (levelRangeStr.includes('-')) {
              const endLevel = parseInt(levelRangeStr.split('-')[1]);
              isCurrent = playerLevel >= startLevel && playerLevel <= endLevel;
          } else {
              isCurrent = playerLevel === startLevel;
          }
          
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
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`font-bold uppercase tracking-widest text-sm ${isCurrent ? 'text-teal-600' : 'text-slate-500'}`}>{realm.levelRange}</p>
                    <h3 className="text-2xl font-bold font-serif mt-1 text-slate-800">{realm.name}</h3>
                  </div>
                  {isCurrent && <span className="text-sm font-bold bg-teal-500 text-white px-3 py-1 rounded-full">Current Realm</span>}
                  {!isUnlocked && <span className="text-sm font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">Locked</span>}
              </div>

              <div className="border-t-2 border-dashed border-slate-200 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-1">Theme</h4>
                  <p className="text-slate-700">{realm.theme}</p>
                </div>
                 <div>
                  <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-1">Core Skill</h4>
                  <p className="text-slate-700 font-medium">{realm.breathingStyle}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-1">Inner Enemies</h4>
                  <p className="text-slate-700">{realm.enemies}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-1">Elite Demon</h4>
                  <p className="text-slate-700">{realm.eliteDemon}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-xs mb-1">Realm Boss</h4>
                  <p className="text-slate-700">{realm.boss}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPage;