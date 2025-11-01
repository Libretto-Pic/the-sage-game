import React, { useState, useEffect } from 'react';
import type { BreathingStyle } from '../types.js';

interface BreathingExercisePlayerProps {
  exercise: BreathingStyle;
  onClose: () => void;
}

type Phase = 'starting' | 'running' | 'paused' | 'finished';

const BreathingExercisePlayer: React.FC<BreathingExercisePlayerProps> = ({ exercise, onClose }) => {
  const { structuredTechnique } = exercise;
  
  const [phase, setPhase] = useState<Phase>('starting');
  const [countdown, setCountdown] = useState(3);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentRep, setCurrentRep] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Initial countdown effect
  useEffect(() => {
    if (phase === 'starting') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('running');
        setTimeRemaining(structuredTechnique!.steps[0].duration);
      }
    }
  }, [phase, countdown, structuredTechnique]);

  // Main exercise timer effect
  useEffect(() => {
    if (phase !== 'running' || !structuredTechnique) return;

    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime > 1) {
          return prevTime - 1;
        }

        // Time for next step
        const nextStepIndex = currentStepIndex + 1;
        
        if (nextStepIndex < structuredTechnique.steps.length) {
          // Same rep, next step
          setCurrentStepIndex(nextStepIndex);
          return structuredTechnique.steps[nextStepIndex].duration;
        } else {
          // Next rep
          const nextRep = currentRep + 1;
          if (nextRep <= structuredTechnique.reps) {
            setCurrentRep(nextRep);
            setCurrentStepIndex(0);
            return structuredTechnique.steps[0].duration;
          } else {
            // Finished
            setPhase('finished');
            return 0;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentStepIndex, currentRep, structuredTechnique]);
  
  if (!structuredTechnique) return null;

  const currentStep = structuredTechnique.steps[currentStepIndex];
  const totalReps = structuredTechnique.reps;

  const getPacerAnimation = () => {
    if (phase !== 'running') return 'scale-100';
    switch(currentStep.type) {
        case 'Inhale': return 'scale-125';
        case 'Exhale': return 'scale-75';
        case 'Hold': return 'scale-125'; // Stay expanded after inhale
        default: return 'scale-100';
    }
  }

  const renderContent = () => {
    if (phase === 'starting') {
      return (
        <div className="text-center">
          <p className="text-2xl text-slate-300 mb-4">Get Ready...</p>
          <p className="text-8xl font-bold">{countdown}</p>
        </div>
      );
    }
    
    if (phase === 'finished') {
        return (
            <div className="text-center">
                <h2 className="text-4xl font-bold font-serif mb-4">Complete</h2>
                <p className="text-slate-300 mb-8">Well done, Wanderer. You have calmed the inner storm.</p>
                <button 
                    onClick={onClose}
                    className="bg-white text-slate-800 font-bold py-3 px-8 rounded-md text-lg transition-transform duration-300 hover:bg-slate-200 hover:scale-105"
                >
                    Return to Codex
                </button>
            </div>
        );
    }

    return (
      <>
        <div className="absolute top-6 right-6 text-sm">
            Repetition: <span className="font-bold">{currentRep} / {totalReps}</span>
        </div>
        <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out" style={{ transitionDuration: `${currentStep.duration}s`, transform: getPacerAnimation() }}>
            <div className="w-56 h-56 bg-white/30 rounded-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-4xl font-bold tracking-wider uppercase">{currentStep.type}</p>
                    <p className="text-7xl font-mono font-bold">{timeRemaining}</p>
                </div>
            </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white animate-fade-in">
        <button onClick={onClose} className="absolute top-5 left-5 text-slate-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {renderContent()}
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default BreathingExercisePlayer;