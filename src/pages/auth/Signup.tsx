
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, User, Key } from 'lucide-react';
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
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (formData.accessCode !== 'NEXA24') {
      toast({
        title: "Invalid Access Code",
        description: "Use NEXA24 for demo access",
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF1F44]/20 via-transparent to-red-900/10"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FF1F44]/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#FF1F44] to-red-300 bg-clip-text text-transparent">
              Join NeXa_Esports
            </span>
          </h1>
          <p className="text-gray-400">Begin your tactical journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white mb-2 block">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="tactical_warrior"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="warrior@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-white mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="Secure password"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white mb-2 block">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accessCode" className="text-white mb-2 block">Access Code</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="6-digit clan code"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF1F44] to-red-600 hover:from-red-600 hover:to-[#FF1F44] text-white py-3"
              >
                {loading ? 'Creating Account...' : 'Join the Elite'}
              </Button>
            </div>
          </div>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm font-medium mb-1">Demo Access Code:</p>
          <p className="text-blue-200 text-xs">Use <strong>NEXA24</strong> to create account</p>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400">
            Already a member?{' '}
            <Link to="/auth/login" className="text-[#FF1F44] hover:text-red-300 font-medium">
              Sign in
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-white text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
