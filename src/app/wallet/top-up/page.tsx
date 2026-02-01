'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { CheckCircle2, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

const PACKAGES = [
    { amount: 500, price: 500, label: 'Starter' },
    { amount: 1500, price: 1400, label: 'Popular', bonus: 'Save 100' },
    { amount: 5000, price: 4500, label: 'Pro', bonus: 'Save 500' },
];

export default function TopUpPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const addCredits = useMutation(api.users.addCredits);

  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!session?.user?.id || selectedPkg === null) return;
    
    const pkg = PACKAGES[selectedPkg];
    setIsProcessing(true);

    // Mock Payment Delay
    await new Promise(r => setTimeout(r, 2000));

    try {
        await addCredits({
            externalId: session.user.id,
            amount: pkg.amount
        });
        toast.success(`Successfully added ${pkg.amount} MKD to wallet!`);
        router.push('/wallet');
    } catch (err) {
        toast.error("Payment failed");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/10">
      <div className="container max-w-3xl mx-auto px-4">
        
        <div className="mb-8">
            <Link href="/wallet" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground mb-4">
                <ChevronLeft className="w-4 h-4" /> Back to Wallet
            </Link>
            <h1 className="text-3xl font-bold">Top Up Wallet</h1>
            <p className="text-muted-foreground">Select an amount to add to your account balance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
            {PACKAGES.map((pkg, idx) => (
                <button
                    key={idx}
                    onClick={() => setSelectedPkg(idx)}
                    className={cn(
                        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all hover:scale-105",
                        selectedPkg === idx 
                          ? "border-primary bg-primary/5 shadow-lg" 
                          : "border-border bg-card hover:border-primary/50"
                    )}
                >
                    {pkg.bonus && (
                        <div className="absolute -top-3 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                            {pkg.bonus}
                        </div>
                    )}
                    <div className="font-bold text-lg mb-1">{pkg.label}</div>
                    <div className="text-3xl font-black text-foreground mb-1">{pkg.amount} <span className="text-sm font-normal text-muted-foreground">MKD</span></div>
                    <div className="text-sm text-muted-foreground">Cost: {pkg.price} MKD</div>
                    
                    {selectedPkg === idx && (
                        <div className="absolute top-2 right-2 text-primary">
                            <CheckCircle2 className="w-5 h-5 fill-primary/10" />
                        </div>
                    )}
                </button>
            ))}
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payment Method
            </h3>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expiry</Label>
                            <Input placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                            <Label>CVC</Label>
                            <Input placeholder="123" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                     Secure mocked transaction (This is a demo)
                </div>
                
                <Button 
                    size="lg" 
                    className="w-full h-12 text-lg font-bold"
                    disabled={selectedPkg === null || isProcessing}
                    onClick={handlePay}
                >
                    {isProcessing ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin mr-2" />
                           Processing...
                        </>
                    ) : (
                        selectedPkg !== null 
                          ? `Pay ${PACKAGES[selectedPkg].price} MKD` 
                          : "Select a Package"
                    )}
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}
