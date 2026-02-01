'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from 'convex/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function DeleteAccountPage() {
    const { data: session } = useSession();
    const deleteAccount = useMutation(api.users.deleteAccount);
    const router = useRouter();

    const [confirmation, setConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmation !== 'DELETE') return;
        if (!session?.user?.id) return;

        setIsDeleting(true);
        try {
            await deleteAccount({ externalId: session.user.id });
            toast.success("Account deleted successfully");
            await signOut({ callbackUrl: '/' });
        } catch (err) {
            toast.error("Failed to delete account");
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-muted/10">
            <div className="container max-w-xl mx-auto px-4">
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                             <AlertTriangle className="w-6 h-6" />
                             Delete Account
                        </CardTitle>
                        <CardDescription>
                            This action is permanent and cannot be undone. All your data, including listings and messages, will be permanently removed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-destructive/10 p-4 rounded-lg text-destructive text-sm font-medium">
                            Warning: You are about to delete your account. This action is irreversible.
                        </div>

                        <div className="space-y-2">
                             <Label>Type "DELETE" to confirm</Label>
                             <Input 
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                placeholder="DELETE"
                             />
                        </div>

                        <Button 
                            variant="destructive" 
                            className="w-full" 
                            disabled={confirmation !== 'DELETE' || isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deleting Account...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Permanently Delete Account
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
