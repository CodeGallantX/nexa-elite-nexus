
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  MessageCircle, 
  Megaphone, 
  Settings, 
  LogOut,
  Shield,
  Users,
  Edit,
  BarChart,
  Target,
  Swords,
  Calendar,
  Bell,
  Trophy,
  UserCheck
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const playerNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Target, label: 'Loadouts', path: '/loadouts' },
    { icon: Swords, label: 'Scrims', path: '/scrims' },
    { icon: MessageCircle, label: 'Chat Room', path: '/chat' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const adminNavItems = [
    { icon: Home, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Manage Players', path: '/admin/players' },
    { icon: Edit, label: 'Edit Profiles', path: '/admin/profiles' },
    { icon: BarChart, label: 'Stats Input', path: '/admin/stats' },
    { icon: Target, label: 'Loadouts', path: '/admin/loadouts' },
    { icon: Trophy, label: 'Scrims', path: '/admin/scrims' },
    { icon: UserCheck, label: 'Attendance', path: '/admin/attendance' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: MessageCircle, label: 'Chat Room', path: '/chat' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : playerNavItems;

  return (
    <div className={`bg-sidebar-background border-r border-sidebar-border backdrop-blur-sm ${
      isMobile ? 'w-64 fixed left-0 top-0 h-full z-40' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            <img src="/nexa-logo.jpg" alt="logo" className="object-cover w-full h-full rounded-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-sidebar-primary to-red-300 bg-clip-text text-transparent font-orbitron">
              NeXa_Esports
            </h1>
            <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wider font-rajdhani">
              {user?.role === 'admin' ? 'Command Center' : 'Tactical Hub'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group font-rajdhani ${
                    isActive
                      ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.profile?.avatar || '/placeholder.svg'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-sidebar-primary/30"
          />
          <div className="flex-1">
            <p className="text-sidebar-foreground font-medium font-rajdhani">{user?.username}</p>
            <p className="text-xs text-sidebar-foreground/60 uppercase font-rajdhani">
              {user?.profile?.tier || 'Recruit'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-red-500/10 rounded-lg transition-colors duration-200 font-rajdhani"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
