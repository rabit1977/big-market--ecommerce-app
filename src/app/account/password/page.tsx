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
                newPassword: newPass // In production, hash this before sending or use secure channel
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

    if (!user) return <div className="p-20 text-center">Loading...</div>;

    const hasPassword = !!user.password; // Check if user has password set in DB

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/10">
            <div className="container max-w-xl mx-auto px-4">
                <div className="mb-6">
                    <AppBreadcrumbs />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Lock className="w-5 h-5 text-primary" />
                             Change Password
                        </CardTitle>
                        <CardDescription>
                            {hasPassword 
                              ? "Update your existing password." 
                              : "You logged in via a provider (Google/GitHub). You can set a password to log in with email/password too."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input 
                                    type="password" 
                                    value={newPass} 
                                    onChange={e => setNewPass(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input 
                                    type="password" 
                                    value={confirmPass} 
                                    onChange={e => setConfirmPass(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            
                            <Button type="submit" className="w-full" disabled={submitting}>
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
