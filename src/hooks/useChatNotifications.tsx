
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatNotification {
  hasUnread: boolean;
  hasUnreadMessages: boolean; // Added for compatibility
  unreadCount: number;
  lastMessageTime?: string;
}

export const useChatNotifications = (): ChatNotification & { markChatAsSeen: () => void } => {
  const { user } = useAuth();
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<string | null>(null);

  // Get the last seen timestamp from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`chat-last-seen-${user.id}`);
      setLastSeenTimestamp(stored);
    }
  }, [user]);

  // Fetch recent chat messages to check for unread
  const { data: chatMessages = [] } = useQuery({
    queryKey: ['chat-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, created_at, user_id, channel')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching chat messages for notifications:', error);
        return [];
      }

      return data;
    },
    enabled: !!user,
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        // Don't notify for own messages
        if (payload.new.user_id !== user.id) {
          // Force refetch of chat messages
          // This will trigger the query to update
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Calculate unread messages
  const unreadMessages = chatMessages.filter(message => {
    if (!lastSeenTimestamp) return true; // If no last seen, all are unread
    if (message.user_id === user?.id) return false; // Don't count own messages
    return new Date(message.created_at) > new Date(lastSeenTimestamp);
  });

  const hasUnread = unreadMessages.length > 0;
  const unreadCount = unreadMessages.length;
  const lastMessageTime = chatMessages.length > 0 ? chatMessages[0].created_at : undefined;

  const markChatAsSeen = () => {
    if (!user) return;
    const timestamp = new Date().toISOString();
    localStorage.setItem(`chat-last-seen-${user.id}`, timestamp);
    setLastSeenTimestamp(timestamp);
    
    // Trigger a custom event to update other components
    window.dispatchEvent(new CustomEvent('chat-seen-updated', { 
      detail: { userId: user.id, timestamp } 
    }));
  };

  return {
    hasUnread,
    hasUnreadMessages: hasUnread, // Added for compatibility
    unreadCount,
    lastMessageTime,
    markChatAsSeen
  };
};

// Function to mark chat as seen (standalone version)
export const markChatAsSeen = (userId: string) => {
  const timestamp = new Date().toISOString();
  localStorage.setItem(`chat-last-seen-${userId}`, timestamp);
  
  // Trigger a custom event to update other components
  window.dispatchEvent(new CustomEvent('chat-seen-updated', { 
    detail: { userId, timestamp } 
  }));
};
