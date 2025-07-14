
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'username'>('email');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(usernameOrEmail, password);
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-red-900/10"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
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
              Command Login
            </span>
          </h1>
          <p className="text-muted-foreground">Access your tactical dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
            {/* Login Mode Toggle */}
            <div className="flex mb-6">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLoginMode('email')}
                className={`flex-1 ${loginMode === 'email' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Login with Email
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLoginMode('username')}
                className={`flex-1 ${loginMode === 'username' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              >
                <User className="w-4 h-4 mr-2" />
                Login with Username
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="usernameOrEmail" className="text-foreground mb-2 block font-rajdhani">
                  {loginMode === 'email' ? 'Email' : 'Username'}
                </Label>
                <div className="relative">
                  {loginMode === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  ) : (
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  )}
                  <Input
                    id="usernameOrEmail"
                    type={loginMode === 'email' ? 'email' : 'text'}
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder={loginMode === 'email' ? 'warrior@nexa.gg' : 'slayerX'}
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 text-foreground focus:border-primary/50 font-rajdhani"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white py-3 font-rajdhani"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm font-medium mb-2 font-rajdhani">Demo Credentials:</p>
          <div className="text-xs text-yellow-200 space-y-1 font-rajdhani">
            <p><strong>Player:</strong> slayer@nexa.gg / 12345678</p>
            <p><strong>Admin:</strong> admin@nexa.gg / adminmode123</p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-muted-foreground font-rajdhani">
            New recruit?{' '}
            <Link to="/auth/signup" className="text-primary hover:text-red-300 font-medium">
              Join the clan
            </Link>
          </p>
          <Link to="/auth/forgot-password" className="block text-muted-foreground hover:text-foreground text-sm font-rajdhani">
            Forgot your password?
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm font-rajdhani">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
