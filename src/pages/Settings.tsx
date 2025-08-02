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
  CreditCard,
  Wallet,
  BadgeDollarSign,
  Gamepad2,
  Target,
  Shield,
  Zap,
  Eye,
  Heart,
  Clock,
  Award,
  TrendingUp,
  Star
} from 'lucide-react';

// Device and brand data
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

const socialPlatforms = [
  { key: 'tiktok', label: 'TikTok', placeholder: '@username' },
  { key: 'youtube', label: 'YouTube', placeholder: 'Channel URL or @handle' },
  { key: 'discord', label: 'Discord', placeholder: 'username#1234' },
  { key: 'x', label: 'X (Twitter)', placeholder: '@username' },
  { key: 'instagram', label: 'Instagram', placeholder: '@username' }
];

const bankOptions = [
  'Opay', 'Palmpay', 'Moniepoint', 'Kuda', 'Access Bank', 'GTBank', 
  'First Bank', 'UBA', 'Zenith Bank', 'Fidelity Bank', 'Wema Bank',
  'Union Bank', 'Sterling Bank', 'Stanbic IBTC', 'FCMB'
];

const brClasses = [
  { value: 'medic', label: 'Medic', icon: Heart },
  { value: 'scout', label: 'Scout', icon: Eye },
  { value: 'clown', label: 'Clown', icon: Zap },
  { value: 'trickster', label: 'Trickster', icon: Target },
  { value: 'poltergeist', label: 'Poltergeist', icon: Shield },
  { value: 'defender', label: 'Defender', icon: Shield }
];

const mpClasses = [
  { value: 'vanguard', label: 'Vanguard', icon: Shield },
  { value: 'assault', label: 'Assault', icon: Target },
  { value: 'support', label: 'Support', icon: Heart },
  { value: 'sniper', label: 'Sniper', icon: Eye }
];

