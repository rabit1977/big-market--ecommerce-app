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
        <div className="min-h-screen pt-24 pb-12 bg-muted/10">
            <div className="container max-w-2xl mx-auto px-4">
                <AppBreadcrumbs />
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900">Account Status</h1>
                </div>

                {/* Verification Status based on Subscription */}
                {user.membershipStatus === 'ACTIVE' ? (
                     <Card className="mb-8 border border-border/60 shadow-sm bg-card rounded-[1.5rem] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                             <div className="flex items-center gap-2 text-white">
                                 <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                                     <Crown className="w-4 h-4 text-white" />
                                 </div>
                                 <span className="font-bold text-sm tracking-wide uppercase opacity-90">Premium Membership</span>
                             </div>
                             <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-md">
                                 Active
                             </Badge>
                        </div>
                        
                        <CardContent className="p-6 md:p-8">
                             <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                 {/* Avatar / Icon */}
                                 <Avatar className="w-24 h-24 border-4 border-white shadow-lg shrink-0">
                                     <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-black">
                                         {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
                                     </AvatarFallback>
                                 </Avatar>

                                 {/* User Details */}
                                 <div className="flex-1 text-center md:text-left space-y-4 w-full">
                                     <div>
                                         <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
                                             Dear, {user.name}
                                         </h2>
                                         <p className="text-emerald-600 font-bold text-lg">
                                             Your certificate is activated and valid until {user.membershipExpiresAt ? format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy') : 'Forever'}.
                                         </p>
                                     </div>

                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                         <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Membership ID</p>
                                              <p className="font-mono text-sm font-bold text-slate-700">
                                                  #{userId.slice(-8).toUpperCase()}
                                              </p>
                                         </div>
                                     </div>

                                     <div className="pt-4 flex justify-end">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-auto py-1 px-3 text-xs font-semibold"
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
                    <Card className="border-slate-200 rounded-3xl bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
                                <Crown className="w-10 h-10 text-slate-400" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Subscription Required</h2>
                            
                            <p className="text-muted-foreground font-medium max-w-md mb-8 leading-relaxed">
                                Until you are subscribed to a plan, you cannot upload verified listings. Upgrade your account to unlock full selling potential.
                            </p>

                            <Button className="h-12 px-8 rounded-full font-bold text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" onClick={() => window.location.href = '/pricing'}>
                                View Subscription Plans
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
