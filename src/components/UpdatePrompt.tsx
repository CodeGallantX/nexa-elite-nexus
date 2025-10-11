import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const UpdatePrompt: React.FC = () => {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  React.useEffect(() => {
    if (needRefresh[0]) {
      toast('New version available!', {
        action: {
          label: 'Update',
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity, // Keep the toast visible until the user interacts with it
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null; // This component only shows a toast
};
