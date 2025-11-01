
import React from 'react';

const BossBattlesPage: React.FC = () => {
  return (
    <div className="text-center bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-3xl font-bold font-serif text-slate-800">Boss Battles</h2>
      <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
        Every 5 levels, you will face a Boss—a manifestation of an inner demon like Procrastination, Self-Doubt, or Impatience. These are week-long trials designed to forge your will.
      </p>
      <div className="mt-8">
        <div className="inline-block bg-slate-100 text-slate-500 font-semibold p-4 rounded-lg">
            Your next Boss Battle unlocks at Level 35. Keep walking the path.
        </div>
      </div>
    </div>
  );
};

export default BossBattlesPage;
