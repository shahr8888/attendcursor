import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, User, Globe } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    daily: true,
    weekly: true,
    monthly: false
  })

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Backup', icon: Database },
    { id: 'account', name: 'Account', icon: User },
  ]

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Configure your attendance app preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent-cyan bg-opacity-10 text-accent-cyan'
                        : 'text-text-secondary hover:text-text-primary hover:bg-cursor-surface-variant'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Cursor Technologies"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Time Zone
                    </label>
                    <select className="input-field w-full">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      defaultValue="17:00"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Late Threshold (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Overtime Threshold (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue="8"
                      className="input-field w-full"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-text-primary font-medium mb-3">Notification Channels</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => handleNotificationChange('email', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">Email Notifications</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => handleNotificationChange('push', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">Push Notifications</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">SMS Notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-text-primary font-medium mb-3">Report Frequency</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.daily}
                          onChange={(e) => handleNotificationChange('daily', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">Daily Attendance Summary</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.weekly}
                          onChange={(e) => handleNotificationChange('weekly', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">Weekly Reports</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.monthly}
                          onChange={(e) => handleNotificationChange('monthly', e.target.checked)}
                          className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                        />
                        <span className="text-text-primary">Monthly Analytics</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">Save Preferences</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Security Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button className="btn-primary">Change Password</button>
                  </div>
                </div>
                
                <div className="border-t border-border-light pt-6">
                  <h4 className="text-text-primary font-medium mb-3">Two-Factor Authentication</h4>
                  <p className="text-text-secondary text-sm mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Appearance Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Theme
                    </label>
                    <select className="input-field w-full">
                      <option value="cursor-dark">Cursor Dark (Default)</option>
                      <option value="cursor-light">Cursor Light</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Font Size
                    </label>
                    <select className="input-field w-full">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Color Scheme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="w-full h-12 bg-accent-cyan rounded-lg border-2 border-accent-cyan"></button>
                      <button className="w-full h-12 bg-accent-blue rounded-lg border-2 border-transparent"></button>
                      <button className="w-full h-12 bg-accent-green rounded-lg border-2 border-transparent"></button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">Save Preferences</button>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Data & Backup</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-cursor-surface-variant rounded-lg">
                    <h4 className="text-text-primary font-medium mb-2">Export Data</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Download your attendance data in various formats
                    </p>
                    <div className="flex gap-2">
                      <button className="btn-secondary">CSV</button>
                      <button className="btn-secondary">Excel</button>
                      <button className="btn-secondary">PDF</button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-cursor-surface-variant rounded-lg">
                    <h4 className="text-text-primary font-medium mb-2">Backup Settings</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Automatically backup your data
                    </p>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-accent-cyan bg-cursor-surface-variant border-border-light rounded focus:ring-accent-cyan"
                      />
                      <span className="text-text-primary">Enable automatic backups</span>
                    </label>
                  </div>
                  
                  <div className="p-4 bg-cursor-surface-variant rounded-lg">
                    <h4 className="text-text-primary font-medium mb-2">Data Retention</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      How long to keep attendance records
                    </p>
                    <select className="input-field w-full">
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="5">5 years</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Admin User"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@cursor.com"
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      defaultValue="Administrator"
                      className="input-field w-full"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue="IT"
                      className="input-field w-full"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="btn-primary">Update Profile</button>
                </div>
                
                <div className="border-t border-border-light pt-6">
                  <h4 className="text-text-primary font-medium mb-3 text-status-error">Danger Zone</h4>
                  <p className="text-text-secondary text-sm mb-4">
                    These actions cannot be undone
                  </p>
                  <button className="btn-error">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
