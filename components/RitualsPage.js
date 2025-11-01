// Implemented the RitualsPage for managing recurring missions.
import React, { useState } from 'react';
import type { RecurringMission } from '../types.js';
import { MISSION_CATEGORIES } from '../constants.js';

interface RitualsPageProps {
  recurringMissions: RecurringMission[];
  addRecurringMission: (mission: Omit<RecurringMission, 'id' | 'startDay'>) => void;
  deleteRecurringMission: (id: string) => void;
}

const initialFormState = {
    title: '',
    description: '',
    category: 'Health' as 'Health' | 'Wealth' | 'Mind',
    frequencyType: 'daily' as 'daily' | 'every_x_days',
    frequencyValue: 2,
    xp: 10,
};

const RitualsPage = ({ recurringMissions, addRecurringMission, deleteRecurringMission }: RitualsPageProps) => {
    const [formState, setFormState] = useState(initialFormState);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleFrequencyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setFormState(prevState => ({...prevState, frequencyValue: isNaN(value) ? 2 : value}));
    }

    const handleXPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) value = 5;
        // Clamp the value while typing
        if (value < 5) value = 5;
        if (value > 15) value = 15;
        setFormState(prevState => ({ ...prevState, xp: value }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formState.title.trim() || !formState.description.trim()) {
            setError('Title and description cannot be empty.');
            return;
        }
        if (formState.frequencyType === 'every_x_days' && formState.frequencyValue < 2) {
            setError('Frequency for "every x days" must be at least 2.');
            return;
        }
        if (formState.xp < 5 || formState.xp > 15) {
            setError('XP must be between 5 and 15.');
            return;
        }
        
        addRecurringMission({
            title: formState.title,
            description: formState.description,
            category: formState.category,
            frequencyType: formState.frequencyType,
            frequencyValue: formState.frequencyType === 'daily' ? 1 : formState.frequencyValue,
            xp: formState.xp,
        });
        setFormState(initialFormState);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold font-serif text-slate-800">Your Rituals</h2>
                <p className="mt-2 text-slate-600">Discipline is forged through repetition. Define the core habits that build your inner fortress. These rituals will appear automatically as daily missions.</p>
                 <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
                    <p className="text-sm">Note: A maximum of 50 XP from rituals will be scheduled on any given day. Rituals are prioritized in the order they appear below.</p>
                </div>
            </div>

            {/* Form to add new ritual */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Carve a New Ritual</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                            <input type="text" name="title" id="title" value={formState.title} onChange={handleInputChange} placeholder="e.g., Morning Hydration" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                            <select name="category" id="category" value={formState.category} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                {MISSION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="xp" className="block text-sm font-medium text-slate-700">XP Reward (5-15)</label>
                            <input type="number" name="xp" id="xp" value={formState.xp} onChange={handleXPChange} min="5" max="15" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea name="description" id="description" value={formState.description} onChange={handleInputChange} rows={2} placeholder="e.g., Drink a full glass of water upon waking." className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                         <div className="flex items-center space-x-4">
                             <label className="flex items-center space-x-2">
                                <input type="radio" name="frequencyType" value="daily" checked={formState.frequencyType === 'daily'} onChange={handleInputChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-slate-300" />
                                <span>Daily</span>
                             </label>
                             <label className="flex items-center space-x-2">
                                <input type="radio" name="frequencyType" value="every_x_days" checked={formState.frequencyType === 'every_x_days'} onChange={handleInputChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-slate-300" />
                                <span>Every</span>
                             </label>
                             <input type="number" name="frequencyValue" value={formState.frequencyValue} onChange={handleFrequencyValueChange} min="2" disabled={formState.frequencyType !== 'every_x_days'} className="w-20 px-3 py-1 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-slate-50" />
                             <span>days</span>
                         </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                           Add Ritual
                        </button>
                    </div>
                </form>
            </div>
            
            {/* List of existing rituals */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Active Rituals</h3>
                {recurringMissions && recurringMissions.length > 0 ? (
                    recurringMissions.map(mission => (
                        <div key={mission.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-start justify-between">
                            <div>
                                <p className="font-bold text-slate-800">{mission.title}</p>
                                <p className="text-sm text-slate-600 mt-1">{mission.description}</p>
                                <div className="mt-2 text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                    {mission.category} | {mission.frequencyType === 'daily' ? 'Daily' : `Every ${mission.frequencyValue} days`} | {mission.xp} XP
                                </div>
                            </div>
                            <button onClick={() => deleteRecurringMission(mission.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" aria-label="Delete Ritual">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-slate-200">
                        <p className="text-slate-500">You have no active rituals. Carve your first one to begin building consistent habits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RitualsPage;