import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl text-center border border-amber-500/20 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
            <div className="mx-auto w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-amber-500/20 animate-pulse">
                <Clock className="h-12 w-12 text-amber-500" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                Account Pending
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Your account has been created and is currently waiting for administrator approval. 
                <br />
                <span className="text-sm mt-2 block opacity-80">
                    You will be notified once your account is activated.
                </span>
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                asChild
                variant="default" 
                size="lg" 
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2"
              >
                <a href="/pricing">
                  Subscribe for Approval
                </a>
              </Button>

              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/auth' });
                }}
              >
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="lg" 
                  className="w-full rounded-xl border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500 transition-all font-bold gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}
