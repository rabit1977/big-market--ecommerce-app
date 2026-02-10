'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery } from 'convex/react';
import { Loader2, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function PasswordPage() {
    const { data: session } = useSession();
    const user = useQuery(api.users.getByExternalId, { externalId: session?.user?.id || '' });
    const changePassword = useMutation(api.users.changePassword);

    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPass.length < 6) {
             toast.error("Password must be at least 6 characters");
             return;
        }
        
        setSubmitting(true);
        try {
            if (!session?.user?.id) return;
            await changePassword({
                externalId: session.user.id,
                newPassword: newPass
            });
            toast.success("Password updated successfully");
            setNewPass('');
            setConfirmPass('');
        } catch (err) {
            toast.error("Failed to update password");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;

    const hasPassword = !!user.password;

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-xl mx-auto px-3 md:px-4">
                <div className="mb-2 md:mb-3">
                    <AppBreadcrumbs />
                </div>
                <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                             <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Lock className="w-4 h-4 text-primary" />
                             </div>
                             Change Password
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm mt-1">
                            {hasPassword 
                              ? "Update your existing password." 
                              : "You logged in via a provider (Google/GitHub). You can set a password to log in with email/password too."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                        <form onSubmit={handleSave} className="space-y-3 md:space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs md:text-sm font-semibold">New Password</Label>
                                <Input 
                                    type="password" 
                                    value={newPass} 
                                    onChange={e => setNewPass(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="h-9 md:h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs md:text-sm font-semibold">Confirm New Password</Label>
                                <Input 
                                    type="password" 
                                    value={confirmPass} 
                                    onChange={e => setConfirmPass(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="h-9 md:h-10 text-sm"
                                />
                            </div>
                            
                            <Button type="submit" className="w-full h-10 md:h-11 rounded-xl font-bold text-sm" disabled={submitting}>
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {hasPassword ? "Update Password" : "Set Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
