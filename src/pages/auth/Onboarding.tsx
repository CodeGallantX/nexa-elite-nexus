
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, ChevronRight, ChevronLeft, Gamepad2, Users, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Game Info
    ign: '',
    uid: '',
    device: '',
    mode: '',
    class: '',
    bestGun: '',
    favoriteLoadout: '',
    dateJoined: new Date().toISOString().split('T')[0],
    // Social Media
    tiktok: '',
    instagram: '',
    youtube: '',
    discord: '',
    // Personal Info
    realName: '',
    bankName: '',
    accountNumber: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
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

  const handleComplete = () => {
    // In real app, would save to user profile via API
    console.log('Onboarding data:', formData);
    
    toast({
      title: "Welcome to NeXa_Esports!",
      description: "Your profile has been set up successfully.",
    });

    // Redirect to appropriate dashboard
    navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.ign && formData.uid && formData.device && formData.mode;
      case 2:
        return true; // Social media is optional
      case 3:
        return formData.realName && formData.bankName && formData.accountNumber;
      default:
        return false;
    }
  };

  const stepIcons = [Gamepad2, Users, User];
  const stepTitles = ['Game Details', 'Social Media', 'Personal Info'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/30 border-primary/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-orbitron text-foreground">
            Welcome to NeXa_Esports
          </CardTitle>
          <p className="text-muted-foreground">
            Let's set up your tactical profile
          </p>
        </CardHeader>

        <CardContent>
          {/* Progress Steps */}
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

          {/* Step 1: Game Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Game Information</h3>
              
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
                  <Label htmlFor="uid" className="text-foreground font-rajdhani">Player UID *</Label>
                  <Input
                    id="uid"
                    value={formData.uid}
                    onChange={(e) => handleInputChange('uid', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="CDM001234567"
                  />
                </div>

                <div>
                  <Label htmlFor="device" className="text-foreground font-rajdhani">Gaming Device *</Label>
                  <Select value={formData.device} onValueChange={(value) => handleInputChange('device', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="ipad">iPad</SelectItem>
                      <SelectItem value="pc">PC/Emulator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mode" className="text-foreground font-rajdhani">Preferred Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="br">Battle Royale</SelectItem>
                      <SelectItem value="mp">Multiplayer</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class" className="text-foreground font-rajdhani">Class</Label>
                  <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninja">Ninja</SelectItem>
                      <SelectItem value="defender">Defender</SelectItem>
                      <SelectItem value="mechanic">Mechanic</SelectItem>
                      <SelectItem value="medic">Medic</SelectItem>
                      <SelectItem value="scout">Scout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <div>
                <Label htmlFor="favoriteLoadout" className="text-foreground font-rajdhani">Favorite Loadout</Label>
                <Input
                  id="favoriteLoadout"
                  value={formData.favoriteLoadout}
                  onChange={(e) => handleInputChange('favoriteLoadout', e.target.value)}
                  className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                  placeholder="Assault Rifle + SMG Secondary"
                />
              </div>
            </div>
          )}

          {/* Step 2: Social Media */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Social Media (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok" className="text-foreground font-rajdhani">TikTok Handle</Label>
                  <Input
                    id="tiktok"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="@slayerx_gaming"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-foreground font-rajdhani">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="@slayerx_codm"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube" className="text-foreground font-rajdhani">YouTube Channel</Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="SlayerX Gaming"
                  />
                </div>

                <div>
                  <Label htmlFor="discord" className="text-foreground font-rajdhani">Discord Username</Label>
                  <Input
                    id="discord"
                    value={formData.discord}
                    onChange={(e) => handleInputChange('discord', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="slayerx#1337"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-orbitron text-foreground mb-4">Personal Information</h3>
              
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
                  <Label htmlFor="bankName" className="text-foreground font-rajdhani">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="bg-background/50 border-border/50 text-foreground font-rajdhani"
                    placeholder="GameBank"
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
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💰 Payment information is used for tournament prizes and clan rewards distribution.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-primary/30 hover:bg-primary/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-primary hover:bg-primary/90 text-white font-rajdhani"
            >
              {currentStep === 3 ? 'Complete Setup' : 'Next'}
              {currentStep < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
