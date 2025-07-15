
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock, Megaphone } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  read: boolean;
}

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Championship Tournament Starting Soon!',
      preview: 'Get ready for the ultimate battle! Our clan championship...',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'New Training Schedule',
      preview: 'Updated practice times for all squads starting next week...',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Clan Meeting Tonight',
      preview: 'Important updates and strategy discussion at 8 PM...',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const unreadCount = announcements.filter(a => !a.read).length;

  const markAsRead = (id: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, read: true } : ann
      )
    );
  };

  const markAllAsRead = () => {
    setAnnouncements(prev => 
      prev.map(ann => ({ ...ann, read: true }))
    );
  };

  return (
    <header className="h-16 border-b border-border/30 bg-card/30 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        {/* <h2 className="text-xl font-orbitron font-bold text-foreground">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'Player Dashboard'}
        </h2> */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative hover:bg-muted/50"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <Card className="absolute right-0 top-full mt-2 w-80 bg-card border-border/50 shadow-lg z-50">
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron font-medium text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-primary hover:text-red-300 text-xs font-rajdhani"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
              
              <CardContent className="p-0 max-h-80 overflow-y-auto">
                {announcements.length > 0 ? (
                  announcements.map(announcement => (
                    <div
                      key={announcement.id}
                      className={`p-4 border-b border-border/20 last:border-b-0 hover:bg-muted/30 cursor-pointer ${
                        !announcement.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(announcement.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${announcement.read ? 'text-muted-foreground' : 'text-primary'}`}>
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-rajdhani font-medium truncate ${
                              announcement.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {announcement.title}
                            </h4>
                            {!announcement.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 font-rajdhani">
                            {announcement.preview}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground font-rajdhani">
                            <Clock className="w-3 h-3 mr-1" />
                            {announcement.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground font-rajdhani">No notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <ThemeToggle />

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <img
            src={user?.profile?.avatar || '/placeholder.svg'}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-primary/30"
          />
          <div className="text-right">
            <p className="text-sm font-medium text-foreground font-rajdhani">{user?.username}</p>
            <p className="text-xs text-muted-foreground uppercase font-rajdhani">
              {user?.profile?.tier || user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};
