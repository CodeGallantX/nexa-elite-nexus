
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'player' | 'admin';
  profile?: {
    ign: string;
    uid: string;
    avatar?: string;
    kills: number;
    attendance: number;
    grade: 'S' | 'A' | 'B' | 'C' | 'D';
    tier: string;
    device: string;
    mode: string;
    class: string;
    realName: string;
    bankName: string;
    accountNumber: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    discord?: string;
    dateJoined: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const mockUsers: User[] = [
  {
    id: '1',
    username: 'slayerX',
    email: 'slayer@nexa.gg',
    role: 'player',
    profile: {
      ign: 'slayerX',
      uid: 'CDM001234567',
      kills: 15420,
      attendance: 85,
      grade: 'S',
      tier: 'Elite Slayer',
      device: 'Phone',
      mode: 'Both',
      class: 'Ninja',
      realName: 'Alex Mitchell',
      bankName: 'GameBank',
      accountNumber: '1234567890',
      discord: 'slayerx#1337',
      dateJoined: '2024-01-15'
    }
  },
  {
    id: '2',
    username: 'ghost_alpha',
    email: 'admin@nexa.gg',
    role: 'admin',
    profile: {
      ign: 'GhostAlpha',
      uid: 'CDM987654321',
      kills: 28750,
      attendance: 95,
      grade: 'S',
      tier: 'Clan Commander',
      device: 'iPad',
      mode: 'Both',
      class: 'Defender',
      realName: 'Sarah Chen',
      bankName: 'ProBank',
      accountNumber: '0987654321',
      discord: 'ghostalpha#0001',
      dateJoined: '2023-08-10'
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('nexa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockCredentials = [
      { email: 'slayer@nexa.gg', password: '12345678' },
      { email: 'admin@nexa.gg', password: 'adminmode123' }
    ];

    const isValid = mockCredentials.some(cred => 
      cred.email === email && cred.password === password
    );

    if (isValid) {
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('nexa_user', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexa_user');
  };

  const signup = async (userData: any): Promise<boolean> => {
    // Mock signup - in real app would hit API
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: 'player',
      profile: {
        ...userData,
        kills: 0,
        attendance: 0,
        grade: 'D' as const,
        tier: 'Rookie',
        dateJoined: new Date().toISOString().split('T')[0]
      }
    };
    
    setUser(newUser);
    localStorage.setItem('nexa_user', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
