'use client';

import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Download, PlusSquare, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'pwa-prompt-dismissed';

export function InstallPwaPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isInstallable, install } = usePWAInstall();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Already dismissed — never show
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isApple);

    if (isApple) {
      // Only show iOS instructions on mobile viewports
      if (window.innerWidth < 1024) setShowPrompt(true);
      return;
    }

    // Android / Desktop Chrome — hook handleBeforeInstallPrompt will set isInstallable
    if (isInstallable) {
      setShowPrompt(true);
    }
  }, [isInstallable]);

  const handleInstallClick = async () => {
    await install();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-background border border-border shadow-lg rounded-xl p-4 flex flex-col gap-3 relative dark:bg-zinc-900/95 backdrop-blur-md">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <span className="font-bold text-lg text-primary">BM</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Install Biggest Market</h3>
            <p className="text-xs text-muted-foreground">
              Add to your home screen for a better experience.
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Share className="h-4 w-4" />
              <span>Tap the <strong>Share</strong> button</span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="h-4 w-4" />
              <span>Select <strong>Add to Home Screen</strong></span>
            </div>
          </div>
        ) : (
          <Button size="sm" className="w-full gap-2" onClick={handleInstallClick}>
            <Download className="h-4 w-4" />
            Install App
          </Button>
        )}
      </div>
    </div>
  );
}