
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Upload, 
  Save, 
  Smartphone,
  Link,
  CreditCard
} from 'lucide-react';

// Device and brand data from onboarding
const deviceData = {
  iPhone: [
    "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone SE (2nd generation)", "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone SE (3rd generation)",
    "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus",
    "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"
  ],
  Android: ['Samsung', 'Xiaomi', 'Infinix', 'Redmi', 'Itel', 'Tecno', 'Nokia', 'OnePlus', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Honor', 'Nothing'],
  iPad: [
    "iPad (5th generation)", "iPad (6th generation)", "iPad (7th generation)", "iPad (8th generation)",
    "iPad (9th generation)", "iPad (10th generation)", "iPad mini (5th generation)", "iPad mini (6th generation)",
    "iPad Air (3rd generation)", "iPad Air (4th generation)", "iPad Air (5th generation)", "iPad Air (6th generation)",
    "iPad Pro 10.5-inch", "iPad Pro 11-inch (1st generation)", "iPad Pro 12.9-inch (3rd generation)"
  ]
};

const socialPlatforms = ['tiktok', 'youtube', 'discord', 'x', 'instagram'];
const bankOptions = [
  'Opay', 'Palmpay', 'Moniepoint', 'Kuda', 'Access Bank', 'GTBank', 
  'First Bank', 'UBA', 'Zenith Bank', 'Fidelity Bank'
];

const gameModes = ['BR', 'MP', 'Both'];

export const Settings: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    ign: '',
    tiktok_handle: '',
    preferred_mode: '',
    device: '',
    deviceType: '',
    player_uid: '',
    social_links: {} as Record<string, string>,
    banking_info: {} as Record<string, string>,
    avatar_file: null as File | null
  });
  
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        ign: profile.ign || '',
        tiktok_handle: profile.tiktok_handle || '',
        preferred_mode: profile.preferred_mode || '',
        device: profile.device || '',
        deviceType: profile.device ? (deviceData.iPhone.includes(profile.device) ? 'iPhone' : 
                                      deviceData.iPad.includes(profile.device) ? 'iPad' : 'Android') : '',
        player_uid: profile.player_uid || '',
        social_links: profile.social_links || {},
        banking_info: profile.banking_info || {},
        avatar_file: null
      });
    }
  }, [profile]);

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if provided
      if (formData.avatar_file) {
        setIsUploading(true);
        avatarUrl = await uploadAvatar(formData.avatar_file);
      }

      const payload = {
        ign: formData.ign,
        tiktok_handle: formData.tiktok_handle || null,
        preferred_mode: formData.preferred_mode || null,
        device: formData.device || null,
        player_uid: formData.player_uid || null,
        social_links: formData.social_links,
        banking_info: formData.banking_info,
        ...(avatarUrl && { avatar_url: avatarUrl })
      };

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user?.id);

      if (error) throw error;
      
      setIsUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setFormData(prev => ({ ...prev, avatar_file: null }));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      setIsUploading(false);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    if (!formData.ign) {
      toast({
        title: "Validation Error",
        description: "IGN is a required field.",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({ ...prev, avatar_file: file }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-[#FF1F44]/20 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-[#FF1F44]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage 
                  src={formData.avatar_file ? URL.createObjectURL(formData.avatar_file) : profile?.avatar_url} 
                  alt={profile?.username} 
                />
                <AvatarFallback className="bg-[#FF1F44]/20 text-[#FF1F44] text-xl">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar" className="text-white text-sm font-medium">Profile Picture</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar')?.click()}
                    className="border-border text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </div>
            </div>

            {/* Username - Read Only */}
            <div>
              <Label htmlFor="username" className="text-white">Username (Read Only)</Label>
              <Input
                id="username"
                value={profile?.username || ''}
                disabled
                className="bg-background/30 border-border text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* IGN */}
            <div>
              <Label htmlFor="ign" className="text-white">In-Game Name (IGN)</Label>
              <Input
                id="ign"
                value={formData.ign}
                onChange={(e) => setFormData(prev => ({ ...prev, ign: e.target.value }))}
                placeholder="Your in-game name"
                className="bg-background/50 border-border text-white"
              />
            </div>

            {/* TikTok Handle */}
            <div>
              <Label htmlFor="tiktok" className="text-white">TikTok Handle</Label>
              <Input
                id="tiktok"
                value={formData.tiktok_handle}
                onChange={(e) => setFormData(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                placeholder="@yourtiktok"
                className="bg-background/50 border-border text-white"
              />
            </div>
            
            {/* Player UID */}
            <div>
              <Label htmlFor="player_uid" className="text-white">Player UID</Label>
              <Input
                id="player_uid"
                value={formData.player_uid}
                onChange={(e) => setFormData(prev => ({ ...prev, player_uid: e.target.value }))}
                placeholder="Your unique player ID"
                className="bg-background/50 border-border text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Gaming Preferences */}
        <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-[#FF1F44]" />
              Gaming Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preferred Mode */}
            <div>
              <Label htmlFor="mode" className="text-white">Preferred Game Mode</Label>
              <Select 
                value={formData.preferred_mode} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_mode: value }))}
              >
                <SelectTrigger className="bg-background/50 border-border text-white">
                  <SelectValue placeholder="Select preferred mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MP">Multiplayer</SelectItem>
                  <SelectItem value="BR">Battle Royale</SelectItem>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Scrims">Scrims</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device */}
            <div>
              <Label htmlFor="deviceType" className="text-foreground">Device Type</Label>
              <Select 
                value={formData.deviceType || ''} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  deviceType: value,
                  device: '' // Reset device when type changes
                }))}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iPhone">iPhone</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                  <SelectItem value="iPad">iPad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.deviceType && (
              <div>
                <Label htmlFor="device" className="text-foreground">
                  {formData.deviceType === 'Android' ? 'Android Brand' : 'Device Model'}
                </Label>
                <Select 
                  value={formData.device} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, device: value }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder={`Select ${formData.deviceType === 'Android' ? 'brand' : 'model'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceData[formData.deviceType as keyof typeof deviceData]?.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-foreground font-semibold">Social Media</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => (
                  <div key={platform}>
                    <Label className="text-foreground capitalize">{platform}</Label>
                    <Input
                      value={formData.social_links[platform] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: {
                          ...prev.social_links,
                          [platform]: e.target.value
                        }
                      }))}
                      className="bg-background/50 border-border/50"
                      placeholder={`Your ${platform} handle`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Banking Info */}
            <div className="space-y-4">
              <h4 className="text-foreground font-semibold">Banking Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Real Name</Label>
                  <Input
                    value={formData.banking_info.real_name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        real_name: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border/50"
                    placeholder="Your real name"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Account Name</Label>
                  <Input
                    value={formData.banking_info.account_name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        account_name: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border/50"
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Account Number</Label>
                  <Input
                    value={formData.banking_info.account_number || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        account_number: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border/50"
                    placeholder="Bank account number"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Bank Name</Label>
                  <Select 
                    value={formData.banking_info.bank_name || ''} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        bank_name: value
                      }
                    }))}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankOptions.map((bank) => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Account Stats (Read-only) */}
            <div className="space-y-3 pt-4 border-t border-border/30">
              <h4 className="text-white font-medium">Account Statistics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background/20 rounded-lg">
                  <div className="text-lg font-bold text-[#FF1F44]">{profile?.kills || 0}</div>
                  <div className="text-xs text-gray-400">Total Kills (Read Only)</div>
                </div>
                <div className="text-center p-3 bg-background/20 rounded-lg">
                  <div className="text-lg font-bold text-green-400">{profile?.attendance || 0}%</div>
                  <div className="text-xs text-gray-400">Attendance</div>
                </div>
                <div className="text-center p-3 bg-background/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">{profile?.grade || 'Rookie'}</div>
                  <div className="text-xs text-gray-400">Grade (Admin Only)</div>
                </div>
                <div className="text-center p-3 bg-background/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">{profile?.tier || '4'}</div>
                  <div className="text-xs text-gray-400">Tier (Admin Only)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#FF1F44]" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white">Member Since</Label>
              <div className="text-gray-300 mt-1">
                {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div>
              <Label className="text-white">Account Role</Label>
              <div className="text-gray-300 mt-1 capitalize">
                {profile?.role === 'clan_master' ? 'Clan Master' : profile?.role || 'Player'}
              </div>
            </div>
            <div>
              <Label className="text-white">Email Address</Label>
              <div className="text-gray-300 mt-1">
                {user?.email || 'Not available'}
              </div>
            </div>
            <div>
              <Label className="text-white">Last Updated</Label>
              <div className="text-gray-300 mt-1">
                {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || isUploading}
          className="bg-[#FF1F44] hover:bg-red-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfileMutation.isPending || isUploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