export const Settings: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    ign: '',
    player_uid: '',
    tiktok_handle: '',
    preferred_mode: '',
    device: '',
    deviceType: '',
    br_class: '',
    mp_class: '',
    best_gun: '',
    favorite_loadout: '',
    social_links: {} as Record<string, string>,
    banking_info: {} as Record<string, string>,
    avatar_file: null as File | null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        ign: profile.ign || '',
        player_uid: profile.player_uid || '',
        tiktok_handle: profile.tiktok_handle || '',
        preferred_mode: profile.preferred_mode || '',
        device: profile.device || '',
        deviceType: profile.device ? (
          deviceData.iPhone.includes(profile.device) ? 'iPhone' : 
          deviceData.iPad.includes(profile.device) ? 'iPad' : 'Android'
        ) : '',
        br_class: profile.br_class || '',
        mp_class: profile.mp_class || '',
        best_gun: profile.best_gun || '',
        favorite_loadout: profile.favorite_loadout || '',
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
        player_uid: formData.player_uid,
        tiktok_handle: formData.tiktok_handle || null,
        preferred_mode: formData.preferred_mode || null,
        device: formData.device || null,
        br_class: formData.br_class || null,
        mp_class: formData.mp_class || null,
        best_gun: formData.best_gun || null,
        favorite_loadout: formData.favorite_loadout || null,
        social_links: Object.keys(formData.social_links).length > 0 ? formData.social_links : null,
        banking_info: Object.keys(formData.banking_info).length > 0 ? formData.banking_info : null,
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'social', label: 'Social', icon: TrendingUp },
    { id: 'banking', label: 'Banking', icon: CreditCard },
    { id: 'account', label: 'Account', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-[#FF1F44]/20 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-[#FF1F44]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-card/30 p-1 rounded-lg backdrop-blur-sm border border-border/30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#FF1F44] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-card/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-[#FF1F44]" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24 border-4 border-[#FF1F44]/30">
                  <AvatarImage 
                    src={formData.avatar_file ? URL.createObjectURL(formData.avatar_file) : profile?.avatar_url} 
                    alt={profile?.username} 
                  />
                  <AvatarFallback className="bg-[#FF1F44]/20 text-[#FF1F44] text-2xl">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar" className="text-white text-sm font-medium">Profile Picture</Label>
                  <p className="text-gray-400 text-xs mb-2">JPG, PNG or GIF. Max size 5MB.</p>
                  <div className="flex items-center space-x-2">
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
                      className="border-border text-white hover:bg-[#FF1F44]/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New
                    </Button>
                    {formData.avatar_file && (
                      <span className="text-xs text-green-400">New image selected</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username - Read Only */}
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={profile?.username || ''}
                    disabled
                    className="bg-background/30 border-border text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact admin to change username</p>
                </div>

                {/* IGN */}
                <div>
                  <Label htmlFor="ign" className="text-white">In-Game Name (IGN) *</Label>
                  <Input
                    id="ign"
                    value={formData.ign}
                    onChange={(e) => setFormData(prev => ({ ...prev, ign: e.target.value }))}
                    placeholder="Your in-game name"
                    className="bg-background/50 border-border text-white"
                  />
                </div>

                {/* Player UID */}
                <div>
                  <Label htmlFor="player_uid" className="text-white">Player UID</Label>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-gray-400" />
                    <Input
                      id="player_uid"
                      value={formData.player_uid}
                      onChange={(e) => setFormData(prev => ({ ...prev, player_uid: e.target.value }))}
                      placeholder="Your CODM UID"
                      className="bg-background/50 border-border text-white"
                    />
                  </div>
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gaming Tab */}
        {activeTab === 'gaming' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-[#FF1F44]" />
                  Gaming Setup
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
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="Tournament">Tournament</SelectItem>
                      <SelectItem value="Scrims">Scrims</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Device Type */}
                <div>
                  <Label htmlFor="deviceType" className="text-white">Device Type</Label>
                  <Select 
                    value={formData.deviceType || ''} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      deviceType: value,
                      device: ''
                    }))}
                  >
                    <SelectTrigger className="bg-background/50 border-border text-white">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iPhone">iPhone</SelectItem>
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="iPad">iPad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Device Model/Brand */}
                {formData.deviceType && (
                  <div>
                    <Label htmlFor="device" className="text-white">
                      {formData.deviceType === 'Android' ? 'Android Brand' : 'Device Model'}
                    </Label>
                    <Select 
                      value={formData.device} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, device: value }))}
                    >
                      <SelectTrigger className="bg-background/50 border-border text-white">
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

                {/* Best Gun */}
                <div>
                  <Label htmlFor="best_gun" className="text-white">Best Gun</Label>
                  <Input
                    id="best_gun"
                    value={formData.best_gun}
                    onChange={(e) => setFormData(prev => ({ ...prev, best_gun: e.target.value }))}
                    placeholder="e.g., AK-47, M13, DLQ33"
                    className="bg-background/50 border-border text-white"
                  />
                </div>

                {/* Favorite Loadout */}
                <div>
                  <Label htmlFor="favorite_loadout" className="text-white">Favorite Loadout</Label>
                  <Input
                    id="favorite_loadout"
                    value={formData.favorite_loadout}
                    onChange={(e) => setFormData(prev => ({ ...prev, favorite_loadout: e.target.value }))}
                    placeholder="Describe your favorite loadout"
                    className="bg-background/50 border-border text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#FF1F44]" />
                  Game Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* BR Class */}
                {(formData.preferred_mode === 'BR' || formData.preferred_mode === 'Both') && (
                  <div>
                    <Label htmlFor="br_class" className="text-white">Battle Royale Class</Label>
                    <Select
                      value={formData.br_class || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, br_class: value }))}
                    >
                      <SelectTrigger className="bg-background/50 border-border text-white">
                        <SelectValue placeholder="Select BR Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {brClasses.map((cls) => {
                          const Icon = cls.icon;
                          return (
                            <SelectItem key={cls.value} value={cls.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{cls.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* MP Class */}
                {(formData.preferred_mode === 'MP' || formData.preferred_mode === 'Both') && (
                  <div>
                    <Label htmlFor="mp_class" className="text-white">Multiplayer Class</Label>
                    <Select
                      value={formData.mp_class || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, mp_class: value }))}
                    >
                      <SelectTrigger className="bg-background/50 border-border text-white">
                        <SelectValue placeholder="Select MP Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {mpClasses.map((cls) => {
                          const Icon = cls.icon;
                          return (
                            <SelectItem key={cls.value} value={cls.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{cls.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Account Stats */}
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h4 className="text-white font-medium flex items-center">
                    <Award className="w-4 h-4 mr-2 text-[#FF1F44]" />
                    Performance Stats
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-background/20 rounded-lg border border-[#FF1F44]/20">
                      <div className="text-lg font-bold text-[#FF1F44]">{profile?.kills || 0}</div>
                      <div className="text-xs text-gray-400">Total Kills</div>
                    </div>
                    <div className="text-center p-3 bg-background/20 rounded-lg border border-green-400/20">
                      <div className="text-lg font-bold text-green-400">{profile?.attendance || 0}%</div>
                      <div className="text-xs text-gray-400">Attendance</div>
                    </div>
                    <div className="text-center p-3 bg-background/20 rounded-lg border border-yellow-400/20">
                      <div className="text-lg font-bold text-yellow-400">{profile?.grade || 'Rookie'}</div>
                      <div className="text-xs text-gray-400">Grade</div>
                    </div>
                    <div className="text-center p-3 bg-background/20 rounded-lg border border-blue-400/20">
                      <div className="text-lg font-bold text-blue-400">{profile?.tier || '4'}</div>
                      <div className="text-xs text-gray-400">Tier</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[#FF1F44]" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialPlatforms.map((platform) => (
                  <div key={platform.key} className="space-y-2">
                    <Label className="text-white capitalize font-medium">{platform.label}</Label>
                    <Input
                      value={formData.social_links[platform.key] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social_links: {
                          ...prev.social_links,
                          [platform.key]: e.target.value
                        }
                      }))}
                      className="bg-background/50 border-border text-white"
                      placeholder={platform.placeholder}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Banking Tab */}
        {activeTab === 'banking' && (
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#FF1F44]" />
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-400" />
                    Real Name
                  </Label>
                  <Input
                    value={formData.banking_info.real_name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        real_name: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border text-white"
                    placeholder="Your full legal name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-blue-400" />
                    Account Name
                  </Label>
                  <Input
                    value={formData.banking_info.account_name || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        account_name: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border text-white"
                    placeholder="Account holder name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                    Account Number
                  </Label>
                  <Input
                    value={formData.banking_info.account_number || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      banking_info: {
                        ...prev.banking_info,
                        account_number: e.target.value
                      }
                    }))}
                    className="bg-background/50 border-border text-white"
                    placeholder="Bank account number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <BadgeDollarSign className="w-4 h-4 mr-2 text-lime-500" />
                    Bank Name
                  </Label>
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
                    <SelectTrigger className="bg-background/50 border-border text-white">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankOptions.map((bank) => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <BadgeDollarSign className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-500 font-medium">Banking Information Notice</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      This information is used for prize payments and tournament winnings. 
                      All data is encrypted and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <Card className="bg-card/50 border-border/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2 text-[#FF1F44]" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    Member Since
                  </Label>
                  <div className="text-gray-300 p-3 bg-background/20 rounded-lg">
                    {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Account Role
                  </Label>
                  <div className="text-gray-300 p-3 bg-background/20 rounded-lg capitalize">
                    {profile?.role === 'clan_master' ? 'Clan Master' : 
                     profile?.role === 'admin' ? 'Administrator' :
                     profile?.role === 'moderator' ? 'Moderator' :
                     profile?.role || 'Player'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-400" />
                    Email Address
                  </Label>
                  <div className="text-gray-300 p-3 bg-background/20 rounded-lg">
                    {user?.email || 'Not available'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    Last Updated
                  </Label>
                  <div className="text-gray-300 p-3 bg-background/20 rounded-lg">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Never'}
                  </div>
                </div>
              </div>

              {/* Account Statistics Overview */}
              <div className="mt-8 space-y-4">
                <h4 className="text-white font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#FF1F44]" />
                  Account Overview
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-[#FF1F44]/20 to-red-600/10 rounded-lg border border-[#FF1F44]/30">
                    <div className="text-2xl font-bold text-[#FF1F44] mb-1">{profile?.kills || 0}</div>
                    <div className="text-xs text-gray-400">Total Kills</div>
                    <div className="text-xs text-gray-500 mt-1">Tournament Record</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-lg border border-green-400/30">
                    <div className="text-2xl font-bold text-green-400 mb-1">{profile?.attendance || 0}%</div>
                    <div className="text-xs text-gray-400">Attendance</div>
                    <div className="text-xs text-gray-500 mt-1">Event Participation</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-lg border border-yellow-400/30">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{profile?.grade || 'Rookie'}</div>
                    <div className="text-xs text-gray-400">Current Grade</div>
                    <div className="text-xs text-gray-500 mt-1">Performance Rating</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-lg border border-blue-400/30">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{profile?.tier || '4'}</div>
                    <div className="text-xs text-gray-400">Tier Level</div>
                    <div className="text-xs text-gray-500 mt-1">Skill Ranking</div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-blue-500 font-medium">Account Security</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Your account is protected with advanced security measures. 
                      If you notice any suspicious activity, please contact our support team immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || isUploading}
          className="bg-[#FF1F44] hover:bg-red-600 text-white shadow-2xl hover:shadow-[#FF1F44]/25 transition-all duration-300 transform hover:scale-105 px-6 py-3 text-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {updateProfileMutation.isPending || isUploading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {/* Mobile Save Button */}
      <div className="block md:hidden sticky bottom-0 bg-card/80 backdrop-blur-sm border-t border-border/30 p-4 -mx-4">
        <Button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || isUploading}
          className="w-full bg-[#FF1F44] hover:bg-red-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfileMutation.isPending || isUploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};