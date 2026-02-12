import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Ban, LogOut } from 'lucide-react';

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl text-center border border-red-500/20 shadow-2xl shadow-red-500/5 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
            <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-500/20 animate-pulse">
                <Ban className="h-12 w-12 text-destructive" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                Account Suspended
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Your account has been suspended or deactivated.
                <br />
                <span className="text-sm mt-2 block opacity-80">
                    If you believe this is an error, please contact support.
                </span>
            </p>

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
                className="w-full rounded-xl border-red-500/20 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
