
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back, warrior!",
          description: "Successfully logged into NeXa_Esports",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials. Try: slayer@nexa.gg / 12345678 or admin@nexa.gg / adminmode123",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
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
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#FF1F44]/10 rounded-full blur-3xl animate-pulse"></div>
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
              Command Login
            </span>
          </h1>
          <p className="text-gray-400">Access your tactical dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="warrior@nexa.gg"
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white focus:border-[#FF1F44]/50"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF1F44] to-red-600 hover:from-red-600 hover:to-[#FF1F44] text-white py-3"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm font-medium mb-2">Demo Credentials:</p>
          <div className="text-xs text-yellow-200 space-y-1">
            <p><strong>Player:</strong> slayer@nexa.gg / 12345678</p>
            <p><strong>Admin:</strong> admin@nexa.gg / adminmode123</p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400">
            New recruit?{' '}
            <Link to="/auth/signup" className="text-[#FF1F44] hover:text-red-300 font-medium">
              Join the clan
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
