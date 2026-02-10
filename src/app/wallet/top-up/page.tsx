'use client';


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { Check, ChevronLeft, FileText, Loader2, Minus, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function TopUpPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const addCredits = useMutation(api.users.addCredits);

  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const vat = Math.round(amount * 0.18);
  const total = amount + vat;

  const handlePay = async () => {
    if (!session?.user?.id || amount <= 0) return;
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    try {
        await addCredits({
            externalId: session.user.id,
            amount: amount 
        });
        toast.success(`Successfully added ${amount} MKD to wallet!`);
        router.push('/wallet');
    } catch (err) {
        toast.error("Payment failed");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
      <div className="container max-w-2xl mx-auto px-3 md:px-4">
        
        <div className="flex items-center gap-3 mb-5 md:mb-8">
            <Link href="/wallet" className="p-1.5 -ml-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-foreground">Top Up Account</h1>
        </div>

        <div className="bg-primary/5 border border-primary/10 p-3.5 md:p-5 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium text-foreground mb-5 md:mb-8 flex gap-3 items-start">
            <div className="p-1.5 bg-background rounded-lg text-primary shadow-sm border border-primary/10 shrink-0">
                <FileText className="w-4 h-4" />
            </div>
            <p className="leading-relaxed text-[11px] md:text-sm">
               Save bank fees and time. Top up your account and use all our paid services instantly. Your funds never expire.
            </p>
        </div>

        <h2 className="text-sm md:text-base font-bold text-foreground mb-3 px-0.5">Payment Method</h2>
        
        <div className="grid grid-cols-2 gap-2.5 md:gap-4 mb-5 md:mb-8">
            <div 
                onClick={() => setPaymentMethod('card')}
                className={cn(
                    "relative border-2 rounded-xl md:rounded-2xl p-4 md:p-5 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-28 md:h-36 hover:bg-muted/50",
                    paymentMethod === 'card' 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-card"
                )}
            >
                {paymentMethod === 'card' && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                    </div>
                )}
                <div className={cn("w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-colors", paymentMethod === 'card' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <div className="flex -space-x-1.5">
                         <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-current opacity-70" />
                         <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-current opacity-50" />
                    </div>
                </div>
                <span className={cn("font-bold text-[11px] md:text-sm", paymentMethod === 'card' ? "text-primary" : "text-muted-foreground")}>Credit / Debit Card</span>
            </div>

            <div 
                onClick={() => setPaymentMethod('invoice')}
                className={cn(
                    "relative border-2 rounded-xl md:rounded-2xl p-4 md:p-5 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-28 md:h-36 hover:bg-muted/50",
                    paymentMethod === 'invoice' 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-card"
                )}
            >
                {paymentMethod === 'invoice' && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                    </div>
                )}
                <div className={cn("w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-colors", paymentMethod === 'invoice' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className={cn("font-bold text-[11px] md:text-sm", paymentMethod === 'invoice' ? "text-primary" : "text-muted-foreground")}>Bank Invoice</span>
            </div>
        </div>

        <h2 className="text-sm md:text-base font-bold text-foreground mb-3 px-0.5">Amount to Add</h2>

        <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm mb-5 md:mb-8">
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex flex-col gap-1.5">
                    <Button variant="outline" size="icon" onClick={() => setAmount(prev => prev + 100)} className="rounded-lg h-9 w-9 md:h-10 md:w-10 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setAmount(prev => Math.max(0, prev - 100))} className="rounded-lg h-9 w-9 md:h-10 md:w-10 border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors">
                        <Minus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 text-center border-l border-border pl-4 md:pl-6">
                     <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Total Amount</div>
                     <div className="text-3xl md:text-5xl font-black text-foreground tracking-tight flex items-center justify-center gap-1.5">
                        {amount} <span className="text-xs md:text-base text-muted-foreground font-bold self-end mb-0.5 md:mb-1">MKD</span>
                     </div>
                     <div className="text-[10px] md:text-xs font-bold text-muted-foreground mt-1.5 bg-muted/50 inline-block px-2 py-0.5 rounded-full">
                        + 18% VAT included
                     </div>
                </div>
            </div>

            <div className="mt-5 md:mt-8">
                <Button 
                    className="w-full h-11 md:h-12 rounded-xl text-sm md:text-base font-bold shadow-sm"
                    onClick={handlePay}
                    disabled={amount <= 0 || isProcessing}
                    size="lg"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                        </>
                    ) : (
                        `Pay ${amount + vat} MKD Now`
                    )}
                </Button>
            </div>
        </div>

        <div className="text-[10px] md:text-xs text-muted-foreground text-center space-y-1.5 max-w-md mx-auto px-3">
            <p className="font-medium">Secure payment processing provided by Stripe.</p>
            <p className="opacity-70">
                Payment with payment card is processed immediately. Bank transactions are processed in 1 - 2 working days. 
            </p>
        </div>
      </div>
    </div>
  );
}
