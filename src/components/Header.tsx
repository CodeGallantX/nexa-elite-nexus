
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/NotificationBell';
import { FaTiktok } from "react-icons/fa6"

export const Header: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-end px-4 bg-card/50">
      <div className="flex items-center space-x-4">
        
        {/* Tiktok*/}
      <FaTiktok onClick={() => navigate('https://tiktok.com/@nexaesports')} className="text-lg animate-pulse text-gray-200 hover:text-primary/30 cursor-pointer"/>
        
        {/* Notification Bell */}
        <NotificationBell />

        {/* Profile Avatar */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleProfileClick}
          className="flex items-center space-x-2 hover:bg-muted/50"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={profile.avatar_url || '/placeholder.svg'} 
              alt={profile.username} 
            />
            <AvatarFallback>
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{profile.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
          </div>
        </Button>
      </div>
    </header>
  );
};
