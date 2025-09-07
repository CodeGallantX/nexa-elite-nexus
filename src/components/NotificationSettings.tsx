import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  const handleToggle = async () => {
    if (!user) return;
    
    if (isSubscribed) {
      await unsubscribe(user.id);
    } else {
      await subscribe(user.id);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive notifications even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Push Notifications</p>
            <p className="text-sm text-muted-foreground">
              Get notified about events, announcements, and messages
            </p>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
        
        {!isSubscribed && (
          <Button 
            onClick={handleToggle} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Setting up...' : 'Enable Notifications'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};