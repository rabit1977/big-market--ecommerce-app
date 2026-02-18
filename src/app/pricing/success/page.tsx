import { verifyStripePayment } from '@/actions/stripe-actions';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorState } from './error-state';
import { SuccessState } from './success-state';

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

type VerifyResult =
  | { success: true; type: 'PROMOTION'; tier: string; plan?: undefined }
  | { success: true; plan: string; type?: undefined; tier?: undefined }
  | { success: false; error?: string };

export default function PricingSuccessPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-3xl border-2 border-border bg-card shadow-2xl overflow-hidden animate-scale-in">
        <Suspense fallback={<LoadingState />}>
          <VerifyContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function VerifyContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return <ErrorState message="Invalid session. Please contact support." />;
  }

  let result: VerifyResult;
  try {
    result = await verifyStripePayment(sessionId);
  } catch (err) {
    console.error(err);
    result = { success: false, error: 'An unexpected error occurred.' };
  }

  if (result.success) {
    if (result.type === 'PROMOTION') {
       return <SuccessState tier={result.tier} />;
    }
    return <SuccessState plan={result.plan} />;
  }

  return <ErrorState message={result.error ?? 'Payment verification failed.'} />;
}

function LoadingState() {
  return (
    <Panel>
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
      <h2 className="text-2xl font-black text-foreground mb-2">Processing Payment</h2>
      <p className="text-muted-foreground font-medium text-sm">Verifying payment details...</p>
    </Panel>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-10 pb-10 px-6 sm:px-8 text-center flex flex-col items-center">
      {children}
    </div>
  );
}