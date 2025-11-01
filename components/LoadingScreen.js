
import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const HealthIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const WealthIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const MindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);


const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-600 p-4 text-center">
        <h1 className="text-3xl font-bold text-teal-600 mb-12 font-serif animate-title-glow">The Sage's Path</h1>
        
        <div className="flex space-x-8 mb-8">
            <div className="animate-pulse-icon" style={{ animationDelay: '0s' }}>
                <HealthIcon />
            </div>
            <div className="animate-pulse-icon" style={{ animationDelay: '0.2s' }}>
                <WealthIcon />
            </div>
            <div className="animate-pulse-icon" style={{ animationDelay: '0.4s' }}>
                <MindIcon />
            </div>
        </div>

        <p className="text-lg max-w-md">{message}</p>
      </div>
      <style>{`
        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(20, 184, 166, 0.2);
          }
          50% {
            text-shadow: 0 0 15px rgba(20, 184, 166, 0.6);
          }
        }
        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-icon {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        .animate-pulse-icon {
          animation: pulse-icon 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default LoadingScreen;
