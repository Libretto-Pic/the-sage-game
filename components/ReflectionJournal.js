
import React, { useState } from 'react';

const ReflectionJournal = ({ saveJournalEntry }: { saveJournalEntry: (entry: string) => void }) => {
    const [entry, setEntry] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        if (entry.trim()) {
            saveJournalEntry(entry);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
             <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-purple-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" /></svg>
                </div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-800">Evening Reflection</h2>
                    <p className="text-sm text-slate-500 font-medium">MIRROR PHASE</p>
                 </div>
             </div>
             <p className="text-sm text-slate-600 italic mb-4">
                "Did I rise stronger today, or did the shadow within win another inch?"
             </p>
             <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
             />
             <button
                onClick={handleSave}
                disabled={!entry.trim()}
                className="w-full mt-3 bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
             >
                {isSaved ? 'Saved!' : 'Save to Scroll of Reflection'}
             </button>
        </div>
    );
};

export default ReflectionJournal;
