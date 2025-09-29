import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const alertTypes = [
  { key: 'announcements', label: 'Announcements', description: 'New clan announcements' },
  { key: 'events', label: 'Events', description: 'New events or event reminders' },
  { key: 'scrims', label: 'Scrims', description: 'New scrims or scrim reminders' },
  { key: 'messages', label: 'Messages', description: 'New messages from other players' },
  { key: 'profile', label: 'Profile Updates', description: 'Updates to your profile (e.g., rank up)' },
];

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user && isSubscribed) {
      fetchPreferences();
    }
  }, [user, isSubscribed]);

  const fetchPreferences = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPreferences(data);
    } else if (error && error.code === 'PGRST116') { // No rows found
      // Create default preferences
      const defaultPreferences = {
        user_id: user.id,
        announcements: true,
        events: true,
        scrims: true,
        messages: true,
        profile: true,
      };
      const { data: newData } = await supabase
        .from('notification_preferences')
        .insert(defaultPreferences)
        .select()
        .single();
      if (newData) setPreferences(newData);
    }
  };

  const handleToggle = async () => {
    if (!user) return;

    if (isSubscribed) {
      await unsubscribe(user.id);
      setPreferences({});
    } else {
      const success = await subscribe(user.id);
      if (success) {
        fetchPreferences();
      }
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!user) return;

    setPreferences(prev => ({ ...prev, [key]: value }));

    const { error } = await supabase
      .from('notification_preferences')
      .update({ [key]: value })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
      // Revert change on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
    } else {
      toast({
        title: 'Success',
        description: 'Notification preferences updated',
      });
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

        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Notification Types</h4>
            {alertTypes.map(alert => (
              <div key={alert.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{alert.label}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
                <Switch
                  checked={preferences[alert.key] ?? false}
                  onCheckedChange={(value) => handlePreferenceChange(alert.key, value)}
                  disabled={!isSubscribed}
                />
              </div>
            ))}
          </div>
        )}

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
