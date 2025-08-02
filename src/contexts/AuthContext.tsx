import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  ign: string;
  player_uid: string;
  role: 'admin' | 'player' | 'moderator' | 'clan_master';
  avatar_url?: string;
  tiktok_handle?: string;
  preferred_mode?: string;
  device?: string;
  kills: number;
  attendance: number;
  tier: string;
  grade: string;
  date_joined: string;
  updated_at?: string;
  social_links?: Record<string, string> | null;
  banking_info?: Record<string, string> | null;
  br_class?: string;
  mp_class?: string;
  best_gun?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  ign?: string;
  role?: 'admin' | 'player' | 'moderator' | 'clan_master';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }
      
  setProfile({
    ...data,
    player_uid: (data as any).player_uid || '',
    social_links: data.social_links as Record<string, string> | null,
    banking_info: data.banking_info as Record<string, string> | null,
  });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Login successful for:', data.user?.email);
      return true;
    } catch (error: any) {
      console.error('Login exception:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (signupData: SignupData): Promise<boolean> => {
    try {
      console.log('Attempting signup for:', signupData.email);
      const redirectUrl = `${window.location.origin}/auth/email-confirmation`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: signupData.username,
            ign: signupData.ign || signupData.username,
            role: signupData.role || 'player'
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Signup successful for:', data.user?.email);
      
      if (data.user && !data.session) {
        toast({
          title: "Check Your Email",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Signup exception:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Attempting logout');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout exception:', error);
      toast({
        title: "Logout Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      console.log('Attempting password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Reset password error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      return true;
    } catch (error: any) {
      console.error('Reset password exception:', error);
      toast({
        title: "Password Reset Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!user) {
        console.error('No user logged in');
        return false;
      }

      console.log('Updating profile for:', user.email, updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates as any)
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      await fetchProfile(user.id);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Update profile exception:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
