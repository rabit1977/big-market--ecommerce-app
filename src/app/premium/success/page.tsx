
import { verifyStripePayment } from '@/actions/stripe-actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense, use } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PageProps = {
  // Next.js 15: searchParams is a Promise
  searchParams: Promise<{ session_id?: string }>;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
// No 'use client' on the page shell — it's a Server Component that renders
// a Suspense boundary. Only SuccessContent is client-side.

export default function PremiumSuccessPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}

// ─── Inner Component ──────────────────────────────────────────────────────────
// React 19: use() suspends the component while the Promise resolves.
// No useEffect, no useState for loading/error/success — the Suspense boundary
// above handles the loading state, and the result drives the UI directly.

async function SuccessContent({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;

  // No sessionId → immediate error state, no network call needed
  if (!sessionId) {
    return <ResultCard status="error" message="Invalid session ID" />;
  }

  // Verify payment — this is an async Server Component call.
  // If verifyStripePayment throws, the nearest error.tsx boundary catches it.
  let result: { success: boolean; error?: string };
  try {
    result = await verifyStripePayment(sessionId);
  } catch {
    result = { success: false, error: 'An unexpected error occurred' };
  }

  if (result.success) {
    return <ResultCard status="success" />;
  }

  return <ResultCard status="error" message={result.error ?? 'Payment verification failed'} />;
}

// ─── Presentational Component (memoization not needed — Server Component) ─────

function ResultCard({
  status,
  message,
}: {
  status: 'success' | 'error';
  message?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-3xl shadow-xl">
        {status === 'success' ? (
          <>
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg">
              Your subscription has been activated and your registration is now complete. Your account
              is currently pending administrator verification.
            </p>
            <div className="pt-6">
              <Button asChild size="lg" className="w-full rounded-xl font-bold bg-amber-500 hover:bg-amber-600">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-red-500">Payment Failed</h1>
            <p className="text-muted-foreground text-lg">{message}</p>
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