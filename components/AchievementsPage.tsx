
import React from 'react';
import { ALL_ACHIEVEMENTS } from '../services/achievements.ts';
import type { Achievement } from '../types.ts';

interface AchievementsPageProps {
  unlockedAchievements: string[];
}

const AchievementCard: React.FC<{achievement: Achievement, isUnlocked: boolean}> = ({ achievement, isUnlocked }) => {
    const cardClasses = `
        bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 flex items-start space-x-4
        ${isUnlocked ? 'opacity-100' : 'opacity-50 bg-slate-50'}
    `;

    return (
        <div className={cardClasses}>
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${isUnlocked ? 'bg-teal-100' : 'bg-slate-200'}`}>
                <achievement.icon className={`h-7 w-7 ${isUnlocked ? 'text-teal-600' : 'text-slate-400'}`} />
            </div>
            <div>
                <h3 className={`text-lg font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-600'}`}>{achievement.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{achievement.description}</p>
            </div>
        </div>
    );
};


const AchievementsPage: React.FC<AchievementsPageProps> = ({ unlockedAchievements }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800">Achievements</h2>
        <p className="mt-2 text-slate-600">Recognize your milestones on the path to self-mastery. Each achievement is a testament to your growing discipline.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ACHIEVEMENTS.map(ach => (
          <AchievementCard 
            key={ach.id}
            achievement={ach}
            isUnlocked={unlockedAchievements.includes(ach.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;