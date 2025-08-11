
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  type: string;
  message: string;
  title?: string;
  player_name?: string;
  access_code?: string;
  timestamp: string;
  status: 'unread' | 'read' | 'responded';
  action?: string;
  data?: any;
}

export const useNotifications = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch announcements as notifications for all users
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements-notifications'],
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

      return data.map(announcement => ({
        id: announcement.id,
        type: 'announcement',
        message: announcement.title,
        title: announcement.title,
        timestamp: announcement.created_at,
        status: 'unread' as const,
        action: 'view_announcement'
      }));
    },
    enabled: !!profile,
  });

  // Fetch real admin notifications from database
  const { data: adminNotifications = [] } = useQuery({
    queryKey: ['admin-notifications', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching admin notifications:', error);
        return [];
      }

      return data.map(notification => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        timestamp: notification.created_at,
        status: notification.read ? 'read' : 'unread',
        action: (notification.action_data as any)?.action || 'view',
        data: notification.data
      }));
    },
    enabled: !!profile,
  });

  // Combine all notifications
  const notifications = [
    ...announcements,
    ...(profile?.role === 'admin' ? adminNotifications : [])
  ];

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', profile?.id);
      
      if (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false)
        .eq('user_id', profile?.id);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => n.status === 'unread').length;
    setUnreadCount(unread);
  }, [notifications]);

  // Real-time subscription for announcements
  useEffect(() => {
    if (!profile) return;

    const announcementsChannel = supabase
      .channel('announcements-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['announcements-notifications'] });
        }
      )
      .subscribe();

    // Real-time subscription for notifications
    const notificationsChannel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['announcements-notifications'] });
          queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [profile, queryClient]);

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
