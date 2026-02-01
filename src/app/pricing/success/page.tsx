'use client';

import { verifyStripePayment } from '@/actions/stripe-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PricingSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying payment details...');

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setMessage('Invalid session. Please contact support.');
            return;
        }

        const verify = async () => {
             try {
                 const result = await verifyStripePayment(sessionId);
                 if (result.success) {
                     setStatus('success');
                     setMessage(`You are now a ${result.plan} member!`);
                     // Auto redirect after 3 seconds
                     setTimeout(() => {
                         router.push('/account/verification');
                         router.refresh();
                     }, 3000);
                 } else {
                     setStatus('error');
                     setMessage(result.error || 'Payment verification failed.');
                 }
             } catch (error) {
                 console.error(error);
                 setStatus('error');
                 setMessage('An unexpected error occurred.');
             }
        };

        verify();
    }, [sessionId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <CardContent className="pt-12 pb-12 text-center flex flex-col items-center">
                    
                    {status === 'loading' && (
                        <>
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Processing Payment</h2>
                            <p className="text-slate-500 font-medium">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h2>
                            <p className="text-green-600 font-bold text-lg mb-8">{message}</p>
                            <p className="text-slate-400 text-sm mb-6">Redirecting you to your certificate...</p>
                            <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800" onClick={() => router.push('/account/verification')}>
                                Go to Account
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Failed</h2>
                            <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">{message}</p>
                            <div className="flex gap-3 w-full">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => router.push('/contact')}>
                                    Support
                                </Button>
                                <Button className="flex-1 h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800" onClick={() => router.push('/pricing')}>
                                    Try Again
                                </Button>
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
