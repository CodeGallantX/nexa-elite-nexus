
import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);


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
      'S': 'bg-yellow-500',
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-orange-500',
      'D': 'bg-red-500'
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
              <h1 className="text-3xl font-bold text-white mb-2">{profile?.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{profile.ign}</h1>
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

<div className='flex flex-col items-start justify-center'>
            {/* Edit Button */}
            <Button
              onClick={() => navigate('/settings')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              onClick={() => navigate(`/public-profile/${profile.id}`)}
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
                <div className="text-white font-medium mt-1">{profile?.status === 'beta' ? 'Ɲ・乃' : 'Ɲ・乂'}{profile.ign}</div>
              </div>
              <div>
                <Label className="text-gray-300">Username</Label>
                <div className="text-white font-medium mt-1">{profile.username}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Total Kills</Label>
                <div className="text-white font-medium mt-1">{profile.kills?.toLocaleString() || 0}</div>
                <div className="text-xs text-gray-400 mt-1">
                  <span className="text-blue-400">BR: {profile.br_kills || 0}</span> • <span className="text-green-400">MP: {profile.mp_kills || 0}</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Player UID</Label>
                <div className="text-white font-medium mt-1">{profile.player_uid || profile.id.slice(0, 8) + '...'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Gaming Device</Label>
                <div className="flex items-center mt-1">
                  <Smartphone className="w-4 h-4 mr-2 text-[#FF1F44]" />
                  <span className="text-white">{profile.device || 'Not specified'}</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Game Mode</Label>
                <div className="text-white font-medium mt-1">{profile.preferred_mode || 'Not specified'}</div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Grade</Label>
                <Badge className={`${getGradeColor(profile.grade || 'D')} text-white mt-1`}>
                  Grade {profile.grade}
                </Badge>
              </div>
              <div>
                <Label className="text-gray-300">Tier</Label>
                <Badge variant="outline" className="border-[#FF1F44]/50 text-[#FF1F44] mt-1">
                  Tier {profile.tier}
                </Badge>
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
            </div>

            {/* All Social Links (stored in social_links JSON field) */}
            {profile.social_links && (
              <div className="space-y-3">
                {Object.entries(profile.social_links as Record<string, string>).map(([platform, handle]) => (
                  <div key={platform}>
                    <Label className="text-gray-300 capitalize">{platform}</Label>
                    <div className="flex items-center mt-1">
                      {getSocialIcon(platform)}
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
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Banking Info */}
            {profile.banking_info && (
              <div className="pt-4 border-t border-white/10">
                <Label className="text-gray-300">Banking Information</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(profile.banking_info as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

          </CardContent>
        </Card>
      </div>
    </div>
  );
};
