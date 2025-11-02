import React from 'react';
import type { PlayerState, StatCategory } from '../types.ts';
import { ALL_ABILITIES } from '../services/abilitiesLore.ts';
import AbilityTest from './AbilityTest.tsx';

interface AbilityDetailPageProps {
    abilityId: StatCategory | null;
    playerState: PlayerState;
    onBack: () => void;
    onStartTest: (abilityId: StatCategory) => Promise<string | null>;
    onSubmitAnswer: (abilityId: StatCategory, answer: string) => Promise<{evaluation: string, isWorthy: boolean} | null>;
}

const AbilityDetailPage: React.FC<AbilityDetailPageProps> = ({ abilityId, playerState, onBack, onStartTest, onSubmitAnswer }) => {
    
    const ability = ALL_ABILITIES.find(a => a.id === abilityId);
    
    if (!ability) {
        return (
            <div className="text-center">
                <p className="text-slate-600">Could not find the selected ability.</p>
                <button onClick={onBack} className="mt-4 text-teal-600 font-bold">&larr; Back to Abilities</button>
            </div>
        );
    }
    
    const currentAbilityLevel = playerState.abilityLevels?.[ability.id] || 1;
    const isTestAwaiting = playerState.testsAwaiting?.[ability.id] || false;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <button onClick={onBack} className="text-teal-600 font-bold mb-4 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    <span>Back to Abilities Codex</span>
                </button>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-slate-100">
                        <ability.icon className="h-10 w-10 text-slate-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold font-serif text-slate-800">{ability.name}</h2>
                        <p className="text-slate-600 max-w-2xl">{ability.description}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {ability.levels.map(levelContent => {
                    const isUnlocked = currentAbilityLevel >= levelContent.level;
                    return (
                        <div key={levelContent.level} className={`p-6 rounded-xl border-2 transition-all duration-300 ${isUnlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-300 opacity-70'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-sm text-slate-500">Level {levelContent.level}</p>
                                    <h3 className="text-2xl font-bold font-serif text-slate-800">{levelContent.title}</h3>
                                </div>
                                {!isUnlocked && (
                                    <div className="flex items-center space-x-1 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        <span>Locked</span>
                                    </div>
                                )}
                            </div>

                             <p className="text-slate-600 mb-4 text-sm">{levelContent.description}</p>

                            {isUnlocked ? (
                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    {levelContent.skills.map(skill => (
                                        <div key={skill.name}>
                                            <h4 className="font-semibold text-slate-700">&#x25B8; {skill.name}</h4>
                                            <p className="text-sm text-slate-600 ml-5">{skill.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                     <p className="text-slate-500 text-sm font-semibold">Reach Level {levelContent.level} in {ability.name} to unlock this wisdom.</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isTestAwaiting && (
                <AbilityTest 
                    abilityId={ability.id}
                    playerState={playerState}
                    onStartTest={onStartTest}
                    onSubmitAnswer={onSubmitAnswer}
                />
            )}
        </div>
    );
};

export default AbilityDetailPage;