'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import {
    Crown,
    ShieldCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function VerificationPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    
    const user = useQuery(api.users.getByExternalId, { externalId: userId });
    const request = useQuery(api.verification.getRequest, { userId });
    const submitRequest = useMutation(api.verification.submit);
    const cancelSubscription = useMutation(api.users.cancelMembership);

    const [fileUrl, setFileUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleUpload = () => {
        setFileUrl('https://example.com/id-doc.jpg');
        toast.success("Document uploaded successfully");
    };

    const handleSubmit = async () => {
        if (!fileUrl) {
            toast.error("Please upload a document first");
            return;
        }
        setSubmitting(true);
        try {
            await submitRequest({
                userId,
                idDocument: fileUrl
            });
            toast.success("Verification request submitted!");
        } catch (err: any) {
            toast.error(err.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="min-h-screen pt-16 md:pt-20 pb-8 bg-muted/20">
            <div className="container max-w-2xl mx-auto px-3 md:px-4">
                <div className="mb-4 md:mb-6">
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

                            <Button size="default" className="rounded-xl font-bold px-6 shadow-sm text-sm" onClick={() => window.location.href = '/pricing'}>
                                View Subscription Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
