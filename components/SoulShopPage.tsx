import React, { useState } from 'react';
import type { PlayerState, StatCategory } from '../types.ts';
import { ALL_SHOP_ITEMS } from '../services/shopItems.ts';
import type { ShopItem } from '../types.ts';

interface SoulShopPageProps {
    playerState: PlayerState;
    onPurchase: (itemId: StatCategory, points: number, cost: number, promptSuggestion: string) => Promise<{success: boolean, reason?: string}>;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const ShopItemCard: React.FC<{
    item: ShopItem, 
    playerSoulCoins: number, 
    onPurchase: SoulShopPageProps['onPurchase'],
    showToast: SoulShopPageProps['showToast'],
}> = ({ item, playerSoulCoins, onPurchase, showToast }) => {
    const [pointsToBuy, setPointsToBuy] = useState(1);
    const totalCost = pointsToBuy * item.costPerPoint;
    const canAfford = playerSoulCoins >= totalCost;

    const handlePurchase = async () => {
        if (!canAfford) {
            showToast("You do not have enough Soul Coins.", 'error');
            return;
        }
        const result = await onPurchase(item.id, pointsToBuy, totalCost, item.promptSuggestion);
        if (result.success) {
            showToast(`Trial initiated! Check your missions to activate your +${pointsToBuy} ${item.name}.`, 'success');
            setPointsToBuy(1);
        } else {
            showToast(result.reason || "The purchase could not be completed.", 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center space-x-4 mb-3">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-100">
                    <item.icon className="h-7 w-7 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500 font-semibold">{item.costPerPoint} SC per point</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 flex-grow">{item.description}</p>
            
            <div className="mt-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex-grow">
                        <label htmlFor={`points-${item.id}`} className="block text-sm font-medium text-slate-700">Amount to purchase:</label>
                        <input
                            type="range"
                            id={`points-${item.id}`}
                            min="1"
                            max="10"
                            value={pointsToBuy}
                            onChange={(e) => setPointsToBuy(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <span className="text-3xl font-bold text-slate-700">+{pointsToBuy}</span>
                </div>
                <button
                    onClick={handlePurchase}
                    disabled={!canAfford}
                    className="w-full mt-4 bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    Purchase Trial for {totalCost} SC
                </button>
            </div>
        </div>
    );
}

const SoulShopPage: React.FC<SoulShopPageProps> = ({ playerState, onPurchase, showToast }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">The Soul Shop</h2>
                <p className="text-slate-600 max-w-2xl">Transmute your resolve into permanent power. Each purchase initiates a unique 'Activation Trial'—a mission you must complete to unlock your new strength.</p>
            </div>
            <div className="bg-white text-center p-4 rounded-xl shadow-md border border-yellow-300">
                <p className="text-sm font-semibold text-slate-500">Your Soul Coins</p>
                <p className="text-4xl font-bold text-yellow-600">{playerState.soulCoins}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALL_SHOP_ITEMS.map(item => (
            <ShopItemCard 
                key={item.id}
                item={item}
                playerSoulCoins={playerState.soulCoins}
                onPurchase={onPurchase}
                showToast={showToast}
            />
        ))}
      </div>
    </div>
  );
};

export default SoulShopPage;