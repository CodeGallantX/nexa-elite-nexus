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
  RefreshCw
} from 'lucide-react';

// Supabase notification functions (import these from your utils file)
const useSupabaseNotifications = (supabase) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from Supabase
  const fetchNotifications = async (filters = {}) => {
    try {
      setLoading(true);
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.unreadOnly) {
        query = query.eq('read', false);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setNotifications(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

export const AdminNotifications = ({ supabase }) => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useSupabaseNotifications(supabase);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (title, description) => {
    setToast({ title, description });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize component
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('notifications-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications(); // Refresh notifications on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'access_code_request':
        return <Key className="w-5 h-5 text-yellow-400" />;
      case 'new_player_joined':
        return <UserPlus className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (read) => {
    return read
      ? 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  const handleCopyCode = async (notification) => {
    const accessCode = notification.action_data?.accessCode || notification.data?.accessCode;
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      await markAsRead(notification.id);
      showToast("Code Copied", `Access code ${accessCode} copied to clipboard`);
    }
  };

  const handleViewPlayer = async (notification) => {
    const playerName = notification.action_data?.playerName || notification.data?.playerName;
    await markAsRead(notification.id);
    showToast("Player Profile", `Viewing profile for ${playerName}`);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    showToast("Marked as Read", "Notification marked as read");
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      showToast("All Marked as Read", "All notifications have been marked as read");
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const playerName = notification.data?.playerName || '';
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalNotifications = notifications.length;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Notifications</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchNotifications()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm">{toast.description}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Manage clan notifications and requests</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => fetchNotifications()}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleMarkAllAsRead}
            variant="outline"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalNotifications}</div>
            <div className="text-sm text-muted-foreground">Total Notifications</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {notifications.filter(n => n.type === 'access_code_request').length}
            </div>
            <div className="text-sm text-muted-foreground">Access Requests</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {notifications.filter(n => n.type === 'new_player_joined').length}
            </div>
            <div className="text-sm text-muted-foreground">New Joins</div>
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
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'unread', 'read'].map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-card/50 border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Recent Notifications
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
                          <p className="text-foreground">{notification.message}</p>
                          <Badge className={getStatusColor(notification.read)}>
                            {notification.read ? 'read' : 'unread'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.action_data?.action === 'copy_code' && (
                        <Button
                          size="sm"
                          onClick={() => handleCopyCode(notification)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Code
                        </Button>
                      )}
                      
                      {notification.action_data?.action === 'view_player' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPlayer(notification)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Player
                        </Button>
                      )}
                      
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-muted-foreground hover:text-foreground"
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter.' : 'No notifications to display.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};