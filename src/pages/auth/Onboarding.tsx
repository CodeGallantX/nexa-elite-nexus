import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, ChevronRight, ChevronLeft, Gamepad2, Users, User, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

// Device and brand data
const deviceData = {
  iPhone: [
    "iPhone X",
    "iPhone XR",
    "iPhone XS",
    "iPhone XS Max",
    "iPhone 11",
    "iPhone 11 Pro",
    "iPhone 11 Pro Max",
    "iPhone SE (2nd generation)",
    "iPhone 12 mini",
    "iPhone 12",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",
    "iPhone 13 mini",
    "iPhone 13",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max",
    "iPhone SE (3rd generation)",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max",
    "iPhone 17",
    "iPhone 17 Plus",
    "iPhone 17 Pro",
    "iPhone 17 Pro Max"
  ],
  Android: ['Samsung', 'Xiaomi', 'Infinix', 'Redmi', 'Itel', 'Tecno', 'Nokia', 'OnePlus', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Honor', 'Nothing'],
  iPad: [
    "iPad (5th generation)",
    "iPad (6th generation)",
    "iPad (7th generation)",
    "iPad (8th generation)",
    "iPad (9th generation)",
    "iPad (10th generation)",
    "iPad (11th generation)",
    "iPad mini (5th generation)",
    "iPad mini (6th generation)",
    "iPad mini (7th generation)",
    "iPad Air (3rd generation)",
    "iPad Air (4th generation)",
    "iPad Air (5th generation)",
    "iPad Air (6th generation)",
    "iPad Pro 10.5-inch",
    "iPad Pro 12.9-inch (2nd generation)",
    "iPad Pro 11-inch (1st generation)",
    "iPad Pro 12.9-inch (3rd generation)",
    "iPad Pro 11-inch (2nd generation)",
    "iPad Pro 12.9-inch (4th generation)",
    "iPad Pro 11-inch (3rd generation)",
    "iPad Pro 12.9-inch (5th generation)",
    "iPad Pro 11-inch (4th generation)",
    "iPad Pro 12.9-inch (6th generation)",
    "iPad Pro 11-inch (M4, 5th generation)",
    "iPad Pro 13-inch (M4, 7th generation)"
  ]
};

const classOptions = {
  BR: ['Trickster', 'Defender', 'Ninja', 'Rewind', 'Medic'],
  MP: ['Anchor', 'Support', 'Objective', 'Slayer']
};

const bankOptions = [
  'Opay', 'Palmpay', 'Moniepoint', 'Kuda', 'Access Bank', 'GTBank',
  'First Bank', 'UBA', 'Zenith Bank', 'Fidelity Bank'
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [playerUidError, setPlayerUidError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ign: '',
    player_uid: '',
    deviceType: '',
    androidBrand: '',
    mode: '',
    brClass: '',
    mpClass: '',
    bestGun: '',
    favoriteLoadout: '',
    grade: 'Rookie',
    tier: '4',
    dateJoined: new Date().toISOString().split('T')[0],
    tiktok: '',
    youtube: '',
    discord: '',
    x: '',
    instagram: '',
    realName: '',
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  // Check if user is authenticated and email is confirmed
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    if (!user.email_confirmed_at) {
      toast({
        title: "Email Not Confirmed",
        description: "Please confirm your email before completing onboarding.",
        variant: "destructive",
      });
      navigate('/auth/email-confirmation');
      return;
    }

    // Check if user already completed onboarding
    if (profile?.ign && profile?.player_uid) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate, toast]);
  const validatePlayerUid = (uid: string): boolean => {
    const regex = /^[a-zA-Z0-9]{6,20}$/;
    if (!regex.test(uid)) {
      setPlayerUidError('Player UID must be 6-20 alphanumeric characters (e.g., CDM001234567)');
      return false;
    }
    setPlayerUidError('');
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'deviceType') {
        newData.androidBrand = '';
      }
      if (field === 'mode') {
        newData.brClass = '';
        newData.mpClass = '';
      }
      if (field === 'player_uid') {
        validatePlayerUid(value);
      }
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (currentStep === 1 && !validatePlayerUid(formData.player_uid)) {
        toast({
          title: "Invalid Player UID",
          description: playerUidError,
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error('No authenticated user');

      if (!validatePlayerUid(formData.player_uid)) {
        toast({
          title: "Invalid Player UID",
          description: playerUidError,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const profileUpdates = {
        ign: formData.ign,
        player_uid: formData.player_uid,
        tiktok_handle: formData.tiktok,
        preferred_mode: formData.mode,
        device: formData.deviceType === 'Android' ? formData.androidBrand : formData.deviceType,
        grade: formData.grade,
        tier: formData.tier,
        social_links: {
          tiktok: formData.tiktok,
          youtube: formData.youtube,
          discord: formData.discord,
          x: formData.x,
          instagram: formData.instagram
        },
        banking_info: {
          real_name: formData.realName,
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          bank_name: formData.bankName
        }
      };

      // Update profile directly with Supabase
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) {
        throw error;
      } else {
        toast({
          title: "Welcome to NeXa_Esports!",
          description: "Your profile has been set up successfully.",
        });
        
        // Refresh the profile data
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        navigate(updatedProfile?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.ign &&
               formData.player_uid &&
               validatePlayerUid(formData.player_uid) &&
               formData.deviceType &&
               (formData.deviceType !== 'Android' || formData.androidBrand) &&
               formData.mode &&
               (formData.mode === 'BR' ? formData.brClass :
                formData.mode === 'MP' ? formData.mpClass :
                (formData.brClass && formData.mpClass));
      case 2:
        return formData.tiktok;
      case 3:
        return formData.realName &&
               formData.accountName &&
               formData.accountNumber &&
               formData.bankName;
      default:
        return false;
    }
  };

  const getDeviceOptions = () => {
    if (formData.deviceType === 'iPhone') {
      return deviceData.iPhone;
    } else if (formData.deviceType === 'Android') {
      return deviceData.Android;
    } else if (formData.deviceType === 'iPad') {
      return deviceData.iPad;
    }
    return []; // Always return an array
  };

  const stepIcons = [Gamepad2, Users, User];
  const stepTitles = ['Gaming Setup', 'Social Media', 'Banking Info'];

  // Default fallback render if currentStep is invalid
  if (![1, 2, 3].includes(currentStep)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/50 border-border/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron text-foreground">
              Error
            </CardTitle>
            <p className="text-muted-foreground font-rajdhani">
              Invalid onboarding step. Please try again.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentStep(1)}
              className="bg-primary hover:bg-primary/90 text-white font-rajdhani"
            >
              Restart Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/50 border-border/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-orbitron text-foreground">
            Welcome to NeXa_Esports
          </CardTitle>
          <p className="text-muted-foreground font-rajdhani">
            Let's set up your tactical profile
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center mb-8">
            {[1, 2, 3].map((step) => {
              const StepIcon = stepIcons[step - 1];
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex flex-col items-center ${step <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                      step <= currentStep ? 'border-primary bg-primary/20' : 'border-muted-foreground/30'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-rajdhani">{stepTitles[step - 1]}</span>
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-4 mt-[-20px] ${
                      step < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Gaming Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ign" className="text-foreground font-rajdhani">In-Game Name (IGN) *</Label>
                  <Input
                    id="ign"
                    value={formData.ign}
                    onChange={(e) => handleInputChange('ign', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="SlayerX"
                  />
                </div>
                <div>
                  <Label htmlFor="player_uid" className="text-foreground font-rajdhani flex items-center">
                    Player UID *
                    <span className="ml-2 text-muted-foreground" title="Your unique in-game ID from Call of Duty Mobile (e.g., CDM001234567)">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                  </Label>
                  <Input
                    id="player_uid"
                    value={formData.player_uid}
                    onChange={(e) => handleInputChange('player_uid', e.target.value)}
                    className={`bg-background/50 border-border/50 text-foreground font-rajdhani ${playerUidError ? 'border-destructive' : ''}`}
                    placeholder="CDM001234567"
                  />
                  {playerUidError && (
                    <p className="text-destructive text-sm mt-1 font-rajdhani">{playerUidError}</p>
                  )}
                  <p className="text-muted-foreground text-sm mt-1 font-rajdhani">
                    Enter your unique in-game ID from Call of Duty Mobile.
                  </p>
                </div>
                <div>
                  <Label htmlFor="deviceType" className="text-foreground font-rajdhani">Device Type *</Label>
                  <Select value={formData.deviceType} onValueChange={(value) => handleInputChange('deviceType', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
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
                    <Label htmlFor="androidBrand" className="text-foreground font-rajdhani">
                      {formData.deviceType === 'Android' ? 'Android Brand *' : 'Device Model *'}
                    </Label>
                    <Select value={formData.androidBrand} onValueChange={(value) => handleInputChange('androidBrand', value)}>
                      <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                        <SelectValue placeholder={formData.deviceType === 'Android' ? 'Select Android brand' : 'Select device model'} />
                      </SelectTrigger>
                      <SelectContent>
                        {getDeviceOptions().length > 0 ? (
                          getDeviceOptions().map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No options available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="mode" className="text-foreground font-rajdhani">Preferred Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BR">Battle Royale</SelectItem>
                      <SelectItem value="MP">Multiplayer</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(formData.mode === 'BR' || formData.mode === 'Both') && (
                  <div>
                    <Label htmlFor="brClass" className="text-foreground font-rajdhani">BR Class *</Label>
                    <Select value={formData.brClass} onValueChange={(value) => handleInputChange('brClass', value)}>
                      <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                        <SelectValue placeholder="Select BR class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.BR.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(formData.mode === 'MP' || formData.mode === 'Both') && (
                  <div>
                    <Label htmlFor="mpClass" className="text-foreground font-rajdhani">MP Class *</Label>
                    <Select value={formData.mpClass} onValueChange={(value) => handleInputChange('mpClass', value)}>
                      <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                        <SelectValue placeholder="Select MP class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.MP.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bestGun" className="text-foreground font-rajdhani">Best Gun</Label>
                  <Input
                    id="bestGun"
                    value={formData.bestGun}
                    onChange={(e) => handleInputChange('bestGun', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="AK-47"
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteLoadout" className="text-foreground font-rajdhani">Favorite Loadout</Label>
                  <Input
                    id="favoriteLoadout"
                    value={formData.favoriteLoadout}
                    onChange={(e) => handleInputChange('favoriteLoadout', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="Assault + SMG"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground font-rajdhani">Grade</Label>
                  <p className="text-foreground font-rajdhani mt-1">{formData.grade}</p>
                </div>
                <div>
                  <Label className="text-foreground font-rajdhani">Tier</Label>
                  <p className="text-foreground font-rajdhani mt-1">{formData.tier}</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Social Media Handles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok" className="text-foreground font-rajdhani">TikTok * (Required)</Label>
                  <Input
                    id="tiktok"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="@slayerx_gaming"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube" className="text-foreground font-rajdhani">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="SlayerX Gaming"
                  />
                </div>
                <div>
                  <Label htmlFor="discord" className="text-foreground font-rajdhani">Discord</Label>
                  <Input
                    id="discord"
                    value={formData.discord}
                    onChange={(e) => handleInputChange('discord', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="slayerx#1337"
                  />
                </div>
                <div>
                  <Label htmlFor="x" className="text-foreground font-rajdhani">X (Twitter)</Label>
                  <Input
                    id="x"
                    value={formData.x}
                    onChange={(e) => handleInputChange('x', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="@slayerx_codm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="instagram" className="text-foreground font-rajdhani">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="@slayerx_codm"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="realName" className="text-foreground font-rajdhani">Real Name *</Label>
                  <Input
                    id="realName"
                    value={formData.realName}
                    onChange={(e) => handleInputChange('realName', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="Alex Mitchell"
                  />
                </div>
                <div>
                  <Label htmlFor="accountName" className="text-foreground font-rajdhani">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="Alex Mitchell"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="text-foreground font-rajdhani">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="1234567890"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bankName" className="text-foreground font-rajdhani">Bank Name *</Label>
                  <Select value={formData.bankName} onValueChange={(value) => handleInputChange('bankName', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankOptions.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-rajdhani">
                  💰 Payment information is used for tournament prizes and clan rewards distribution.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-border/50 hover:bg-muted/50 font-rajdhani"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              disabled={loading || !isStepValid()}
              className="bg-primary hover:bg-primary/90 text-white font-rajdhani"
            >
              {loading ? 'Setting up...' : currentStep === 3 ? 'Complete Setup' : 'Next'}
              {currentStep < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};