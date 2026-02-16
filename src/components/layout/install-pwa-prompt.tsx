'use client';

import { Button } from '@/components/ui/button';
import { Download, PlusSquare, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

// Add type definition for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPwaPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect device
    const parser = new UAParser();
    const result = parser.getResult();
    const os = result.os.name?.toLowerCase() || '';
    const isApple = os === 'ios' || os === 'mac os';
    setIsIOS(isApple);

    // Listen for install prompt (mostly Android/Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show if not already dismissed recently (could add local storage check here)
      const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, check if we should show instructions (simple logic: not standalone)
    if (isApple && !isStandaloneMode) {
       const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
       // Only show on mobile sized screens for iOS generally
       if (!hasDismissed && window.innerWidth < 1024) {
         setShowPrompt(true);
       }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-background border border-border shadow-lg rounded-xl p-4 flex flex-col gap-3 relative dark:bg-zinc-900/95 backdrop-blur-md">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
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
