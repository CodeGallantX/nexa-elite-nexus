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

// Mock data for demonstration
const mockNotifications = [
  {
    id: 1,
    message: "New player 'DragonSlayer' has requested access to the clan",
    type: 'access_code_request',
    read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    data: { playerName: 'DragonSlayer' },
    action_data: { action: 'copy_code', accessCode: 'ABC123' }
  },
  {
    id: 2,
    message: "Player 'ShadowHunter' has joined the clan",
    type: 'new_player_joined',
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    data: { playerName: 'ShadowHunter' },
    action_data: { action: 'view_player' }
  },
  {
    id: 3,
    message: "Access code request approved for 'FireMage'",
    type: 'access_code_request',
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: { playerName: 'FireMage' },
    action_data: { action: 'copy_code', accessCode: 'XYZ789' }
  },
  {
    id: 4,
    message: "New clan member 'IceWarrior' has been welcomed",
    type: 'new_player_joined',
    read: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    data: { playerName: 'IceWarrior' },
    action_data: { action: 'view_player' }
  }
];

// Supabase notification functions with proper error handling
const useSupabaseNotifications = (supabase) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from Supabase (or use mock data)
  const fetchNotifications = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // If supabase is not available, use mock data
      if (!supabase) {
        console.warn('Supabase client not available, using mock data');
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }

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
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
      // Fallback to mock data on error
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // If supabase is available, update the database
      if (supabase) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId);
          
        if (error) throw error;
      }
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Still update local state for demo purposes
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // If supabase is available, update the database
      if (supabase) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('read', false);
          
        if (error) throw error;
      }
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      // Still update local state for demo purposes
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
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

  // Set up real-time subscription (only if supabase is available)
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
  }, [supabase, fetchNotifications]);

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

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in-right">
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm">{toast.description}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-300">Manage clan notifications and requests</p>
          {!supabase && (
            <p className="text-yellow-400 text-sm mt-2">⚠️ Demo mode - Supabase not connected</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => fetchNotifications()}
            variant="outline"
            disabled={loading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{totalNotifications}</div>
            <div className="text-sm text-gray-400">Total Notifications</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{unreadCount}</div>
            <div className="text-sm text-gray-400">Unread</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {notifications.filter(n => n.type === 'access_code_request').length}
            </div>
            <div className="text-sm text-gray-400">Access Requests</div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {notifications.filter(n => n.type === 'new_player_joined').length}
            </div>
            <div className="text-sm text-gray-400">New Joins</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'unread', 'read'].map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={`capitalize ${
                    filter === status 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-400" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01] ${
                    !notification.read 
                      ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                      : 'bg-gray-800/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white">{notification.message}</p>
                          <Badge className={getStatusColor(notification.read)}>
                            {notification.read ? 'read' : 'unread'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
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
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
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
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Notifications Found</h3>
                <p className="text-gray-400">
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