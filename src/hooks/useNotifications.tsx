
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

  // Mock notifications for now - replace with real Supabase queries
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: async () => {
      // This would be a real Supabase query when notifications table is created
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
          timestamp: new Date().toISOString(),
          status: 'read',
          action: 'view_player'
        }
      ];
      return mockNotifications;
    },
    enabled: !!profile && profile.role === 'admin',
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // This would update the notification in Supabase
      console.log('Marking notification as read:', notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // This would update all notifications in Supabase
      console.log('Marking all notifications as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => n.status === 'unread').length;
    setUnreadCount(unread);
  }, [notifications]);

  // Real-time subscription (mock for now)
  useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    // This would be a real Supabase subscription
    const mockSubscription = {
      unsubscribe: () => console.log('Unsubscribed from notifications')
    };

    return () => {
      mockSubscription.unsubscribe();
    };
  }, [profile]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
