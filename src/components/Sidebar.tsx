
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
  BarChart
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const playerNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: MessageCircle, label: 'Chat Room', path: '/chat' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const adminNavItems = [
    { icon: Home, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Manage Players', path: '/admin/players' },
    { icon: Edit, label: 'Edit Profiles', path: '/admin/profiles' },
    { icon: BarChart, label: 'Stats Input', path: '/admin/stats' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: MessageCircle, label: 'Chat Room', path: '/chat' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : playerNavItems;

  return (
    <div className="w-64 bg-black/50 border-r border-[#FF1F44]/20 backdrop-blur-sm">
      {/* Logo */}
      <div className="p-6 border-b border-[#FF1F44]/20">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            {/* <Shield className="w-6 h-6 text-white" /> */}
            <img src="/nexa-logo.jpg" alt="logo" className="object-cover w-full h-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF1F44] to-red-300 bg-clip-text text-transparent">
              NeXa_Esports
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Command Center' : 'Tactical Hub'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#FF1F44]/20 text-[#FF1F44] border border-[#FF1F44]/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
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
      <div className="p-4 border-t border-[#FF1F44]/20">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.profile?.avatar || '/placeholder.svg'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-[#FF1F44]/30"
          />
          <div className="flex-1">
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400 uppercase">
              {user?.profile?.tier || 'Recruit'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
