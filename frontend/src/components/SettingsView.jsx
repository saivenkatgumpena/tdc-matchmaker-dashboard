import { useState } from 'react';
import { User, Bell, Shield, Save } from 'lucide-react';

export default function SettingsView() {
  const [profile, setProfile] = useState({
    name: "Sai Venkat",
    email: "sai.venkat@thedatecrew.com",
    role: "Senior Matchmaker",
    phone: "+91 98765 43210"
  });

  const [notifications, setNotifications] = useState({
    emailOnMatchAccepted: true,
    emailOnMeetingScheduled: true,
    weeklyDigest: false,
    smsAlerts: true
  });

  const [password, setPassword] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert("Profile configurations updated successfully!");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPassword({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="view-container">
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
          Matchmaker Portal Settings
        </h2>
        <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
          Configure your CRM interface parameters, security settings, and notifications alerts.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Profile Settings */}
        <div style={{ flex: 1.2 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <User size={18} style={{ color: '#E05370' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700' }}>
                Profile Preferences
              </h3>
            </div>

            <form onSubmit={handleProfileSave} className="settings-form">
              <div className="settings-avatar-upload">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" 
                  alt="Avatar" 
                  className="settings-avatar-preview" 
                />
                <button type="button" className="btn btn-secondary btn-sm">Upload New Photo</button>
              </div>

              <div className="settings-row-split">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Matchmaker Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="settings-row-split">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Save size={14} />
                Save Changes
              </button>
            </form>
          </div>

          {/* Security (Password Change) */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Shield size={18} style={{ color: '#8C47E5' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700' }}>
                Change Password
              </h3>
            </div>

            <form onSubmit={handlePasswordSave} className="settings-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>

              <div className="settings-row-split">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    value={password.newPass}
                    onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    value={password.confirm}
                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Save size={14} />
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Notifications Checkbox preferences */}
        <div style={{ flex: 0.8 }}>
          <div className="card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Bell size={18} style={{ color: '#2884C6' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700' }}>
                Notifications Rules
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="notif1" 
                  checked={notifications.emailOnMatchAccepted} 
                  onChange={(e) => setNotifications({ ...notifications, emailOnMatchAccepted: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E05370', marginTop: '2px' }}
                />
                <div>
                  <label htmlFor="notif1" style={{ fontSize: '13px', fontWeight: '700', color: '#1C1335', cursor: 'pointer' }}>
                    Match acceptance logs
                  </label>
                  <span style={{ fontSize: '11px', color: '#7A7585', display: 'block', marginTop: '2px', lineHeight: '1.4' }}>
                    Receive a system notification email when a customer accepts a recommended match suggestion.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="notif2" 
                  checked={notifications.emailOnMeetingScheduled} 
                  onChange={(e) => setNotifications({ ...notifications, emailOnMeetingScheduled: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E05370', marginTop: '2px' }}
                />
                <div>
                  <label htmlFor="notif2" style={{ fontSize: '13px', fontWeight: '700', color: '#1C1335', cursor: 'pointer' }}>
                    Meeting calendar alerts
                  </label>
                  <span style={{ fontSize: '11px', color: '#7A7585', display: 'block', marginTop: '2px', lineHeight: '1.4' }}>
                    Get calendar invites sent directly to your registered Google/Outlook workspace.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="notif3" 
                  checked={notifications.smsAlerts} 
                  onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E05370', marginTop: '2px' }}
                />
                <div>
                  <label htmlFor="notif3" style={{ fontSize: '13px', fontWeight: '700', color: '#1C1335', cursor: 'pointer' }}>
                    SMS Urgent Escalations
                  </label>
                  <span style={{ fontSize: '11px', color: '#7A7585', display: 'block', marginTop: '2px', lineHeight: '1.4' }}>
                    Receive SMS alerts for client meeting changes within 2 hours of schedule.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="notif4" 
                  checked={notifications.weeklyDigest} 
                  onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#E05370', marginTop: '2px' }}
                />
                <div>
                  <label htmlFor="notif4" style={{ fontSize: '13px', fontWeight: '700', color: '#1C1335', cursor: 'pointer' }}>
                    Weekly Matching Summary
                  </label>
                  <span style={{ fontSize: '11px', color: '#7A7585', display: 'block', marginTop: '2px', lineHeight: '1.4' }}>
                    Get email summaries outlining your weekly success rates and customer conversion timelines.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
