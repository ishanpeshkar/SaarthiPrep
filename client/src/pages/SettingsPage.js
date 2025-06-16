import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  
  // Initialize state with default values or from user context
  const [settingsData, setSettingsData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    notifications: {
      emailOnSchedule: true,
      emailOnFeedback: true,
    },
    theme: 'light',
  });

  // Populate form with user data once it's loaded
  useEffect(() => {
    if (user) {
      setSettingsData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setSettingsData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [name]: checked },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call here to save the settings
    console.log("Saving settings:", settingsData);
    alert('Settings saved successfully!');
    // Clear password fields after saving
    setSettingsData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete your account and all your data.')) {
      // In a real app, you would make an API call to delete the user's account
      alert('Account deletion process initiated.');
      // Then you would log the user out and redirect
    }
  };

  if (!user) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-grid">
          {/* Profile Settings Card */}
          <div className="settings-card">
            <h3>Profile Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={settingsData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={settingsData.email} disabled />
              <small>Email cannot be changed.</small>
            </div>
          </div>

          {/* Password Settings Card */}
          <div className="settings-card">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={settingsData.currentPassword} onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={settingsData.newPassword} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>

          {/* Notification Settings Card */}
          <div className="settings-card">
            <h3>Notifications</h3>
            <p>We'll only send emails for important updates.</p>
            <div className="form-group-toggle">
              <label>Email me when an interview is scheduled</label>
              <label className="toggle-switch">
                <input type="checkbox" name="emailOnSchedule" checked={settingsData.notifications.emailOnSchedule} onChange={handleToggleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group-toggle">
              <label>Email me when I receive new feedback</label>
              <label className="toggle-switch">
                <input type="checkbox" name="emailOnFeedback" checked={settingsData.notifications.emailOnFeedback} onChange={handleToggleChange} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="settings-card danger-zone">
            <h3>Danger Zone</h3>
            <div className="form-group-toggle">
              <div>
                <h4>Delete this account</h4>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
          </div>
        </div>

        <div className="form-actions-save">
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;