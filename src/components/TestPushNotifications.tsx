import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { sendPushNotification, sendBroadcastPushNotification } from '@/lib/pushNotifications';
import { toast } from 'sonner';

export const TestPushNotifications = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test push notification from Nexa Esports!');
  const [isSending, setIsSending] = useState(false);

  const handleSendTestNotification = async () => {
    if (!user) return;

    setIsSending(true);
    try {
      const success = await sendPushNotification([user.id], {
        title,
        message,
        data: {
          type: 'test',
          url: '/dashboard',
          timestamp: Date.now()
        }
      });

      if (success) {
        toast.success('Test notification sent successfully!');
      } else {
        toast.error('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Error sending test notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendBroadcastNotification = async () => {
    setIsSending(true);
    try {
      const success = await sendBroadcastPushNotification({
        title,
        message,
        data: {
          type: 'broadcast_test',
          url: '/announcements',
          timestamp: Date.now()
        }
      });

      if (success) {
        toast.success('Broadcast notification sent successfully!');
      } else {
        toast.error('Failed to send broadcast notification');
      }
    } catch (error) {
      console.error('Error sending broadcast notification:', error);
      toast.error('Error sending broadcast notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Push Notifications</CardTitle>
        <CardDescription>
          Send test notifications to verify the push notification system is working
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Notification Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Notification Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSendTestNotification}
            disabled={isSending || !title || !message}
            variant="outline"
          >
            {isSending ? 'Sending...' : 'Send to Me'}
          </Button>
          
          <Button 
            onClick={handleSendBroadcastNotification}
            disabled={isSending || !title || !message}
            variant="default"
          >
            {isSending ? 'Sending...' : 'Broadcast to All'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Note: Users must have enabled push notifications in their settings to receive notifications.
        </p>
      </CardContent>
    </Card>
  );
};