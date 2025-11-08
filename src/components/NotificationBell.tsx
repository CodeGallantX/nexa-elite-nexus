import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  // Debug logging
  console.log("NotificationBell - notifications:", notifications);
  console.log("NotificationBell - unreadCount:", unreadCount);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setIsOpen(false);
  };

  return (
    <>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto bg-background border-border z-50"
      >
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">
              Notifications{" "}
              {notifications.length > 0 && `(${notifications.length})`}
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-3 cursor-pointer hover:bg-muted/50 flex-col items-start"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3 w-full">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.status === "unread" ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  {notification.title ? (
                    <>
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </p>
                      {notification.message !== notification.title && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 text-center text-sm text-primary">
              View all notifications ({notifications.length} total)
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedNotification?.title}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground">{selectedNotification?.message}</p>
          
          {selectedNotification?.type === 'giveaway_created' && selectedNotification?.data?.codes && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Giveaway Codes:</h4>
              {selectedNotification.data.codes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {selectedNotification.data.codes.map((code: string, index: number) => (
                    <div key={index} className="bg-muted p-2 rounded-md flex items-center justify-center">
                      <code className="font-mono text-sm">{code}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No codes found for this giveaway.</p>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Received: {selectedNotification ? new Date(selectedNotification.timestamp).toLocaleString() : ''}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
