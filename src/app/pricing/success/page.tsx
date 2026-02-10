'use client';

import { verifyStripePayment } from '@/actions/stripe-actions';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BadgeCheck, CheckCircle2, Crown, Loader2, XCircle } from 'lucide-react';
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
                     setTimeout(() => {
                         router.push('/account/verification');
                         router.refresh();
                     }, 4000);
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
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-md rounded-3xl border-2 border-border bg-card shadow-2xl overflow-hidden"
            >
                <div className="pt-10 pb-10 px-6 sm:px-8 text-center flex flex-col items-center">
                    
                    {status === 'loading' && (
                        <>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground mb-2">Processing Payment</h2>
                            <p className="text-muted-foreground font-medium text-sm">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </motion.div>
                            
                            <h2 className="text-2xl font-black text-foreground mb-2">Payment Successful!</h2>
                            <p className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">{message}</p>
                            
                            <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
                                <BadgeCheck className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-primary">Verified Seller Badge Activated</span>
                            </div>

                            <p className="text-muted-foreground text-xs mb-6">Redirecting to your account...</p>

                            <div className="flex gap-3 w-full">
                                <Button 
                                    variant="outline"
                                    className="flex-1 h-11 rounded-xl font-bold border-border hover:bg-muted"
                                    onClick={() => router.push('/my-listings')}
                                >
                                    My Listings
                                </Button>
                                <Button 
                                    className="flex-1 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                                    onClick={() => router.push('/account/verification')}
                                >
                                    <Crown className="w-4 h-4 mr-1.5" />
                                    My Account
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="w-10 h-10 text-destructive" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground mb-2">Payment Failed</h2>
                            <p className="text-muted-foreground font-medium text-sm mb-8 max-w-xs mx-auto">{message}</p>
                            <div className="flex gap-3 w-full">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-11 rounded-xl font-bold border-border hover:bg-muted"
                                    onClick={() => router.push('/contact')}
                                >
                                    Support
                                </Button>
                                <Button 
                                    className="flex-1 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                                    onClick={() => router.push('/premium')}
                                >
                                    Try Again
                                </Button>
                            </div>
                        </>
                    )}

                </div>
            </motion.div>
        </div>
    );
}
