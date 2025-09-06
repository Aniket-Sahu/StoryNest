import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newFollowerNotifs: true,
    newChapterNotifs: true,
    likeNotifs: true,
    commentNotifs: true,
    theme: 'light',
    fontSize: 'medium',
    privacy: 'public'
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load user settings from localStorage or API
    const savedSettings = localStorage.getItem(`settings_${user?.id}`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // Save to localStorage (in a real app, you'd save to backend)
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      // In a real app, you'd call the delete account API
      logout();
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and privacy settings</p>
        </div>

        <div className="settings-content">
          {/* Notifications Section */}
          <div className="settings-section">
            <h2>Notifications</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p>Receive notifications via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Push Notifications</h3>
                  <p>Receive push notifications in your browser</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>New Followers</h3>
                  <p>Get notified when someone follows you</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.newFollowerNotifs}
                    onChange={(e) => handleSettingChange('newFollowerNotifs', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>New Chapters</h3>
                  <p>Get notified when stories you follow are updated</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.newChapterNotifs}
                    onChange={(e) => handleSettingChange('newChapterNotifs', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Likes & Comments</h3>
                  <p>Get notified when someone likes or comments on your stories</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.likeNotifs}
                    onChange={(e) => handleSettingChange('likeNotifs', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Theme</h3>
                  <p>Choose your preferred theme</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Reading Font Size</h3>
                  <p>Default font size for reading stories</p>
                </div>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="setting-select"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="settings-section">
            <h2>Privacy</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Profile Visibility</h3>
                  <p>Who can see your profile and stories</p>
                </div>
                <select
                  value={settings.privacy}
                  onChange={(e) => handleSettingChange('privacy', e.target.value)}
                  className="setting-select"
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="settings-section">
            <h2>Account</h2>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Account Information</h3>
                  <p>Update your profile and account details</p>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Sign Out</h3>
                  <p>Sign out of your account on this device</p>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>

              <div className="setting-item danger">
                <div className="setting-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={loading || saved}
            >
              {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
