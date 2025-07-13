
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Palette, 
  Shield,
  Trash2,
  Save
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    announcements: true,
    clanWars: true,
    tournaments: true,
    messages: false,
    email: true
  });

  const handlePasswordChange = () => {
    // In real app, would validate and update password
    console.log('Password change requested');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-[#FF1F44]/20 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-[#FF1F44]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>
      </div>

      {/* Password Settings */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="mt-1 bg-white/5 border-white/20 text-white"
              placeholder="Enter current password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1 bg-white/5 border-white/20 text-white"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1 bg-white/5 border-white/20 text-white"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button 
            onClick={handlePasswordChange}
            className="bg-[#FF1F44] hover:bg-red-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Announcements</p>
                <p className="text-gray-400 text-sm">Get notified about clan announcements</p>
              </div>
              <Switch
                checked={notifications.announcements}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, announcements: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Clan Wars</p>
                <p className="text-gray-400 text-sm">Notifications for clan war events</p>
              </div>
              <Switch
                checked={notifications.clanWars}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, clanWars: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Tournaments</p>
                <p className="text-gray-400 text-sm">Tournament registration and updates</p>
              </div>
              <Switch
                checked={notifications.tournaments}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tournaments: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Direct Messages</p>
                <p className="text-gray-400 text-sm">Chat notifications from other members</p>
              </div>
              <Switch
                checked={notifications.messages}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, messages: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-3 block">Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 border-2 border-[#FF1F44]/50 rounded-lg cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-br from-[#FF1F44]/20 to-red-600/10 rounded mb-2"></div>
                  <p className="text-white font-medium">Dark Mode (Current)</p>
                  <p className="text-gray-400 text-sm">Tactical dark theme</p>
                </div>
                <div className="p-4 bg-white/5 border-2 border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors">
                  <div className="w-full h-20 bg-gradient-to-br from-gray-200 to-gray-100 rounded mb-2"></div>
                  <p className="text-white font-medium">Light Mode</p>
                  <p className="text-gray-400 text-sm">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Settings (if admin) */}
      {user?.role === 'admin' && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Admin Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Clan Registration</p>
                <p className="text-gray-400 text-sm">Allow new members to join the clan</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-approve Members</p>
                <p className="text-gray-400 text-sm">Automatically approve new registrations</p>
              </div>
              <Switch />
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Access Admin Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="bg-red-500/5 border-red-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2">Delete Account</p>
              <p className="text-gray-400 text-sm mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
