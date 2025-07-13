
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card/30 border-b border-border/20 backdrop-blur-sm px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search players, stats..."
            className="w-full pl-10 pr-4 py-2 bg-card/50 border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 font-rajdhani transition-all duration-300"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-primary/10">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs flex items-center justify-center animate-pulse">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-foreground font-medium font-rajdhani">{user?.username}</p>
            <p className="text-xs text-muted-foreground font-rajdhani">
              Grade: <span className="text-primary font-bold">{user?.profile?.grade}</span>
            </p>
          </div>
          <img
            src={user?.profile?.avatar || '/placeholder.svg'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-primary/30 nexa-glow"
          />
        </div>

        {/* Loadout Indicator */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg nexa-glow">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground font-rajdhani font-medium">Primary</span>
        </div>
      </div>
    </header>
  );
};
