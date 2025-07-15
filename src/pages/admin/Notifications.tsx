
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Copy, 
  Eye, 
  Search,
  UserPlus,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  id: string;
  type: 'access_code_request' | 'new_player_joined' | 'announcement' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

// Since we don't have a notifications table yet, I'll create a mock implementation
// that shows recent announcements and chat messages as "notifications"
export const AdminNotifications: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Fetch recent announcements as notifications
  const { data: announcements = [] } = useQuery({
    queryKey: ['admin-notification-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching announcements:', error);
        return [];
      }
      return data;
    }
  });

  // Fetch recent chat messages as notifications
  const { data: chatMessages = [] } = useQuery({
    queryKey: ['admin-notification-chat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching chat messages:', error);
        return [];
      }
      return data;
    }
  });

  // Fetch new player registrations
  const { data: newPlayers = [] } = useQuery({
    queryKey: ['admin-notification-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, ign, created_at')
        .eq('role', 'player')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching new players:', error);
        return [];
      }
      return data;
    }
  });

  // Convert data to notification format
  const notifications: NotificationData[] = [
    // Announcement notifications
    ...announcements.map(announcement => ({
      id: `announcement-${announcement.id}`,
      type: 'announcement' as const,
      title: 'New Announcement Published',
      message: `"${announcement.title}" has been published`,
      data: announcement,
      read: readNotifications.has(`announcement-${announcement.id}`),
      created_at: announcement.created_at
    })),
    
    // New player notifications
    ...newPlayers.map(player => ({
      id: `player-${player.id}`,
      type: 'new_player_joined' as const,
      title: 'New Player Joined',
      message: `${player.username} (${player.ign}) joined the clan`,
      data: player,
      read: readNotifications.has(`player-${player.id}`),
      created_at: player.created_at
    })),
    
    // Recent chat activity
    ...chatMessages.slice(0, 5).map(message => ({
      id: `chat-${message.id}`,
      type: 'system' as const,
      title: 'New Chat Activity',
      message: `New message in ${message.channel} channel`,
      data: message,
      read: readNotifications.has(`chat-${message.id}`),
      created_at: message.created_at
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'access_code_request':
        return <Key className="w-5 h-5 text-yellow-400" />;
      case 'new_player_joined':
        return <UserPlus className="w-5 h-5 text-green-400" />;
      case 'announcement':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'system':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (read: boolean) => {
    return read 
      ? 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  const markAsRead = (notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read",
    });
  };

  const handleViewDetails = (notification: NotificationData) => {
    markAsRead(notification.id);
    
    if (notification.type === 'new_player_joined') {
      toast({
        title: "Player Details",
        description: `Viewing profile for ${notification.data.username}`,
      });
    } else if (notification.type === 'announcement') {
      toast({
        title: "Announcement",
        description: notification.data.title,
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read) ||
                         filter === notification.type;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalNotifications = notifications.length;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Set up real-time subscriptions for new data
  useEffect(() => {
    const announcementChannel = supabase
      .channel('admin-notifications-announcements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'announcements'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-notification-announcements'] });
      })
      .subscribe();

    const chatChannel = supabase
      .channel('admin-notifications-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-notification-chat'] });
      })
      .subscribe();

    const playersChannel = supabase
      .channel('admin-notifications-players')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profiles'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-notification-players'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(announcementChannel);
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-orbitron mb-2">Notifications</h1>
          <p className="text-muted-foreground font-rajdhani">Monitor clan activity and important events</p>
        </div>
        <Button 
          onClick={markAllAsRead}
          variant="outline"
          className="font-rajdhani"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1 font-orbitron">{totalNotifications}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Total Notifications</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1 font-orbitron">{unreadCount}</div>
            <div className="text-sm text-muted-foreground font-rajdhani">Unread</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-orbitron">
              {notifications.filter(n => n.type === 'new_player_joined').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">New Players</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1 font-orbitron">
              {notifications.filter(n => n.type === 'announcement').length}
            </div>
            <div className="text-sm text-muted-foreground font-rajdhani">Announcements</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 font-rajdhani"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'unread', 'read', 'new_player_joined', 'announcement'].map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="font-rajdhani capitalize"
                >
                  {status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground font-orbitron flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    !notification.read 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-background/30 border-border/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground font-rajdhani">
                            {notification.title}
                          </h4>
                          <Badge className={getStatusColor(notification.read)}>
                            {notification.read ? 'read' : 'unread'}
                          </Badge>
                        </div>
                        <p className="text-foreground font-rajdhani mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="font-rajdhani">{formatTimeAgo(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(notification)}
                        className="font-rajdhani"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-muted-foreground hover:text-foreground font-rajdhani"
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground font-orbitron mb-2">No Notifications Found</h3>
                <p className="text-muted-foreground font-rajdhani">
                  {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter.' : 'No activity to display.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
