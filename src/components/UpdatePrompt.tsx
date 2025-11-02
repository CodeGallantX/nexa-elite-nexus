import React from 'react';
// import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const UpdatePrompt: React.FC = () => {
  // PWA update prompt disabled temporarily
  // const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  //   onRegistered(r) {
  //     console.log('SW Registered:', r);
  //   },
  //   onRegisterError(error) {
  //     console.log('SW registration error', error);
  //   },
  // });

  // const handleUpdate = () => {
  //   updateServiceWorker(true);
  //   toast.success('App updated! The page will reload.');
  // };

  // if (!needRefresh && !offlineReady) return null;

  return null;

  // return (
  //   <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-lg max-w-sm">
  //     <p className="mb-2">
  //       {offlineReady 
  //         ? 'App ready to work offline' 
  //         : 'New content available, click to update.'}
  //     </p>
  //     {needRefresh && (
  //       <Button onClick={handleUpdate} size="sm">
  //         Update
  //       </Button>
  //     )}
  //   </div>
  // );
};
