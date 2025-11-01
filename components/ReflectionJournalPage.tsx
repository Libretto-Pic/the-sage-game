import React from 'react';
import ReflectionJournal from './ReflectionJournal.js';

interface ReflectionJournalPageProps {
  saveJournalEntry: (entry: string) => void;
  journalEntries: string[];
}

const ReflectionJournalPage: React.FC<ReflectionJournalPageProps> = ({ saveJournalEntry, journalEntries }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Scroll of Reflection</h2>
        <p className="text-slate-600">Record your thoughts, victories, and lessons learned. The unexamined life is not worth living, Wanderer.</p>
      </div>
      
      <ReflectionJournal saveJournalEntry={saveJournalEntry} />
      
      <div>
          <h3 className="text-2xl font-bold font-serif text-slate-800 mb-4">Past Entries</h3>
          <div className="space-y-4">
            {journalEntries && journalEntries.length > 0 ? (
              [...journalEntries].reverse().map((entry, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <p className="text-slate-600 whitespace-pre-wrap">{entry}</p>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                 <p className="text-sm text-slate-500">Your journal is empty. Begin by writing your first reflection.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ReflectionJournalPage;