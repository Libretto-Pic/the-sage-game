
import React from 'react';

interface NewDayModalProps {
  onConfirm: () => void;
}

const NewDayModal = ({ onConfirm }: NewDayModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl p-8 max-w-md text-center transform transition-all animate-fade-in-up">
        <h2 className="text-3xl font-bold text-teal-600 mb-4 font-serif">A New Dawn</h2>
        <p className="text-slate-600 mb-6">
          The sun rises, Wanderer. The Fog of Modern Life recedes for a moment, granting clarity. Today is a new arena, a new opportunity to forge your will.
        </p>
        <p className="text-slate-600 mb-8">
          Perform a centering breath, and let us begin today's trials.
        </p>
        <button
          onClick={onConfirm}
          className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-md transition-transform duration-300 hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500"
        >
          Begin the Day
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NewDayModal;
