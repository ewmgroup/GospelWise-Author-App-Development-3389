import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiArrowLeft, FiSave, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiShield } = FiIcons;

const SystemSettings = () => {
  const { isSuperAdmin } = useAuth();
  const [settings, setSettings] = useState({
    appName: 'GospelWise Author',
    maintenanceMode: false,
    emailNotifications: true,
    autoSaveInterval: 5,
    maxProjectsPerUser: 20,
    defaultProjectType: 'fiction',
    scriptures: [
      "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, to give you hope and a future.\" - Jeremiah 29:11",
      "\"She is clothed with strength and dignity; she can laugh at the days to come.\" - Proverbs 31:25",
      "\"Trust in the Lord with all your heart and lean not on your own understanding.\" - Proverbs 3:5",
      "\"The heart of man plans his way, but the Lord establishes his steps.\" - Proverbs 16:9"
    ]
  });
  const [newScripture, setNewScripture] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('gospelwise_system_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10)
    });
  };

  const handleAddScripture = () => {
    if (newScripture.trim()) {
      setSettings({
        ...settings,
        scriptures: [...settings.scriptures, newScripture.trim()]
      });
      setNewScripture('');
    }
  };

  const handleRemoveScripture = (index) => {
    const updatedScriptures = [...settings.scriptures];
    updatedScriptures.splice(index, 1);
    setSettings({
      ...settings,
      scriptures: updatedScriptures
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    // Save to localStorage
    localStorage.setItem('gospelwise_system_settings', JSON.stringify(settings));

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 800);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      appName: 'GospelWise Author',
      maintenanceMode: false,
      emailNotifications: true,
      autoSaveInterval: 5,
      maxProjectsPerUser: 20,
      defaultProjectType: 'fiction',
      scriptures: [
        "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, to give you hope and a future.\" - Jeremiah 29:11",
        "\"She is clothed with strength and dignity; she can laugh at the days to come.\" - Proverbs 31:25",
        "\"Trust in the Lord with all your heart and lean not on your own understanding.\" - Proverbs 3:5",
        "\"The heart of man plans his way, but the Lord establishes his steps.\" - Proverbs 16:9"
      ]
    };

    setSettings(defaultSettings);
    localStorage.setItem('gospelwise_system_settings', JSON.stringify(defaultSettings));
    setShowResetConfirm(false);

    // Show success message
    setSaveStatus('success');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors">
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-secondary-300" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-spiritual-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiSettings} className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800">System Settings</h1>
          </div>
        </div>
      </div>

      {/* Super Admin Badge */}
      {isSuperAdmin() && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 p-3 rounded-lg text-red-800">
          <SafeIcon icon={FiShield} className="w-5 h-5" />
          <span className="font-medium">Super Admin Mode</span>
          <span className="text-sm">You have full system access with the hardcoded admin@gospelwiseauthor.com account</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Default Project Type
                </label>
                <select
                  name="defaultProjectType"
                  value={settings.defaultProjectType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="fiction">Fiction</option>
                  <option value="nonfiction">Non-Fiction</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Behavior */}
          <div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">System Behavior</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Auto-Save Interval (minutes)
                </label>
                <input
                  type="number"
                  name="autoSaveInterval"
                  min="1"
                  max="60"
                  value={settings.autoSaveInterval}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Max Projects Per User
                </label>
                <input
                  type="number"
                  name="maxProjectsPerUser"
                  min="1"
                  max="100"
                  value={settings.maxProjectsPerUser}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 rounded"
                />
                <label htmlFor="maintenanceMode" className="text-sm font-medium text-secondary-700">
                  Maintenance Mode
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 rounded"
                />
                <label htmlFor="emailNotifications" className="text-sm font-medium text-secondary-700">
                  Email Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Scripture Rotation */}
          <div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">Scripture Rotation</h2>
            <p className="text-secondary-600 mb-4">
              These scriptures appear in the banner at the top of each page, rotating randomly.
            </p>

            {/* Current Scriptures */}
            <div className="space-y-3 mb-4">
              {settings.scriptures.map((scripture, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary-50 p-3 rounded-lg">
                  <p className="text-secondary-700 text-sm mr-2 font-serif italic">{scripture}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveScripture(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Scripture */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newScripture}
                onChange={(e) => setNewScripture(e.target.value)}
                placeholder='Add new scripture (include reference)'
                className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddScripture}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 flex items-center space-x-2 text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
              <span>Reset to Default</span>
            </button>
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-spiritual-600 text-white rounded-lg hover:from-primary-700 hover:to-spiritual-700 transition-colors flex items-center space-x-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSave} className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

          {/* Save Status */}
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5" />
              <span>Error saving settings. Please try again.</span>
            </div>
          )}
        </form>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6" />
              <h2 className="text-xl font-bold">Reset Settings</h2>
            </div>
            <p className="text-secondary-700 mb-6">
              This will reset all system settings to their default values. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;