import React, { useState } from 'react';
import type { PlayerState, StatCategory } from '../types.ts';
import { ALL_ABILITIES } from '../services/abilitiesLore.ts';

interface AbilitiesPageProps {
    playerState: PlayerState;
    onSelectAbility: (abilityId: StatCategory) => void;
}

const AbilitiesPage: React.FC<AbilitiesPageProps> = (props) => {
    const { playerState, onSelectAbility } = props;
    const { permanentStats } = playerState;
    
    const displayAbilities = ALL_ABILITIES;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Abilities Codex</h2>
                <p className="text-slate-600">This is a reflection of your permanent growth. Click on an ability to view its detailed codex and learn how to improve it through action.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayAbilities.map(ability => {
                    const level = playerState.abilityLevels?.[ability.id] || 1;
                    const xp = playerState.abilityXp?.[ability.id] || 0;
                    const xpPerLevel = ability.xpPerLevel;
                    const progress = (xp / xpPerLevel) * 100;

                    return (
                        <button 
                            key={ability.id} 
                            onClick={() => onSelectAbility(ability.id)}
                            className="bg-white p-6 rounded-xl shadow-sm text-left flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100">
                                    <ability.icon className="h-7 w-7 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{ability.name}</h3>
                                    <p className="text-sm text-slate-500 font-semibold">Permanent Bonus: <span className="text-teal-600">+{permanentStats[ability.id] || 0}</span></p>
                                </div>
                            </div>
                            
                            <div className="my-2">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm font-semibold text-slate-600">Level: {level}</span>
                                    <span className="text-xs font-bold text-slate-500">{xp} / {xpPerLevel} AXP</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>

                            <div className="flex-grow mt-2">
                                <p className="text-sm text-slate-600">{ability.description}</p>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="mt-4 text-right text-teal-600 font-bold text-sm">
                                View Codex &rarr;
                            </div>
                        </button>
                    );
                })}
            </div>

        </div>
    );
};

export default AbilitiesPage;