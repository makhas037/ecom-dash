import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Palette, Globe, Database, CreditCard, Shield, Save, Upload, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile Settings State
  const [profile, setProfile] = useState({
    fullName: 'Alex Jerome',
    email: 'alexjerome@gmail.com',
    phone: '+1-555-123-4567',
    company: 'FiberOps Analytics',
    role: 'Administrator',
    bio: 'Business intelligence enthusiast with 10+ years of experience.'
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    monthlyReport: false,
    salesAlerts: true,
    customerAlerts: true
  });

  // Appearance Settings State
  const [appearance, setAppearance] = useState({
    theme: theme,
    compactMode: false,
    animations: true,
    fontSize: 'medium'
  });

  // Update theme when appearance changes
  useEffect(() => {
    setTheme(appearance.theme);
  }, [appearance.theme, setTheme]);

  // Security Settings State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem('fiberops_profile', JSON.stringify(profile));
    localStorage.setItem('fiberops_notifications', JSON.stringify(notifications));
    localStorage.setItem('fiberops_appearance', JSON.stringify(appearance));
    localStorage.setItem('fiberops_security', JSON.stringify(security));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5 transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3 animate-slide-in">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-800 dark:text-green-200 font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            
            {/* Appearance Tab with Working Dark Mode */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAppearance({...appearance, theme: 'light'})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          appearance.theme === 'light'
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Sun size={32} className="text-yellow-500" />
                        </div>
                        <div className="w-full h-20 bg-white rounded border border-gray-200 mb-2"></div>
                        <p className="font-medium text-gray-900 dark:text-white">Light Mode</p>
                      </button>

                      <button
                        onClick={() => setAppearance({...appearance, theme: 'dark'})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          appearance.theme === 'dark'
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Moon size={32} className="text-blue-500" />
                        </div>
                        <div className="w-full h-20 bg-gray-900 rounded border border-gray-700 mb-2"></div>
                        <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Size</label>
                    <select
                      value={appearance.fontSize}
                      onChange={(e) => setAppearance({...appearance, fontSize: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Compact Mode</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing for more content</p>
                    </div>
                    <button
                      onClick={() => setAppearance({...appearance, compactMode: !appearance.compactMode})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        appearance.compactMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
{activeTab === 'profile' && (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Information</h2>
      
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          AJ
        </div>
        <div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Upload Photo
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => setProfile({...profile, company: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  </div>
)}

{/* Notifications Tab */}
{activeTab === 'notifications' && (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
    
    <div className="space-y-4">
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {key.includes('email') && 'Receive updates via email'}
              {key.includes('push') && 'Browser push notifications'}
              {key.includes('Report') && 'Automated performance reports'}
              {key.includes('Alerts') && 'Get notified about important events'}
            </p>
          </div>
          <button
            onClick={() => setNotifications({...notifications, [key]: !value})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* Security Tab */}
{activeTab === 'security' && (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security Settings</h2>

    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
          <button
            onClick={() => setSecurity({...security, twoFactorAuth: !security.twoFactorAuth})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              security.twoFactorAuth ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Session Timeout</h3>
        <select
          value={security.sessionTimeout}
          onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">Login Alerts</h3>
          <button
            onClick={() => setSecurity({...security, loginAlerts: !security.loginAlerts})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              security.loginAlerts ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new login attempts</p>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg transition-all font-medium">
          Change Password
        </button>
      </div>
    </div>
  </div>
)}

{/* Billing Tab */}
{activeTab === 'billing' && (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Billing & Subscription</h2>

    <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">Professional Plan</h3>
          <p className="text-white/90 mb-1">$99/month • Billed annually</p>
          <p className="text-sm text-white/80">Next billing date: January 15, 2026</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/80 mb-1">Total</div>
          <div className="text-3xl font-bold">$1,188</div>
          <div className="text-sm text-white/80">per year</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="flex-1 px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Upgrade Plan
        </button>
        <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors">
          View Plans
        </button>
      </div>
    </div>

    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Payment Method</h3>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700">
          Edit
        </button>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
          VISA
        </div>
        <div>
          <p className="text-gray-900 dark:text-white font-medium">•••• •••• •••• 4242</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/2026</p>
        </div>
      </div>
    </div>

    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Billing History</h3>
      <div className="space-y-2">
        {[
          { date: 'Jan 15, 2025', amount: '$99.00', status: 'Paid' },
          { date: 'Dec 15, 2024', amount: '$99.00', status: 'Paid' },
          { date: 'Nov 15, 2024', amount: '$99.00', status: 'Paid' },
        ].map((invoice, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{invoice.date}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Professional Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{invoice.amount}</p>
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
