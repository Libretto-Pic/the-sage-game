
import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-600 p-4 text-center">
      <h1 className="text-3xl font-bold text-teal-600 mb-4 font-serif">The Sage's Path</h1>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-6"></div>
      <p className="text-lg max-w-md">{message}</p>
    </div>
  );
};

export default LoadingScreen;
