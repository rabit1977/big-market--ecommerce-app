'use client';

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Panel } from './page';

export function ErrorState({ message }: { message: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => router.push(href));
  };

  return (
    <Panel>
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-black text-foreground mb-2">Payment Failed</h2>
      <p className="text-muted-foreground font-medium text-sm mb-8 max-w-xs mx-auto">{message}</p>
      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl font-bold border-border hover:bg-muted"
          disabled={isPending}
          onClick={() => navigate('/contact')}
        >
          Support
        </Button>
        <Button
          className="flex-1 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
          disabled={isPending}
          onClick={() => navigate('/premium')}
        >
          Try Again
        </Button>
      </div>
    </Panel>
  );
}