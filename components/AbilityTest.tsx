import React, { useState } from 'react';
import type { PlayerState, StatCategory } from '../types.ts';
import { useToast } from '../App.tsx';

interface AbilityTestProps {
    abilityId: StatCategory;
    playerState: PlayerState;
    onStartTest: (abilityId: StatCategory) => Promise<string | null>;
    onSubmitAnswer: (abilityId: StatCategory, answer: string) => Promise<{evaluation: string, isWorthy: boolean} | null>;
}

const AbilityTest: React.FC<AbilityTestProps> = ({ abilityId, playerState, onStartTest, onSubmitAnswer }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [evaluationResult, setEvaluationResult] = useState<{evaluation: string, isWorthy: boolean} | null>(null);
    const showToast = useToast();

    const currentTest = playerState.currentTests?.[abilityId];

    const handleStart = async () => {
        setIsLoading(true);
        await onStartTest(abilityId);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) {
            showToast("Your answer cannot be empty.", "error");
            return;
        }
        setIsLoading(true);
        const result = await onSubmitAnswer(abilityId, answer);
        if (result) {
            showToast(result.evaluation, result.isWorthy ? 'success' : 'error');
            setEvaluationResult(result);
        }
        setAnswer('');
        setIsLoading(false);
    };

    if (currentTest) {
        return (
            <div className="bg-slate-50 p-6 rounded-xl mt-4 border-2 border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2 text-xl font-serif">Test of Worthiness</h4>
                <p className="text-slate-600 mb-4">{currentTest.question}</p>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Articulate your thoughts here..."
                        className="w-full h-24 p-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-teal-400"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading} className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-200 enabled:hover:bg-teal-600 disabled:bg-slate-300">
                        {isLoading ? 'Evaluating...' : 'Submit Answer'}
                    </button>
                </form>
                {evaluationResult && !evaluationResult.isWorthy && (
                    <p className="mt-2 text-center text-xs text-red-600">The Sage was not convinced. Reflect, and try again when you are ready.</p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-xl mt-4 text-center">
            <h4 className="font-bold text-lg">A New Threshold is Reached!</h4>
            <p className="mt-1 mb-3">You must prove your worthiness to ascend to the next level of {abilityId}.</p>
            <button onClick={handleStart} disabled={isLoading} className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300">
                {isLoading ? 'Preparing...' : 'Begin Test'}
            </button>
        </div>
    );
};

export default AbilityTest;