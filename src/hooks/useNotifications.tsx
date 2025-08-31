import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Notification {
  id: string;
  type: string;
  message: string;
  title?: string;
  playerName?: string;
  accessCode?: string;
  timestamp: string;
  status: "unread" | "read" | "responded";
  action?: string;
  data?: any;
}

export const useNotifications = () => {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch announcements as notifications for all users (everyone gets these)
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching announcements:", error);
        return [];
      }

      return data.map((announcement) => ({
        id: `announcement-${announcement.id}`,
        type: "announcement",
        message: announcement.content || announcement.title,
        title: announcement.title,
        timestamp: announcement.created_at,
        status: "unread" as const,
        action: "view_announcement",
      }));
    },
    enabled: !!user,
  });

  // Fetch event notifications for all users (everyone gets event notifications)
  const { data: eventNotifications = [] } = useQuery({
    queryKey: ["event-notifications"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .in("type", [
          "event_created",
          "event_updated",
          "event_reminder",
          "scrim_scheduled",
        ])
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching event notifications:", error);
        return [];
      }

      return data.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        playerName: (notification.data as any)?.playerName || "Unknown",
        accessCode: (notification.data as any)?.accessCode || "",
        timestamp: notification.created_at,
        status: notification.read ? ("read" as const) : ("unread" as const),
        action: (notification.action_data as any)?.action || notification.type,
        data: notification.data,
      }));
    },
    enabled: !!user?.id,
  });

  // Fetch admin-only notifications (only admins get these)
  const { data: adminNotifications = [] } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      if (!user?.id || profile?.role !== "admin") return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .in("type", [
          "access_code_request",
          "new_player_joined",
          "player_left",
          "admin_alert",
          "assignment_request",
        ])
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching admin notifications:", error);
        return [];
      }

      return data.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        playerName: (notification.data as any)?.playerName || "Unknown",
        accessCode: (notification.data as any)?.accessCode || "",
        timestamp: notification.created_at,
        status: notification.read ? ("read" as const) : ("unread" as const),
        action: (notification.action_data as any)?.action || notification.type,
        data: notification.data,
      }));
    },
    enabled: !!user?.id && profile?.role === "admin",
  });

  // Fetch user-specific notifications (notifications targeted to this specific user)
  const { data: userSpecificNotifications = [] } = useQuery({
    queryKey: ["user-specific-notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching user-specific notifications:", error);
        return [];
      }

      return data.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        playerName: (notification.data as any)?.playerName || "Unknown",
        accessCode: (notification.data as any)?.accessCode || "",
        timestamp: notification.created_at,
        status: notification.read ? ("read" as const) : ("unread" as const),
        action: (notification.action_data as any)?.action || notification.type,
        data: notification.data,
      }));
    },
    enabled: !!user?.id,
  });

  // Combine all notifications based on user role and sort by timestamp
  const notifications = [
    ...announcements,
    ...eventNotifications,
    ...(profile?.role === "admin" ? adminNotifications : []),
    ...userSpecificNotifications,
  ]
    .filter(
      (notification, index, self) =>
        // Remove duplicates based on ID
        index === self.findIndex((n) => n.id === notification.id)
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  console.log("useNotifications - All notifications:", notifications);
  console.log("useNotifications - User role:", profile?.role);
  console.log("useNotifications - Announcements:", announcements);
  console.log("useNotifications - Event notifications:", eventNotifications);
  console.log("useNotifications - Admin notifications:", adminNotifications);
  console.log(
    "useNotifications - User-specific notifications:",
    userSpecificNotifications
  );

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // Skip if it's an announcement (they start with 'announcement-')
      if (notificationId.startsWith("announcement-")) {
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["user-specific-notifications"],
      });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      // Mark all non-announcement notifications as read
      const notificationIds = notifications
        .filter((n) => !n.id.startsWith("announcement-"))
        .map((n) => n.id);

      if (notificationIds.length > 0) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", notificationIds);

        if (error) {
          console.error("Error marking all notifications as read:", error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["user-specific-notifications"],
      });
    },
  });

  // Send notification
  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: {
      user_id: string;
      title: string;
      message: string;
      type: string;
      data?: any;
    }) => {
      const { error } = await supabase
        .from("notifications")
        .insert([notificationData]);

      if (error) {
        console.error("Error sending notification:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate admin notifications as assignment requests go to admins
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter((n) => n.status === "unread").length;
    setUnreadCount(unread);
  }, [notifications]);

  // Real-time subscription for announcements
  useEffect(() => {
    if (!user) return;

    const announcementsChannel = supabase
      .channel("announcements-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "announcements",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["announcements-notifications"],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "announcements",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["announcements-notifications"],
          });
        }
      )
      .subscribe();

    // Real-time subscription for all notifications
    const notificationsChannel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log("New notification received:", payload);
          queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
          queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["user-specific-notifications"],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
          queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["user-specific-notifications"],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user, queryClient]);

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    sendNotification: sendNotificationMutation.mutate,
    isLoading: false,
  };
};
