'use client';


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { Check, CheckCircle2, ChevronLeft, FileText, Loader2, Minus, Plus } from 'lucide-react';
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
    // Mock Payment Delay
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
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
      <div className="container max-w-2xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
            <Link href="/wallet" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold">Top Up Account</h1>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl text-sm text-muted-foreground mb-8">
            Save bank fees and time. Top up your account and use all our paid services instantly.
        </div>

        <h2 className="text-lg font-bold mb-4">Payment Method</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div 
                onClick={() => setPaymentMethod('card')}
                className={cn(
                    "relative border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-32 hover:bg-gray-50",
                    paymentMethod === 'card' ? "border-green-500 bg-green-50/30" : "border-gray-200"
                )}
            >
                {paymentMethod === 'card' && (
                    <div className="absolute top-2 left-2 text-green-500">
                        <CheckCircle2 className="w-6 h-6 fill-green-500 text-white" />
                    </div>
                )}
                <span className="font-bold mt-2">Payment Card</span>
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-6 w-8 bg-red-500 rounded sm:w-10" />
                    <div className="h-6 w-8 bg-blue-700 rounded sm:w-10" />
                </div>
            </div>

            <div 
                onClick={() => setPaymentMethod('invoice')}
                className={cn(
                    "relative border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-32 hover:bg-gray-50",
                    paymentMethod === 'invoice' ? "border-green-500 bg-green-50/30" : "border-gray-200"
                )}
            >
                {paymentMethod === 'invoice' && (
                    <div className="absolute top-2 left-2 text-green-500">
                        <CheckCircle2 className="w-6 h-6 fill-green-500 text-white" />
                    </div>
                )}
                <span className="font-bold mt-2">Payment Slip / Invoice</span>
                <div className="flex items-center gap-2 mt-2 opacity-50">
                   <FileText className="w-6 h-6" />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
            <div className="flex flex-col gap-1">
                <Button variant="outline" size="sm" onClick={() => setAmount(prev => prev + 100)} className="h-8 w-8 p-0 rounded-lg">
                    <Plus className="w-4 h-4" />
                </Button>
                <div className="h-4" /> {/* Spacer */}
                <Button variant="outline" size="sm" onClick={() => setAmount(prev => Math.max(0, prev - 100))} className="h-8 w-8 p-0 rounded-lg">
                    <Minus className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 bg-gray-100 rounded-xl flex items-center p-0 overflow-hidden relative border border-gray-200 h-20">
                 <div className="flex-1 flex items-center justify-center text-xl font-bold text-gray-700">
                    <span className="text-3xl mr-2 text-black">{amount}</span> MKD + 18% VAT
                 </div>
                 <Button 
                    className="h-full w-20 rounded-none bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handlePay}
                    disabled={amount <= 0 || isProcessing}
                 >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                 </Button>
            </div>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-2 max-w-md mx-auto">
            <p>Enter amount you want to be added to your profile.</p>
            <p className="opacity-75">
                Payment with payment card is processed immediately. Bank transactions are processed in 1 - 2 working days. 
                If you want to speed up the process, you can send us a scanned or photographed receipt of payment to support@reklama5.mk.
            </p>
        </div>
      </div>
    </div>
  );
}
