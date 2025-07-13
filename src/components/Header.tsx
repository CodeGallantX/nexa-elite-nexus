
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock announcements for notification bell
const mockAnnouncements = [
  {
    id: '1',
    title: '🏆 Championship Tournament Registration Open!',
    preview: 'The ultimate NeXa_Esports championship tournament is here...',
    timestamp: '2 hours ago',
    isNew: true
  },
  {
    id: '2',
    title: '📅 Weekly Strategy Meeting - Tomorrow 8PM EST',
    preview: 'All elite members are invited to our weekly strategy meeting...',
    timestamp: '1 day ago',
    isNew: true
  },
  {
    id: '3',
    title: '🔥 New Clan War Schedule Released',
    preview: 'Check out our updated clan war schedule...',
    timestamp: '2 days ago',
    isNew: false
  },
  {
    id: '4',
    title: '⚡ Server Maintenance - January 12th',
    preview: 'Our servers will undergo maintenance on January 12th...',
    timestamp: '3 days ago',
    isNew: false
  },
  {
    id: '5',
    title: '🎉 Welcome New Elite Members!',
    preview: 'Please join us in welcoming our newest elite members...',
    timestamp: '5 days ago',
    isNew: false
  }
];

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockAnnouncements);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isNew: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  return (
    <>
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
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-primary/10"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center animate-pulse text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 z-50">
                <Card className="bg-card/95 border-border/20 backdrop-blur-lg shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground font-orbitron text-lg">
                        Notifications
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={markAllAsRead}
                            className="text-xs text-primary hover:bg-primary/10"
                          >
                            Mark all read
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setShowNotifications(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto space-y-3">
                    {notifications.slice(0, 5).map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-primary/5 ${
                          notification.isNew 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'bg-muted/20 border border-muted/30'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {notification.isNew && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-foreground font-medium text-sm mb-1 line-clamp-1">
                              {notification.title}
                            </h4>
                            <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                              {notification.preview}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {notifications.length === 0 && (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">No notifications yet</p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-border/20">
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary hover:bg-primary/10"
                        onClick={() => {
                          setShowNotifications(false);
                          // Navigate to announcements page
                        }}
                      >
                        View All Announcements
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

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

      {/* Overlay for notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};
