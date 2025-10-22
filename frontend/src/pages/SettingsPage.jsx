import React, { useState, useEffect } from 'react';
import { Save, Moon, Sun, Monitor, Palette, Bell, Shield } from 'lucide-react';
import axiosInstance from '../api/axios.config';
import toast, { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
  const userId = 'demo-user';
  const [preferences, setPreferences] = useState({
    theme: 'light',
    default_chart_type: 'line',
    ai_response_style: 'detailed'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await axiosInstance.get(`/preferences/${userId}`);
      setPreferences(response.data);
    } catch (error) {
      console.error('Load preferences error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const saveToast = toast.loading('Saving preferences...');

    try {
      await axiosInstance.put(`/preferences/${userId}`, preferences);
      toast.success('Preferences saved successfully!', { id: saveToast });
    } catch (error) {
      console.error('Save preferences error:', error);
      toast.error('Failed to save preferences', { id: saveToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="mr-2 text-purple-600" size={24} />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setPreferences({ ...preferences, theme })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.theme === theme
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {theme === 'light' && <Sun size={24} className="text-yellow-500" />}
                      {theme === 'dark' && <Moon size={24} className="text-blue-500" />}
                      {theme === 'auto' && <Monitor size={24} className="text-gray-500" />}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {theme}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Chart Type
              </label>
              <select
                value={preferences.default_chart_type}
                onChange={(e) => setPreferences({ ...preferences, default_chart_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Fick AI Settings
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Response Style
            </label>
            <select
              value={preferences.ai_response_style}
              onChange={(e) => setPreferences({ ...preferences, ai_response_style: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Choose how detailed you want Fick AI's responses to be
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
        >
          <Save size={20} className="mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
