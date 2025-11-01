
import React from 'react';

const SoulShopPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">The Soul Shop</h2>
        <p className="text-slate-600">Exchange your hard-earned Soul Coins for powerful artifacts and boosts. The shopkeeper is currently away, gathering wares.</p>
      </div>
       <div className="bg-white p-12 rounded-xl shadow-sm border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-semibold">Coming Soon</p>
          <p className="mt-2 text-slate-400">Your resolve will be rewarded. The shop will open its doors in a future update.</p>
      </div>
    </div>
  );
};

export default SoulShopPage;
