import React from 'react';
import { BREATHING_STYLES } from '../services/lore';

const UnlockedPowers: React.FC<{ playerLevel: number }> = ({ playerLevel }) => {
    const unlocked = BREATHING_STYLES.filter(s => playerLevel >= s.unlockLevel);
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Unlocked Techniques</h3>
            <ul className="space-y-3">
                {unlocked.map(style => (
                    <li key={style.name} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-teal-100">
                            <style.icon className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700 text-sm">{style.name}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UnlockedPowers;