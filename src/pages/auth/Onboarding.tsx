
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

// Device and brand data
const deviceData = {
  iPhone: ['iPhone 13 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 16'],
  Android: {
    brands: ['Samsung', 'Redmi', 'Infinix', 'OnePlus', 'Tecno'],
    series: {
      Samsung: ['Galaxy S23 Ultra', 'Galaxy A73', 'Galaxy Note 20', 'Galaxy S22'],
      Redmi: ['Note 12 Pro', 'Note 11 Pro', '10T Pro', 'K50 Ultra'],
      Infinix: ['Zero 30', 'Note 30', 'Hot 12 Play', 'Smart 7'],
      OnePlus: ['11 Pro', '10T', '9 Pro', 'Nord CE 3'],
      Tecno: ['Phantom X', 'Camon 19', 'Spark 9', 'Pova 4']
    }
  },
  PC: ['MacBook Pro M4', 'Razer Blade 15', 'ASUS ROG Strix', 'MSI Gaming Laptop', 'Dell Alienware']
};

const classOptions = {
  BR: ['Ninja', 'Defender', 'Scout', 'Mechanic', 'Medic'],
  MP: ['Anchor', 'Assault', 'Objective', 'Slayer']
};

const bankOptions = [
  'Opay', 'Palmpay', 'Moniepoint', 'Access Bank', 'GTBank', 
  'First Bank', 'UBA', 'Zenith Bank', 'Fidelity Bank'
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Gaming Info
    ign: '',
    uid: '',
    deviceType: '',
    androidBrand: '',
    deviceSeries: '',
    mode: '',
    brClass: '',
    mpClass: '',
    bestGun: '',
    favoriteLoadout: '',
    dateJoined: new Date().toISOString().split('T')[0],
    // Social Media (TikTok compulsory)
    tiktok: '',
    youtube: '',
    discord: '',
    x: '',
    instagram: '',
    // Personal Info
    realName: '',
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === 'deviceType') {
        newData.androidBrand = '';
        newData.deviceSeries = '';
      }
      if (field === 'androidBrand') {
        newData.deviceSeries = '';
      }
      if (field === 'mode') {
        newData.brClass = '';
        newData.mpClass = '';
      }
      
      return newData;
    });
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
    console.log('Onboarding data:', formData);
    
    toast({
      title: "Welcome to NeXa_Esports!",
      description: "Your profile has been set up successfully.",
    });

    navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.ign && formData.uid && formData.deviceType && 
               formData.deviceSeries && formData.mode && 
               (formData.mode === 'BR' ? formData.brClass : 
                formData.mode === 'MP' ? formData.mpClass : 
                (formData.brClass && formData.mpClass));
      case 2:
        return formData.tiktok; // TikTok is compulsory
      case 3:
        return formData.realName && formData.accountName && 
               formData.accountNumber && formData.bankName;
      default:
        return false;
    }
  };

  const getDeviceSeriesOptions = () => {
    if (formData.deviceType === 'iPhone') {
      return deviceData.iPhone;
    } else if (formData.deviceType === 'Android' && formData.androidBrand) {
      return deviceData.Android.series[formData.androidBrand as keyof typeof deviceData.Android.series] || [];
    } else if (formData.deviceType === 'PC') {
      return deviceData.PC;
    }
    return [];
  };

  const stepIcons = [Gamepad2, Users, User];
  const stepTitles = ['Gaming Setup', 'Social Media', 'Banking Info'];

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

          {/* Step 1: Gaming Setup */}
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
                  <Label htmlFor="deviceType" className="text-foreground font-rajdhani">Device Type *</Label>
                  <Select value={formData.deviceType} onValueChange={(value) => handleInputChange('deviceType', value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iPhone">iPhone</SelectItem>
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.deviceType === 'Android' && (
                  <div>
                    <Label htmlFor="androidBrand" className="text-foreground font-rajdhani">Brand *</Label>
                    <Select value={formData.androidBrand} onValueChange={(value) => handleInputChange('androidBrand', value)}>
                      <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceData.Android.brands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className={formData.deviceType === 'Android' ? 'md:col-start-1' : ''}>
                  <Label htmlFor="deviceSeries" className="text-foreground font-rajdhani">Device Series *</Label>
                  <Select 
                    value={formData.deviceSeries} 
                    onValueChange={(value) => handleInputChange('deviceSeries', value)}
                    disabled={formData.deviceType === 'Android' && !formData.androidBrand}
                  >
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground font-rajdhani">
                      <SelectValue placeholder="Select device series" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDeviceSeriesOptions().map(series => (
                        <SelectItem key={series} value={series}>{series}</SelectItem>
                      ))}
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
            </div>
          )}

          {/* Step 2: Social Media */}
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

          {/* Step 3: Banking Info */}
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

          {/* Navigation Buttons */}
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
