
import React from 'react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-100 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{children}</p>
    </div>
);

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center text-center text-white px-4" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1545224329-87c22649b3a3?q=80&w=2070&auto=format&fit=crop)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="max-w-3xl">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-teal-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M13 3l-2.286 6.857L5 12l5.714 2.143L13 21l2.286-6.857L21 12l-5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4">The Sage's Path</h1>
                    <h2 className="text-xl md:text-2xl text-slate-200 mb-6">A 70-Level Journey from Chaos to Clarity</h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-8">
                        Transform your life through daily missions, breathing techniques, and inner demon battles. Start at Level 30, reach enlightenment at Level 100.
                    </p>
                    <button onClick={onStart} className="bg-teal-500 text-white font-bold py-3 px-8 rounded-md text-lg transition-transform duration-300 hover:bg-teal-600 hover:scale-105">
                        Begin Your Journey
                    </button>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold font-serif text-slate-800">How It Works</h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Your life becomes the game. Every action earns XP. Every challenge conquered makes you stronger.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            title="Daily Missions">
                            Complete 3 missions daily across Health, Wealth, and Mind domains. Each mission scales with your level, starting easy and building to mastery.
                        </FeatureCard>
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                            title="Level Progression">
                            Earn XP through missions and challenges. Every 100 XP takes you to the next level. Journey through 7 Realms from Level 30 to 100.
                        </FeatureCard>
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                            title="Boss Battles">
                            Face your inner demons every 5 levels. Week-long challenges that test your discipline and reward you with Soul Coins and breathing techniques.
                        </FeatureCard>
                    </div>
                </div>
            </div>
            
            {/* Final CTA */}
            <div className="bg-slate-100 py-20">
                 <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex justify-center mb-4">
                         <svg className="w-12 h-12 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M13 3l-2.286 6.857L5 12l5.714 2.143L13 21l2.286-6.857L21 12l-5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold font-serif text-slate-800 mb-4">Ready to Transform?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        This is not a game. It only looks like one. Behind every level, behind every XP, there's a mirror—and in that mirror stands you, stripped of excuses.
                    </p>
                    <button onClick={onStart} className="bg-teal-500 text-white font-bold py-3 px-8 rounded-md text-lg transition-transform duration-300 hover:bg-teal-600 hover:scale-105">
                       Start at Level 30
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default LandingPage;
