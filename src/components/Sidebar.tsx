
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Crosshair,
  Package,
  Codesandbox,
  Settings,
  Shield,
  Users,
  BarChart3,
  UserCog,
  Calendar,
  UserPlus,
  Clock,
  Megaphone,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sword,
  Swords,
} from 'lucide-react';
import { NavItem } from '@/components/NavItem';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

export const Sidebar: React.FC = () => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse sidebar by default on mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const isAdmin = profile?.role === 'admin' || 'clan_master';
  const isPlayer = profile?.role === 'player';

  const playerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Crosshair, label: 'Scrims', path: '/scrims' },
    { icon: Package, label: 'My Loadouts', path: '/loadouts' },
    { icon: Sword, label: 'Weapon Layouts', path: '/weapon-layouts' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminMenuItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
    { icon: Users, label: 'Players', path: '/admin/players' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: BarChart3, label: 'Statistics', path: '/admin/stats' },
    { icon: UserCog, label: 'Profiles', path: '/admin/profiles' },
    { icon: Package, label: 'My Loadouts', path: '/loadouts' },
    { icon: Codesandbox, label: 'Loadouts', path: '/admin/loadouts' },
    { icon: Sword, label: 'My Weapon Layouts', path: '/weapon-layouts' },
    { icon: Swords, label: 'Weapon Layouts', path: '/admin/weapon-layouts' },
    { icon: Crosshair, label: 'Scrims', path: '/admin/scrims' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: UserPlus, label: 'Assignments', path: '/admin/event-assignment' },
    { icon: Clock, label: 'Attendance', path: '/admin/attendance' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
  isCollapsed ? 'w-16' : 'min-w-64'
} h-screen sticky top-0 overflow-y-auto flex flex-col`}>

      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img
                src={profile?.avatar_url || '/placeholder.svg'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-foreground">Ɲ・乂{profile?.ign}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {/* Player Menu - Only show for players */}
          {isPlayer && (
            <>
              {!isCollapsed && (
                <div className="pb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Player Menu
                  </h3>
                </div>
              )}
              {playerMenuItems.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={location.pathname === item.path}
                  isCollapsed={isCollapsed}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </>
          )}

          {/* Admin Menu - Only show for admins */}
          {isAdmin && (
            <>
              {!isCollapsed && (
                <div className="pb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admin Menu
                  </h3>
                </div>
              )}
              {adminMenuItems.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={location.pathname === item.path}
                  isCollapsed={isCollapsed}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-muted-foreground hover:text-foreground ${
            isCollapsed ? 'px-0 justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};
