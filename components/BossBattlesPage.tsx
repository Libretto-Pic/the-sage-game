import React from 'react';
import KazukiProfile from './KazukiProfile.tsx';
import { ALL_KAZUKI } from '../services/kazukiLore.ts';
import type { PlayerState } from '../types.ts';

interface BossBattlesPageProps {
  playerState: PlayerState;
  onControlKazuki: (kazukiName: string) => Promise<{success: boolean, reason?: string}>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const LockedKazukiCard: React.FC<{ level: number }> = ({ level }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-slate-300 text-center flex flex-col justify-center">
        <div>
            <p className="text-slate-500 font-semibold">A Shadow Stirs...</p>
            <p className="mt-2 text-slate-400">A new presence will reveal itself when you have proven your strength.</p>
            <p className="mt-4 text-sm font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full inline-block">
                Unlock at Level {level}
            </p>
        </div>
    </div>
);

const BossBattlesPage: React.FC<BossBattlesPageProps> = ({ playerState, onControlKazuki, showToast }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">The Kazuki Codex</h2>
        <p className="text-slate-600">"To know thy enemy is to know thyself." Study the nature of the inner demons, complete their trials to gather power, then expend that power to gain control.</p>
      </div>
      
      <div className="space-y-12">
        {ALL_KAZUKI.map(kazuki => {
            const isUnlocked = playerState.level >= kazuki.encounterLevel;
            const powerLevel = playerState.kazukiPowerLevels?.[kazuki.name];

            if (isUnlocked && powerLevel) {
                return (
                    <KazukiProfile 
                        key={kazuki.name}
                        kazuki={kazuki} 
                        playerPowerPoints={playerState.powerPoints}
                        isControlled={(playerState.controlledKazuki || []).includes(kazuki.name)}
                        boostedPower={playerState.boostedKazuki?.[kazuki.name]}
                        powerLevel={powerLevel}
                        onControl={onControlKazuki}
                        showToast={showToast}
                    />
                );
            }
            return <LockedKazukiCard key={kazuki.name} level={kazuki.encounterLevel} />;
        })}
      </div>
    </div>
  );
};

export default BossBattlesPage;