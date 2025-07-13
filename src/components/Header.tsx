
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-black/30 border-b border-[#FF1F44]/20 backdrop-blur-sm px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search players, stats..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF1F44]/50"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF1F44] rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400">
              Grade: <span className="text-[#FF1F44] font-bold">{user?.profile?.grade}</span>
            </p>
          </div>
          <img
            src={user?.profile?.avatar || '/placeholder.svg'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-[#FF1F44]/30"
          />
        </div>

        {/* Loadout Indicator */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-[#FF1F44]/10 border border-[#FF1F44]/30 rounded-lg">
          <Target className="w-4 h-4 text-[#FF1F44]" />
          <span className="text-sm text-white">Primary</span>
        </div>
      </div>
    </header>
  );
};
