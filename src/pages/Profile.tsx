import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  CreditCard
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    tiktok_handle: profile?.tiktok_handle || '',
    preferred_mode: profile?.preferred_mode || '',
    device: profile?.device || '',
    ign: profile?.ign || '',
    username: profile?.username || '',
    player_uid: profile?.player_uid || '',
    grade: profile?.grade || 'Rookie',
    tier: profile?.tier || '4',
    social_links: {
      tiktok: profile?.social_links?.tiktok || '',
      youtube: profile?.social_links?.youtube || '',
      discord: profile?.social_links?.discord || '',
      x: profile?.social_links?.x || '',
      instagram: profile?.social_links?.instagram || ''
    },
    banking_info: {
      real_name: profile?.banking_info?.real_name || '',
      account_name: profile?.banking_info?.account_name || '',
      account_number: profile?.banking_info?.account_number || '',
      bank_name: profile?.banking_info?.bank_name || ''
    }
  });

  const handleSave = async () => {
    if (profile) {
      const updateData = {
        tiktok_handle: formData.tiktok_handle,
        preferred_mode: formData.preferred_mode,
        device: formData.device,
        ign: formData.ign,
        username: formData.username,
        player_uid: formData.player_uid,
        grade: formData.grade,
        tier: formData.tier,
        social_links: formData.social_links,
        banking_info: formData.banking_info
      };
      await updateProfile(updateData);
      setEditing(false);
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
    } catch (error) {
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

  const getGradeColor = (grade: string) => {
    const colors = {
      'Legendary': 'bg-yellow-500',
      'Veteran': 'bg-green-500',
      'Pro': 'bg-blue-500',
      'Elite': 'bg-orange-500',
      'Rookie': 'bg-red-500'
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-500';
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

    const success = await resetPassword(user.email);
    if (success) {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    }
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

 const navigate = useNavigate()

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
                <Badge className={`${getGradeColor(profile.grade || 'Rookie')} text-white`}>
                  {profile.grade}
                </Badge>
                <Badge variant="outline" className="border-[#FF1F44]/50 text-[#FF1F44]">
                  Tier {profile.tier}
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

<div className='flex flex-col items-start justify-center'>
            {/* Edit Button */}
            <Button
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {editing ? 'Save' : 'Edit Profile'}
            </Button>
            {editing && (
              <Button
                onClick={() => setEditing(false)}
                variant="outline"
                className="mt-2 border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => navigate('/profile/:id/')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Share2 />
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
                <div className="text-white font-medium mt-1">{profile.kills?.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Managed by admin</div>
              </div>
              <div>
                <Label className="text-gray-300">Player UID</Label>
                {editing ? (
                  <Input
                    value={formData.player_uid}
                    onChange={(e) => setFormData(prev => ({ ...prev, player_uid: e.target.value }))}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="CDM001234567"
                  />
                ) : (
                  <div className="text-white font-medium mt-1">{profile.player_uid || 'Not set'}</div>
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
                <Label className="text-gray-300">Grade</Label>
                {editing ? (
                  <Select 
                    value={formData.grade} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Legendary">Legendary</SelectItem>
                      <SelectItem value="Veteran">Veteran</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Elite">Elite</SelectItem>
                      <SelectItem value="Rookie">Rookie</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-white font-medium mt-1">{profile.grade}</div>
                )}
              </div>
              <div>
                <Label className="text-gray-300">Tier</Label>
                {editing ? (
                  <Select 
                    value={formData.tier} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}
                  >
                    <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tier 1</SelectItem>
                      <SelectItem value="2">Tier 2</SelectItem>
                      <SelectItem value="3">Tier 3</SelectItem>
                      <SelectItem value="4">Tier 4</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-white font-medium mt-1">Tier {profile.tier}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Role</Label>
                <div className="text-white font-medium mt-1 capitalize">{profile.role}</div>
                <div className="text-xs text-gray-400 mt-1">Managed by admin</div>
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

        {/* Social Media & Account */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Social Media & Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* TikTok */}
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

            {/* YouTube */}
            <div>
              <Label htmlFor="youtube" className="text-gray-300">YouTube</Label>
              {editing ? (
                <Input
                  id="youtube"
                  value={formData.social_links.youtube}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, youtube: e.target.value }
                  }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="Channel name"
                />
              ) : (
                <div className="flex items-center mt-1">
                  {getSocialIcon('youtube')}
                  <span className="ml-2 text-white font-medium">
                    {profile.social_links?.youtube ? (
                      <a 
                        href={formatSocialLink(profile.social_links.youtube, 'youtube') || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF1F44] hover:text-red-300 transition-colors"
                      >
                        {profile.social_links.youtube}
                      </a>
                    ) : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Discord */}
            <div>
              <Label htmlFor="discord" className="text-gray-300">Discord</Label>
              {editing ? (
                <Input
                  id="discord"
                  value={formData.social_links.discord}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, discord: e.target.value }
                  }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="username#1234"
                />
              ) : (
                <div className="flex items-center mt-1">
                  {getSocialIcon('discord')}
                  <span className="ml-2 text-white font-medium">
                    {profile.social_links?.discord || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* X (Twitter) */}
            <div>
              <Label htmlFor="x" className="text-gray-300">X (Twitter)</Label>
              {editing ? (
                <Input
                  id="x"
                  value={formData.social_links.x}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, x: e.target.value }
                  }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="@username"
                />
              ) : (
                <div className="flex items-center mt-1">
                  {getSocialIcon('x')}
                  <span className="ml-2 text-white font-medium">
                    {profile.social_links?.x ? (
                      <a 
                        href={formatSocialLink(profile.social_links.x, 'x') || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF1F44] hover:text-red-300 transition-colors"
                      >
                        {profile.social_links.x}
                      </a>
                    ) : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Instagram */}
            <div>
              <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
              {editing ? (
                <Input
                  id="instagram"
                  value={formData.social_links.instagram}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, instagram: e.target.value }
                  }))}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="@username"
                />
              ) : (
                <div className="flex items-center mt-1">
                  {getSocialIcon('instagram')}
                  <span className="ml-2 text-white font-medium">
                    {profile.social_links?.instagram ? (
                      <a 
                        href={formatSocialLink(profile.social_links.instagram, 'instagram') || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF1F44] hover:text-red-300 transition-colors"
                      >
                        {profile.social_links.instagram}
                      </a>
                    ) : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Banking Info */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2 text-[#FF1F44]" />
                <Label className="text-gray-300">Banking Information</Label>
              </div>
              
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 text-sm">Real Name</Label>
                    <Input
                      value={formData.banking_info.real_name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        banking_info: { ...prev.banking_info, real_name: e.target.value }
                      }))}
                      className="mt-1 bg-white/5 border-white/20 text-white"
                      placeholder="Full legal name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Account Name</Label>
                    <Input
                      value={formData.banking_info.account_name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        banking_info: { ...prev.banking_info, account_name: e.target.value }
                      }))}
                      className="mt-1 bg-white/5 border-white/20 text-white"
                      placeholder="Account holder name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Account Number</Label>
                    <Input
                      value={formData.banking_info.account_number}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        banking_info: { ...prev.banking_info, account_number: e.target.value }
                      }))}
                      className="mt-1 bg-white/5 border-white/20 text-white"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Bank Name</Label>
                    <Select 
                      value={formData.banking_info.bank_name} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        banking_info: { ...prev.banking_info, bank_name: value }
                      }))}
                    >
                      <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Opay">Opay</SelectItem>
                        <SelectItem value="Palmpay">Palmpay</SelectItem>
                        <SelectItem value="Moniepoint">Moniepoint</SelectItem>
                        <SelectItem value="Kuda">Kuda</SelectItem>
                        <SelectItem value="Access Bank">Access Bank</SelectItem>
                        <SelectItem value="GTBank">GTBank</SelectItem>
                        <SelectItem value="First Bank">First Bank</SelectItem>
                        <SelectItem value="UBA">UBA</SelectItem>
                        <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                        <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.banking_info?.real_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Real Name:</span>
                      <span className="text-white font-medium">{profile.banking_info.real_name}</span>
                    </div>
                  )}
                  {profile.banking_info?.account_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Name:</span>
                      <span className="text-white font-medium">{profile.banking_info.account_name}</span>
                    </div>
                  )}
                  {profile.banking_info?.account_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Number:</span>
                      <span className="text-white font-medium">{profile.banking_info.account_number}</span>
                    </div>
                  )}
                  {profile.banking_info?.bank_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank:</span>
                      <span className="text-white font-medium">{profile.banking_info.bank_name}</span>
                    </div>
                  )}
                  {!profile.banking_info?.real_name && !profile.banking_info?.account_name && (
                    <div className="text-gray-400 text-sm">No banking information provided</div>
                  )}
                </div>
              )}
            </div>

            {/* Password Reset */}
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handlePasswordReset}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
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