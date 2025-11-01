import React from 'react';

interface SettingsPageProps {
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
}

const SettingsPage = ({ 
    notificationsEnabled, 
    onToggleNotifications,
    soundEnabled,
    onToggleSound,
    onResetGame 
}: SettingsPageProps) => {

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      if (window.confirm("This is your final confirmation. All levels, missions, and journal entries will be permanently deleted.")) {
        onResetGame();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-600">Configure your journey and shape your path.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Preferences</h3>
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
          <div>
            <p className="font-semibold text-slate-700">Daily Mission Reminders</p>
            <p className="text-sm text-slate-500">Receive a notification when your new daily trials are ready.</p>
          </div>
          <button
            onClick={onToggleNotifications}
            role="switch"
            aria-checked={notificationsEnabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              notificationsEnabled ? 'bg-teal-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-4 text-xs text-slate-400">
            Note: The first time you enable this, your browser will ask for permission. Notifications will only be sent if permission is granted.
        </div>

        <div className="mt-6 flex items-center justify-between bg-slate-50 p-4 rounded-lg">
            <div>
                <p className="font-semibold text-slate-700">Sound Effects</p>
                <p className="text-sm text-slate-500">Enable audio feedback for completing missions and leveling up.</p>
            </div>
            <button
                onClick={onToggleSound}
                role="switch"
                aria-checked={soundEnabled}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                soundEnabled ? 'bg-teal-500' : 'bg-slate-300'
                }`}
            >
                <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
                />
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
           <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-800">Reset Progress</p>
                <p className="text-sm text-red-700">This will permanently delete all your game data and restart your journey from Day 1. This action cannot be undone.</p>
              </div>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reset
              </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;