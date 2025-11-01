import React from 'react';
import { PlayerState } from '../types.js';
import { REALMS, LEVEL_TITLES } from '../services/lore.js';
import { XP_PER_LEVEL } from '../constants.js';

const StatBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color.replace('500', '100')}`}>
             {icon}
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-slate-600">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value} / 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    </div>
);

const StatsAndProgress = ({playerState}: {playerState: PlayerState}) => {
    const { level, xp, stats, soulCoins } = playerState;
    const currentRealm = REALMS.find(r => {
        if (r.levelRange.includes('-')) {
            const [start, end] = r.levelRange.replace('Levels ', '').split('-').map(Number);
            return level >= start && level <= end;
        }
        return level === parseInt(r.levelRange.replace('Levels ', ''));
    }) || REALMS[0];

    const levelTitle = LEVEL_TITLES[level] || '';
    const progressPercentage = (xp / XP_PER_LEVEL) * 100;

    return (
        <div className="space-y-6">
            {/* Realm Banner */}
            <div className="relative p-8 rounded-xl text-white overflow-hidden" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1545224329-87c22649b3a3?q=80&w=1000&auto=format&fit=crop)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%'
            }}>
                <p className="font-bold uppercase tracking-widest text-sm text-slate-300">{currentRealm.levelRange}</p>
                <h2 className="text-4xl font-bold font-serif mt-1">{currentRealm.name}</h2>
                <p className="mt-2 text-slate-200 max-w-lg">{currentRealm.theme}</p>
            </div>
            
            {/* Progression Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">CURRENT LEVEL</p>
                    <p className="text-5xl font-bold text-slate-800 mt-1">{level}</p>
                    <p className="text-sm text-slate-400 mt-1 truncate" title={levelTitle}>{levelTitle}</p>
                </div>
                 <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">SOUL COINS</p>
                    <p className="text-5xl font-bold text-slate-800 mt-1">{soulCoins}</p>
                    <p className="text-sm text-slate-400 mt-1">Currency of the wise</p>
                </div>
                 <div className="bg-white p-5 rounded-xl shadow-sm col-span-1 md:col-span-2">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-slate-500">EXPERIENCE POINTS</p>
                        <p className="text-sm font-bold text-slate-600">{xp} / {XP_PER_LEVEL} XP</p>
                    </div>
                     <div className="w-full bg-slate-200 rounded-full h-4 mt-3">
                        <div 
                            className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}>
                        </div>
                    </div>
                    <div className="flex justify-between items-baseline mt-1">
                        <p className="text-sm font-medium text-slate-400">{progressPercentage.toFixed(0)}%</p>
                        <p className="text-sm font-bold text-slate-500">NEXT LEVEL: <span className="text-teal-600">{level + 1}</span></p>
                    </div>
                </div>
            </div>

            {/* Character Stats */}
            <div>
                 <h3 className="text-2xl font-bold font-serif text-slate-800 mb-4">Character Stats</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <StatBar 
                        label="HP" 
                        value={stats.hp} 
                        color="bg-red-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                    />
                     <StatBar 
                        label="MP" 
                        value={stats.mp} 
                        color="bg-blue-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    />
                     <StatBar 
                        label="SP" 
                        value={stats.sp} 
                        color="bg-purple-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                    />
                     <StatBar 
                        label="RP" 
                        value={stats.rp} 
                        color="bg-teal-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                    />
                 </div>
            </div>
        </div>
    );
}

export default StatsAndProgress;