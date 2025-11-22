import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Share, PlusSquare, CheckSquare } from 'lucide-react';

const InstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showIosInstallDialog, setShowIosInstallDialog] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = 'standalone' in window.navigator && (window.navigator as any).standalone;

    if (isIos && !isInStandaloneMode) {
      setShowIosInstallDialog(true);
    }
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  const handleCloseIosDialog = () => {
    setShowIosInstallDialog(false);
  };

  if (installPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleInstallClick}>Install NeXa Esports</Button>
      </div>
    );
  }

  if (showIosInstallDialog) {
    return (
      <Dialog open={showIosInstallDialog} onOpenChange={setShowIosInstallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install NeXa Esports</DialogTitle>
            <DialogDescription>Follow these steps to install the app on your iOS device.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Share className="h-8 w-8 text-blue-500" />
              <p>Tap the <strong>Share</strong> button in your browser.</p>
            </div>
            <div className="flex items-center space-x-4">
              <PlusSquare className="h-8 w-8" />
              <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
            </div>
            <div className="flex items-center space-x-4">
              <CheckSquare className="h-8 w-8 text-green-500" />
              <p>Tap <strong>Add</strong> in the top right corner.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default InstallPrompt;
