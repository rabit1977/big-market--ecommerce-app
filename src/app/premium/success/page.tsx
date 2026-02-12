'use client';

import { verifyStripePayment } from '@/actions/stripe-actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid session ID');
      return;
    }

    async function verify() {
      try {
        const result = await verifyStripePayment(sessionId!);
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(result.error || 'Payment verification failed');
        }
      } catch (e) {
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    }

    verify();
  }, [sessionId]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-3xl shadow-xl">
        {status === 'loading' && (
          <>
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Processing...</h1>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
             <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg">
                Your subscription has been activated and your registration is now complete. 
                Your account is currently pending administrator verification.
            </p>
            <div className="pt-6">
                <Button asChild size="lg" className="w-full rounded-xl font-bold bg-amber-500 hover:bg-amber-600">
                    <Link href="/auth/pending">Finish Signup & Wait for Approval</Link>
                </Button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
             <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6">
                <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-red-500">Payment Failed</h1>
            <p className="text-muted-foreground text-lg">
                {message}
            </p>
            <div className="pt-6 flex gap-3">
                <Button asChild variant="outline" size="lg" className="flex-1 rounded-xl font-bold">
                    <Link href="/premium">Try Again</Link>
                </Button>
                <Button asChild size="lg" className="flex-1 rounded-xl font-bold">
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PremiumSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    )
}
