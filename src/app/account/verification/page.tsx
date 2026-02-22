'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import {
    CheckCircle2,
    Crown,
    Phone,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function VerificationPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const cancelSubscription = useMutation(api.users.cancelMembership);
    const verifyPhone = useMutation(api.users.verifyPhone);

    const [submitting, setSubmitting] = useState(false);
    
    // Two Factor UI logic
    const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState<'input' | 'verify'>('input');

    const handleSendCode = () => {
        if (!phoneNumber || phoneNumber.length < 6) {
            toast.error("Please enter a valid phone number");
            return;
        }
        setSubmitting(true);
        // Simulate sending SMS
        setTimeout(() => {
            toast.success(`Verification code sent to ${phoneNumber}`);
            setStep('verify');
            setSubmitting(false);
        }, 800);
    };

    const handleVerifyCode = async () => {
        if (verificationCode.length < 4) {
            toast.error("Please enter the 4-6 digit code");
            return;
        }
        setSubmitting(true);
        
        try {
            await verifyPhone({ externalId: userId, phone: phoneNumber });
            toast.success("Phone verified successfully!");
            setIsVerifyingPhone(false);
            setStep('input');
        } catch (e) {
            toast.error("Invalid verification code");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-2xl mx-auto px-3 md:px-4">
                <div className="mb-2 md:mb-3">
                    <AppBreadcrumbs />
                </div>
                <div className="flex items-center gap-2.5 mb-5 md:mb-8">
                    <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h1 className="text-lg md:text-2xl font-black tracking-tighter text-foreground">Account Status</h1>
                </div>

                {/* Verification Status based on Subscription */}
                {user.membershipStatus === 'ACTIVE' ? (
                     <Card className="border-border shadow-sm bg-card overflow-hidden rounded-2xl">
                        <div className="bg-primary/5 px-4 py-3 flex items-center justify-between border-b border-border/50">
                             <div className="flex items-center gap-1.5 text-primary">
                                 <Crown className="w-3.5 h-3.5 fill-current" />
                                 <span className="font-bold text-[11px] md:text-xs tracking-wide uppercase">Premium</span>
                             </div>
                             <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 text-[10px] md:text-xs">
                                 Active
                             </Badge>
                        </div>
                        
                        <CardContent className="p-4 md:p-6">
                             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
                                 {/* Avatar */}
                                 <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 md:border-4 border-background shadow-sm shrink-0">
                                     <AvatarFallback className="bg-primary/10 text-primary text-lg md:text-xl font-black">
                                         {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                                     </AvatarFallback>
                                 </Avatar>

                                 {/* User Details */}
                                 <div className="flex-1 text-center sm:text-left space-y-3 w-full min-w-0">
                                     <div>
                                         <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-none mb-0.5">
                                             Hello, {user.name}
                                         </h2>
                                         <p className="text-muted-foreground text-xs md:text-sm font-medium">
                                             Valid until <span className="text-foreground font-bold">{user.membershipExpiresAt ? format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy') : 'Forever'}</span>
                                         </p>
                                     </div>

                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                         <div className="bg-muted/50 p-2.5 rounded-lg border border-border/50">
                                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Membership ID</p>
                                              <p className="font-mono text-xs md:text-sm font-bold text-foreground">
                                                  #{userId.slice(-8).toUpperCase()}
                                              </p>
                                         </div>
                                     </div>

                                     <div className="pt-2 flex justify-center sm:justify-end">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto py-1.5 px-3 text-[11px] font-bold"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to cancel your Premium Membership? You will lose your verified status immediately.")) {
                                                    try {
                                                        await cancelSubscription({ externalId: userId });
                                                        toast.success("Membership cancelled");
                                                    } catch (e) {
                                                        toast.error("Failed to cancel");
                                                    }
                                                }
                                            }}
                                        >
                                            Cancel Subscription
                                        </Button>
                                     </div>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-border shadow-sm bg-card overflow-hidden rounded-2xl">
                        <CardContent className="flex flex-col items-center justify-center text-center py-10 md:py-14 px-5">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Crown className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
                            </div>
                            
                            <h2 className="text-lg md:text-xl font-black text-foreground mb-1.5">Subscription Required</h2>
                            
                            <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-sm mb-6 leading-relaxed">
                                Until you are subscribed to a plan, you cannot upload verified listings. Upgrade your account to unlock full selling potential.
                            </p>

                            <Button size="default" className="rounded-xl font-bold px-6 shadow-sm text-sm" onClick={() => window.location.href = '/premium'}>
                                View Subscription Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* --- 2FA / Phone Verification Section --- */}
                <div className="flex items-center gap-2.5 mt-10 md:mt-14 mb-5 md:mb-6">
                    <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl">
                        <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-black tracking-tighter text-foreground">Two-Factor Authentication</h2>
                </div>

                <Card className="border-border shadow-sm bg-card overflow-hidden rounded-2xl">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            
                            {/* Icon graphic */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/50 rounded-full flex items-center justify-center shrink-0 border border-border/50">
                                {user.isPhoneVerified ? (
                                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
                                ) : (
                                    <Phone className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                                    {user.isPhoneVerified ? 'Phone Number Verified' : 'Verify Your Phone'}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-lg">
                                    {user.isPhoneVerified 
                                        ? `Your phone number (${user.phone}) is verified. You can use this for enhanced security and 2FA logins.` 
                                        : 'Adding a phone number secures your account through Two-Factor Authentication (2FA) via SMS codes.'}
                                </p>

                                {!user.isPhoneVerified && !isVerifyingPhone && (
                                    <Button 
                                        onClick={() => setIsVerifyingPhone(true)}
                                        className="rounded-lg font-bold shadow-sm"
                                    >
                                        Enable 2FA / SMS
                                    </Button>
                                )}

                                {user.isPhoneVerified && (
                                     <Button 
                                         variant="outline"
                                         size="sm"
                                         className="rounded-lg text-xs"
                                         onClick={() => {
                                             toast.info("A code has been sent to your new phone number to change it.");
                                             setIsVerifyingPhone(true);
                                         }}
                                     >
                                         Change Phone Number
                                     </Button>
                                )}
                            </div>
                        </div>

                        {/* Interactive Verification Flow */}
                        {isVerifyingPhone && (
                            <div className="mt-6 p-5 md:p-6 bg-muted/30 border border-border/50 rounded-xl space-y-4 max-w-md animate-in fade-in slide-in-from-top-4">
                                {step === 'input' ? (
                                    <div className="space-y-3 relative">
                                        <h4 className="text-sm font-bold">Enter your mobile number</h4>
                                        <Input 
                                            placeholder="+389 XX XXX XXX" 
                                            value={phoneNumber} 
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            className="h-11 bg-background"
                                        />
                                        <div className="flex gap-2 justify-end pt-2">
                                            <Button variant="ghost" className="h-9" onClick={() => setIsVerifyingPhone(false)}>Cancel</Button>
                                            <Button className="h-9" onClick={handleSendCode} disabled={submitting}>
                                                {submitting ? 'Sending...' : 'Send Code'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 relative">
                                        <h4 className="text-sm font-bold">Enter the verification code</h4>
                                        <p className="text-xs text-muted-foreground">We sent a 6-digit code to {phoneNumber}</p>
                                        <Input 
                                            placeholder="XXXXXX" 
                                            value={verificationCode} 
                                            onChange={e => setVerificationCode(e.target.value)}
                                            className="h-11 bg-background text-center tracking-[0.5em] font-mono font-bold text-lg"
                                            maxLength={6}
                                        />
                                        <div className="flex gap-2 justify-end pt-2">
                                            <Button variant="ghost" className="h-9" onClick={() => setStep('input')}>Back</Button>
                                            <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleVerifyCode} disabled={submitting}>
                                                {submitting ? 'Verifying...' : 'Verify'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
