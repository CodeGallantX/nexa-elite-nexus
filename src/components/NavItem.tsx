
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { useChatNotifications } from '@/hooks/useChatNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  path,
  isActive,
  isCollapsed,
  onClick
}) => {
  const { hasUnreadMessages, hasUnreadAdminMessages } = useChatNotifications();
  const { unreadCount } = useNotifications();
  const { profile } = useAuth();
  
  const isChatItem = path === '/chat';
  const isNotificationsItem = path === '/admin/notifications';

  const handleClick = () => {
    onClick();
    // Mark chat as seen when navigating to chat
    if (isChatItem && (hasUnreadMessages || hasUnreadAdminMessages)) {
      // This will be handled by the chat page component
    }
  };

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={handleClick}
      className={`w-full justify-start text-left relative ${
        isCollapsed ? 'px-2 justify-center' : 'px-3'
      } ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-2'}`} />
      {!isCollapsed && <span>{label}</span>}
      
      {/* Chat notification badge */}
      {isChatItem && (hasUnreadMessages || (hasUnreadAdminMessages && profile?.role === 'admin')) && (
        <div className={`absolute w-2 h-2 bg-destructive rounded-full ${
          isCollapsed ? 'top-1 right-1' : 'top-2 right-2'
        }`} />
      )}
      
      {/* Notifications badge */}
      {isNotificationsItem && unreadCount > 0 && (
        <div className={`absolute bg-destructive text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center ${
          isCollapsed ? 'top-0 right-0 text-[10px]' : 'top-1 right-1'
        }`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Button>
  );
};
