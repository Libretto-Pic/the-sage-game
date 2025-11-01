
import React from 'react';

const SoulShopPage: React.FC = () => {
    return (
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold font-serif text-slate-800">Soul Shop</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
                Soul Coins, earned by conquering Bosses, can be spent here on powerful, permanent upgrades and cosmetic alterations to your journey.
            </p>
            <div className="mt-8">
                <div className="inline-block bg-slate-100 text-slate-500 font-semibold p-4 rounded-lg">
                    The Soul Shop is currently under construction by the Elder Sages. Check back after your first Boss Battle.
                </div>
            </div>
        </div>
    );
};

export default SoulShopPage;
