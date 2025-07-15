
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  type: string;
  message: string;
  player_name?: string;
  access_code?: string;
  timestamp: string;
  status: 'unread' | 'read' | 'responded';
  action?: string;
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
        timestamp: announcement.created_at,
        status: 'unread' as const,
        action: 'view_announcement'
      }));
    },
    enabled: !!profile,
  });

  // Mock admin notifications (replace with real Supabase queries when table is created)
  const { data: adminNotifications = [] } = useQuery({
    queryKey: ['admin-notifications', profile?.id],
    queryFn: async () => {
      if (profile?.role !== 'admin') return [];
      
      // Mock notifications for admin - replace with real Supabase query
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'access_code_request',
          message: 'Player newPlayer123 is requesting access code ABC123',
          player_name: 'newPlayer123',
          access_code: 'ABC123',
          timestamp: new Date().toISOString(),
          status: 'unread',
          action: 'copy_code'
        },
        {
          id: '2',
          type: 'new_player_joined',
          message: 'New player TacticalSniper joined the clan',
          player_name: 'TacticalSniper',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'read',
          action: 'view_player'
        }
      ];
      return mockNotifications;
    },
    enabled: !!profile && profile.role === 'admin',
  });

  // Combine all notifications
  const notifications = [
    ...announcements,
    ...(profile?.role === 'admin' ? adminNotifications : [])
  ];

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // For announcements, we could track read status in a separate table
      // For now, just log the action
      console.log('Marking notification as read:', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      console.log('Marking all notifications as read');
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

    const channel = supabase
      .channel('announcements')
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, queryClient]);

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
