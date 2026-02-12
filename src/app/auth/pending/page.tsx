import { auth } from '@/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@/components/ui/button';
import { fetchQuery } from 'convex/nextjs';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../../convex/_generated/api';

export default async function PendingApprovalPage() {
  const session = await auth();
  const user = session?.user?.id 
    ? await fetchQuery(api.users.getByExternalId, { externalId: session.user.id }) 
    : null;

  const isSubscribed = user?.membershipStatus === 'ACTIVE';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl text-center border border-amber-500/20 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
            <div className="mx-auto w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-amber-500/20 animate-pulse">
                {isSubscribed ? <ShieldCheck className="h-12 w-12 text-amber-500" /> : <Clock className="h-12 w-12 text-amber-500" />}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                {isSubscribed ? 'Verification Pending' : 'Account Pending'}
            </h1>
            
            <div className="space-y-4 mb-8">
                 {isSubscribed ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Subscription Active & Paid
                    </div>
                 ) : (
                    <p className="text-muted-foreground text-sm">
                        Complete your subscription to expedite approval.
                    </p>
                 )}

                <p className="text-muted-foreground text-lg leading-relaxed">
                    {isSubscribed 
                        ? "Your account is subscribed and currently waiting for administrator approval. You will be notified once valid."
                        : "Your account has been created and is waiting for administrator approval."}
                </p>
            </div>

            <div className="flex flex-col gap-3">
              {!isSubscribed && (
                  <Button 
                    asChild
                    variant="default" 
                    size="lg" 
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 animate-pulse"
                  >
                    <Link href="/premium">
                      Subscribe for Approval
                    </Link>
                  </Button>
              )}

              <SignOutButton className="w-full rounded-xl border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500 transition-all font-bold gap-2" />
            </div>
        </div>
      </div>
    </div>
  );
}
