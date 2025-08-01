
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useChatNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnreadAdminMessages, setHasUnreadAdminMessages] = useState(false);
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<string | null>(null);
  const [lastSeenAdminTimestamp, setLastSeenAdminTimestamp] = useState<string | null>(null);

  // Get the latest general message timestamp
  const { data: latestMessage } = useQuery({
    queryKey: ['latest-chat-message'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('created_at, user_id')
        .eq('channel', 'general')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest message:', error);
        return null;
      }

      return data;
    },
    enabled: !!user,
  });

  // Get the latest admin message timestamp
  const { data: latestAdminMessage } = useQuery({
    queryKey: ['latest-admin-chat-message'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('created_at, user_id')
        .eq('channel', 'admin')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest admin message:', error);
        return null;
      }

      return data;
    },
    enabled: !!user,
  });

  // Get user's last seen timestamps from localStorage
  useEffect(() => {
    const getLastSeen = () => {
      const stored = localStorage.getItem(`chat_last_seen_${user?.id}`);
      return stored;
    };

    const getLastSeenAdmin = () => {
      const stored = localStorage.getItem(`admin_chat_last_seen_${user?.id}`);
      return stored;
    };

    if (user) {
      const lastSeen = getLastSeen();
      const lastSeenAdmin = getLastSeenAdmin();
      setLastSeenTimestamp(lastSeen);
      setLastSeenAdminTimestamp(lastSeenAdmin);
      
      // If no last seen timestamp, set it to now to avoid showing old messages as unread
      if (!lastSeen) {
        const now = new Date().toISOString();
        localStorage.setItem(`chat_last_seen_${user.id}`, now);
        setLastSeenTimestamp(now);
      }

      if (!lastSeenAdmin) {
        const now = new Date().toISOString();
        localStorage.setItem(`admin_chat_last_seen_${user.id}`, now);
        setLastSeenAdminTimestamp(now);
      }
    }
  }, [user]);

  // Check if there are unread general messages
  useEffect(() => {
    if (!latestMessage || !lastSeenTimestamp || !user) {
      setHasUnreadMessages(false);
      return;
    }

    // Don't show notification for own messages
    if (latestMessage.user_id === user.id) {
      setHasUnreadMessages(false);
      return;
    }

    const latestMessageTime = new Date(latestMessage.created_at).getTime();
    const lastSeenTime = new Date(lastSeenTimestamp).getTime();

    setHasUnreadMessages(latestMessageTime > lastSeenTime);
  }, [latestMessage, lastSeenTimestamp, user]);

  // Check if there are unread admin messages
  useEffect(() => {
    if (!latestAdminMessage || !lastSeenAdminTimestamp || !user) {
      setHasUnreadAdminMessages(false);
      return;
    }

    // Don't show notification for own messages
    if (latestAdminMessage.user_id === user.id) {
      setHasUnreadAdminMessages(false);
      return;
    }

    const latestMessageTime = new Date(latestAdminMessage.created_at).getTime();
    const lastSeenTime = new Date(lastSeenAdminTimestamp).getTime();

    setHasUnreadAdminMessages(latestMessageTime > lastSeenTime);
  }, [latestAdminMessage, lastSeenAdminTimestamp, user]);

  // Mark general chat as seen
  const markChatAsSeen = () => {
    if (user) {
      const now = new Date().toISOString();
      localStorage.setItem(`chat_last_seen_${user.id}`, now);
      setLastSeenTimestamp(now);
      setHasUnreadMessages(false);
    }
  };

  // Mark admin chat as seen
  const markAdminChatAsSeen = () => {
    if (user) {
      const now = new Date().toISOString();
      localStorage.setItem(`admin_chat_last_seen_${user.id}`, now);
      setLastSeenAdminTimestamp(now);
      setHasUnreadAdminMessages(false);
    }
  };

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel=eq.general'
      }, (payload) => {
        // Only show notification if it's not from current user
        if (payload.new.user_id !== user.id) {
          queryClient.invalidateQueries({ queryKey: ['latest-chat-message'] });
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: 'channel=eq.admin'
      }, (payload) => {
        // Only show notification if it's not from current user
        if (payload.new.user_id !== user.id) {
          queryClient.invalidateQueries({ queryKey: ['latest-admin-chat-message'] });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    hasUnreadMessages,
    hasUnreadAdminMessages,
    markChatAsSeen,
    markAdminChatAsSeen,
  };
};
