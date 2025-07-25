import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Edit3, 
  Save, 
  Camera, 
  Trophy, 
  Target,
  Smartphone,
  Calendar,
  ExternalLink,
  Loader,
  Key,
  Instagram,
  Youtube,
  Twitter,
  Share2,
  Trash2,
  Plus
} from 'lucide-react';

interface SocialLinks {
  [key: string]: string;
}

interface BankingInfo {
  [key: string]: string;
}

interface ProfileData {
  id: string;
  username: string;
  ign: string;
  role: string;
  avatar_url?: string;
  tiktok_handle?: string;
  preferred_mode?: string;
  device?: string;
  kills?: number;
  attendance?: number;
  tier?: string;
  grade?: string;
  date_joined?: string;
  created_at?: string;
  updated_at?: string;
  banking_info?: BankingInfo;
  social_links?: SocialLinks;
  player_uid?: string;
}

export const Profile: React.FC = () => {
  const { profile, updateProfile, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    ign: '',
    tiktok_handle: '',
    preferred_mode: '',
    device: '',
    player_uid: '',
    social_links: {} as SocialLinks,
    banking_info: {} as BankingInfo
  });
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialHandle, setNewSocialHandle] = useState('');
  const [newBankingKey, setNewBankingKey] = useState('');
  const [newBankingValue, setNewBankingValue] = useState('');

  // Ensure client-side rendering for hydration safety
  useEffect(() => {
    setIsClient(true);
    if (profile) {
      setFormData({
        username: profile.username || '',
        ign: profile.ign || '',
        tiktok_handle: profile.tiktok_handle || '',
        preferred_mode: profile.preferred_mode || '',
        device: profile.device || '',
        player_uid: profile.player_uid || '',
        social_links: profile.social_links || {},
        banking_info: profile.banking_info || {}
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (profile) {
      try {
        const updateData = {
          ...formData
        };
        await updateProfile(updateData);
        setEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: data.publicUrl });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email found for password reset",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await resetPassword(user.email);
      if (success) {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for password reset instructions",
        });
      } else {
        throw new Error("Failed to send password reset email");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const formatSocialLink = (handle: string, platform: string) => {
    if (!handle) return null;
    
    let url = '';
    const cleanHandle = handle.replace('@', '');
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        url = `https://instagram.com/${cleanHandle}`;
        break;
      case 'youtube':
        url = `https://youtube.com/@${cleanHandle}`;
        break;
      case 'twitter':
      case 'x':
        url = `https://x.com/${cleanHandle}`;
        break;
      case 'tiktok':
        url = `https://tiktok.com/@${cleanHandle}`;
        break;
      case 'discord':
        return handle; // Discord handles don't have URLs
      default:
        return handle;
    }
    
    return url;
  };

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialHandle) {
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [newSocialPlatform.toLowerCase()]: newSocialHandle
        }
      }));
      setNewSocialPlatform('');
      setNewSocialHandle('');
    }
  };

  const removeSocialLink = (platform: string) => {
    const { [platform]: _, ...rest } = formData.social_links;
    setFormData(prev => ({
      ...prev,
      social_links: rest
    }));
  };

  const addBankingInfo = () => {
    if (newBankingKey && newBankingValue) {
      setFormData(prev => ({
        ...prev,
        banking_info: {
          ...prev.banking_info,
          [newBankingKey.toLowerCase().replace(/\s/g, '_')]: newBankingValue
        }
      }));
      setNewBankingKey('');
      setNewBankingValue('');
    }
  };

  const removeBankingInfo = (key: string) => {
    const { [key]: _, ...rest } = formData.banking_info;
    setFormData(prev => ({
      ...prev,
      banking_info: rest
    }));
  };

  // Avoid rendering during SSR until client-side hydration
  if (!isClient || !profile) {
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
                className="w-32 h-32 rounded-full border-4 border-[#FF1F44]/30 object-cover"
              />
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload">
                  <Button 
                    size="sm"
                    className="rounded-full p-2 bg-[#FF1F44] hover:bg-red-600 cursor-pointer"
                    disabled={uploading}
                    asChild
                  >
                    <div>
                      {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    </div>
                  </Button>
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Ɲ・乂{profile.ign}</h1>
              <p className="text-gray-300 mb-4">{profile.username}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <Badge className={`${getGradeColor(profile.grade || 'D')} text-white`}>
                  Grade {profile.grade || 'D'}
                </Badge>
                <Badge variant="outline" className="border-[#FF1F44]/50 text-[#FF1F44]">
                  {profile.tier || 'Not specified'}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {profile.device || 'Mobile'}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  Role: {profile.role}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF1F44]">{profile.kills?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-400">Total Kills</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF1F44]">{profile.attendance || 0}%</div>
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

            <div className="flex flex-col items-start justify-center">
              <Button
                onClick={() => setEditing(!editing)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {editing ? 'Save' : 'Edit Profile'}
              </Button>
              <Button
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 mt-2"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
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
                {editing ? (
                  <Input
                    value={formData.ign}
                    onChange={(e) => setFormData(prev => ({ ...prev, ign: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="Your in-game name"
                  />
                ) : (
                  <div className="text-white font-medium mt-1">Ɲ・乂{profile.ign}</div>
                )}
              </div>
              <div>
                <Label className="text-gray-300">Username</Label>
                {editing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="Your username"
                  />
                ) : (
                  <div className="text-white font-medium mt-1">{profile.username}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Total Kills</Label>
                <div className="text-white font-medium mt-1">{profile.kills?.toLocaleString() || 0}</div>
              </div>
              <div>
                <Label className="text-gray-300">Player UID</Label>
                {editing ? (
                  <Input
                    value={formData.player_uid}
                    onChange={(e) => setFormData(prev => ({ ...prev, player_uid: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="Player UID"
                  />
                ) : (
                  <div className="text-white font-medium mt-1">{profile.player_uid || 'Not specified'}</div>
                )}
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
                <Label className="text-gray-300">Tier</Label>
                <div className="text-white font-medium mt-1">{profile.tier || 'Not specified'}</div>
              </div>
              <div>
                <Label className="text-gray-300">Grade</Label>
                <div className="text-white font-medium mt-1">{profile.grade || 'Not specified'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">User ID</Label>
                <div className="text-white font-medium mt-1">{profile.id.slice(0, 8)}...</div>
              </div>
              <div>
                <Label className="text-gray-300">Role</Label>
                <div className="text-white font-medium mt-1 capitalize">{profile.role}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Date Joined</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-[#FF1F44]" />
                  <span className="text-white">{profile.date_joined || 'Not specified'}</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Account Created</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-[#FF1F44]" />
                  <span className="text-white">
                    {profile.created_at ? new Date(profile.created_at).toLocaleString() : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Last Updated</Label>
              <div className="flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-2 text-[#FF1F44]" />
                <span className="text-white">
                  {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Not specified'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handlePasswordReset}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
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
                <div className="flex items-center mt-1">
                  {getSocialIcon('tiktok')}
                  <span className="ml-2 text-white font-medium">
                    {profile.tiktok_handle ? (
                      <a 
                        href={formatSocialLink(profile.tiktok_handle, 'tiktok') || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF1F44] hover:text-red-300 transition-colors"
                      >
                        {profile.tiktok_handle}
                      </a>
                    ) : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {profile.social_links && (
              <div className="space-y-3">
                {Object.entries(formData.social_links).map(([platform, handle]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getSocialIcon(platform)}
                      {editing ? (
                        <Input
                          value={handle}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            social_links: { ...prev.social_links, [platform]: e.target.value }
                          }))}
                          className="ml-2 bg-white/5 border-white/20 text-white w-64"
                        />
                      ) : (
                        <span className="ml-2 text-white font-medium">
                          {formatSocialLink(handle, platform) ? (
                            <a 
                              href={formatSocialLink(handle, platform) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF1F44] hover:text-red-300 transition-colors"
                            >
                              {handle}
                            </a>
                          ) : handle}
                        </span>
                      )}
                    </div>
                    {editing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(platform)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editing && (
              <div className="pt-4 border-t border-white/10 flex items-center space-x-2">
                <Input
                  placeholder="Platform (e.g., Instagram)"
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
                <Input
                  placeholder="Handle (e.g., @username)"
                  value={newSocialHandle}
                  onChange={(e) => setNewSocialHandle(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
                <Button
                  onClick={addSocialLink}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.banking_info && (
              <div className="space-y-2">
                {Object.entries(formData.banking_info).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex justify-between w-full max-w-md">
                      <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                      {editing ? (
                        <Input
                          value={value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            banking_info: { ...prev.banking_info, [key]: e.target.value }
                          }))}
                          className="bg-white/5 border-white/20 text-white w-64"
                        />
                      ) : (
                        <span className="text-white font-medium">{value}</span>
                      )}
                    </div>
                    {editing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBankingInfo(key)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editing && (
              <div className="pt-4 border-t border-white/10 flex items-center space-x-2">
                <Input
                  placeholder="Field (e.g., Bank Name)"
                  value={newBankingKey}
                  onChange={(e) => setNewBankingKey(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
                <Input
                  placeholder="Value"
                  value={newBankingValue}
                  onChange={(e) => setNewBankingValue(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
                <Button
                  onClick={addBankingInfo}
                  className="bg-[#FF1F44] hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            )}

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