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
        // Mock upload
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

    if (!user) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/30">
            <div className="container max-w-2xl mx-auto px-4">
                <AppBreadcrumbs />
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">Account Status</h1>
                </div>

                {/* Verification Status based on Subscription */}
                {user.membershipStatus === 'ACTIVE' ? (
                     <Card className="mb-8 border-border shadow-sm bg-card overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-border/50">
                             <div className="flex items-center gap-2 text-primary">
                                 <Crown className="w-4 h-4 fill-current" />
                                 <span className="font-bold text-sm tracking-wide uppercase">Premium Membership</span>
                             </div>
                             <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                                 Active
                             </Badge>
                        </div>
                        
                        <CardContent className="p-6 md:p-8">
                             <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                 {/* Avatar / Icon */}
                                 <Avatar className="w-20 h-20 border-4 border-background shadow-sm shrink-0">
                                     <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                                         {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                                     </AvatarFallback>
                                 </Avatar>

                                 {/* User Details */}
                                 <div className="flex-1 text-center md:text-left space-y-4 w-full">
                                     <div>
                                         <h2 className="text-2xl font-black text-foreground tracking-tight leading-none mb-1">
                                             Hello, {user.name}
                                         </h2>
                                         <p className="text-muted-foreground font-medium">
                                             Your certificate is valid until <span className="text-foreground font-bold">{user.membershipExpiresAt ? format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy') : 'Forever'}</span>.
                                         </p>
                                     </div>

                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                         <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Membership ID</p>
                                              <p className="font-mono text-sm font-bold text-foreground">
                                                  #{userId.slice(-8).toUpperCase()}
                                              </p>
                                         </div>
                                     </div>

                                     <div className="pt-4 flex justify-end">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-auto py-2 px-4 text-xs font-bold"
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
                    <Card className="border-border shadow-sm bg-card overflow-hidden">
                        <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <Crown className="w-10 h-10 text-muted-foreground" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-foreground mb-2">Subscription Required</h2>
                            
                            <p className="text-muted-foreground font-medium max-w-md mb-8 leading-relaxed">
                                Until you are subscribed to a plan, you cannot upload verified listings. Upgrade your account to unlock full selling potential.
                            </p>

                            <Button size="lg" className="rounded-full font-bold px-8 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/pricing'}>
                                View Subscription Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
