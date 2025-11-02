import React from 'react';

const SageGuidanceCard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500">
            <h3 className="text-xl font-bold text-slate-800 mb-2">The Sage's Guidance</h3>
            <div className="text-sm text-slate-600 space-y-2">
                <p>Welcome, Wanderer. Your path is one of small, consistent steps. Here is the way:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Complete your daily **Trials** and **Reading Rituals** to earn Experience Points (XP).</li>
                    <li>Gather enough XP to increase your **Level**. Each level up strengthens your resolve and grants you **Soul Coins (SC)**.</li>
                    <li>Completing all daily trials also rewards a small bonus of Soul Coins.</li>
                    <li>Visit the **Shop** to spend Soul Coins on permanent **Ability** boosts, which must be unlocked through a special trial.</li>
                    <li>Face your inner demons, the **Kazuki**, by gathering **Power Points (PP)** from trials and XP gain.</li>
                </ul>
                <p className="font-semibold pt-2">The journey of a thousand miles begins with a single step. Take yours now.</p>
            </div>
        </div>
    );
};

export default SageGuidanceCard;
