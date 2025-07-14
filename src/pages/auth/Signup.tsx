
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, User, Key, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accessCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const generateAccessCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleRequestCode = () => {
    const code = generateAccessCode();
    setGeneratedCode(code);
    setCodeRequested(true);
    setCountdown(60);
    
    // Mock sending code to admin email
    console.log(`Access code ${code} sent to admin@nexa.gg`);
    
    toast({
      title: "Access Code Requested",
      description: `Code ${code} sent to admin. Check console for demo.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check access code
    const validCodes = ['NEXA24', generatedCode];
    if (!validCodes.includes(formData.accessCode)) {
      toast({
        title: "Invalid Access Code",
        description: "Use NEXA24 or request a new code",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const success = await signup(formData);
      if (success) {
        toast({
          title: "Welcome to NeXa_Esports!",
          description: "Account created successfully. Complete your onboarding.",
        });
        navigate('/auth/onboarding');
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-red-900/10"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 font-orbitron">
            <span className="bg-gradient-to-r from-primary to-red-300 bg-clip-text text-transparent">
              Join NeXa_Esports
            </span>
          </h1>
          <p className="text-muted-foreground font-rajdhani">Begin your tactical journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-foreground mb-2 block font-rajdhani">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="tactical_warrior"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block font-rajdhani">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="warrior@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground mb-2 block font-rajdhani">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="Secure password"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground mb-2 block font-rajdhani">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {/* Access Code Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="accessCode" className="text-foreground font-rajdhani">Access Code</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRequestCode}
                    disabled={countdown > 0}
                    className="text-primary hover:text-red-300 font-rajdhani"
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        {countdown}s
                      </>
                    ) : (
                      'Request Access Code'
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="6-digit clan code"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white py-3 font-rajdhani"
              >
                {loading ? 'Creating Account...' : 'Join the Elite'}
              </Button>
            </div>
          </div>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm font-medium mb-1 font-rajdhani">Demo Access Code:</p>
          <p className="text-blue-200 text-xs font-rajdhani">Use <strong>NEXA24</strong> or request a new code</p>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-muted-foreground font-rajdhani">
            Already a member?{' '}
            <Link to="/auth/login" className="text-primary hover:text-red-300 font-medium">
              Sign in
            </Link>
          </p>
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm font-rajdhani">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
