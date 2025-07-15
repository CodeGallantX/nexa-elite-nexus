import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Megaphone,
  BarChart3,
  Target,
  Bell,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useChatNotifications } from '@/hooks/useChatNotifications';

export const Sidebar: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const { hasUnread } = useChatNotifications();

  const getNavItems = () => {
    if (profile?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Players', href: '/admin/players', icon: Users },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Attendance', href: '/admin/attendance', icon: UserCheck },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Statistics', href: '/admin/stats', icon: BarChart3 },
        { name: 'Loadouts', href: '/admin/loadouts', icon: Target },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { 
          name: 'Chat', 
          href: '/chat', 
          icon: MessageSquare,
          badge: hasUnread
        },
      ];
    }

    return [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Loadouts', href: '/loadouts', icon: Target },
      { name: 'Scrims', href: '/scrims', icon: Calendar },
      { name: 'Announcements', href: '/announcements', icon: Megaphone },
      { 
        name: 'Chat', 
        href: '/chat', 
        icon: MessageSquare,
        badge: hasUnread
      },
      { name: 'Settings', href: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full flex-col bg-card/50 border-r border-border/30 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-center bg-background/50 border-b border-border/30">
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-white">
          <img src="/logo.svg" alt="NeXa Esports Logo" className="h-8 w-8" />
          <span>NeXa Esports</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium font-rajdhani transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                  onClick={() => {
                    if (item.href === '/chat' && profile?.id) {
                      import('@/hooks/useChatNotifications').then(({ markChatAsSeen }) => {
                        markChatAsSeen(profile.id);
                      });
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Logged in as <span className="font-medium text-primary">{profile?.username}</span>
        </p>
      </div>
    </div>
  );
};
