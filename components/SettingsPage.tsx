import React from 'react';

interface SettingsPageProps {
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ notificationsEnabled, onToggleNotifications }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-serif text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-600">Configure your journey and shape your path.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Notifications</h3>
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
      </div>
    </div>
  );
};

export default SettingsPage;