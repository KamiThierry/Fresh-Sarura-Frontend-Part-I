import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your profile and system preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <SettingsIcon size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Under Construction</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                    This module is currently being built. Please check back later for updates.
                </p>
            </div>
        </div>
    );
};

export default Settings;
