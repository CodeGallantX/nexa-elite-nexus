
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Edit3, 
  Save, 
  Camera, 
  Trophy, 
  Target,
  Smartphone,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    tiktok_handle: profile?.tiktok_handle || '',
    preferred_mode: profile?.preferred_mode || '',
    device: profile?.device || ''
  });

  const handleSave = async () => {
    if (profile) {
      await updateProfile(formData);
      setEditing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors = {
      'S': 'bg-yellow-500',
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-orange-500',
      'D': 'bg-red-500'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500';
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[#FF1F44]/10 to-red-600/5 border-[#FF1F44]/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar_url || '/placeholder.svg'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-[#FF1F44]/30"
              />
              <Button 
                size="sm"
                className="absolute bottom-0 right-0 rounded-full p-2 bg-[#FF1F44] hover:bg-red-600"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.ign}</h1>
              <p className="text-gray-300 mb-4">{profile.username}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <Badge className={`${getGradeColor(profile.grade || 'D')} text-white`}>
                  Grade {profile.grade}
                </Badge>
                <Badge variant="outline" className="border-[#FF1F44]/50 text-[#FF1F44]">
                  {profile.tier}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {profile.device || 'Mobile'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF1F44]">{profile.kills?.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Kills</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF1F44]">{profile.attendance}%</div>
                  <div className="text-sm text-gray-400">Attendance</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF1F44]">
                    {profile.date_joined ? 
                      Math.floor((Date.now() - new Date(profile.date_joined).getTime()) / (1000 * 60 * 60 * 24)) 
                      : 0} days
                  </div>
                  <div className="text-sm text-gray-400">Member Since</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setEditing(!editing)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {editing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Information */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Game Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">In-Game Name</Label>
                <div className="text-white font-medium mt-1">{profile.ign}</div>
              </div>
              <div>
                <Label className="text-gray-300">Username</Label>
                <div className="text-white font-medium mt-1">{profile.username}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Gaming Device</Label>
                {editing ? (
                  <Input
                    value={formData.device}
                    onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="e.g., iPhone, Android"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <Smartphone className="w-4 h-4 mr-2 text-[#FF1F44]" />
                    <span className="text-white">{profile.device || 'Not specified'}</span>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-gray-300">Game Mode</Label>
                {editing ? (
                  <Input
                    value={formData.preferred_mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_mode: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="e.g., Battle Royale, MP"
                  />
                ) : (
                  <div className="text-white font-medium mt-1">{profile.preferred_mode || 'Not specified'}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Role</Label>
                <div className="text-white font-medium mt-1 capitalize">{profile.role}</div>
              </div>
              <div>
                <Label className="text-gray-300">Date Joined</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-[#FF1F44]" />
                  <span className="text-white">{profile.date_joined}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tiktok" className="text-gray-300">TikTok Handle</Label>
              {editing ? (
                <Input
                  id="tiktok"
                  value={formData.tiktok_handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="@username"
                />
              ) : (
                <div className="text-white font-medium mt-1">{profile.tiktok_handle || 'Not provided'}</div>
              )}
            </div>

            {editing && (
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
