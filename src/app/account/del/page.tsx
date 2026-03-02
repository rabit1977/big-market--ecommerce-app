'use client';
// Re-saving to trigger TS server refresh

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DeleteAccountPage() {
    const locale = useLocale();
    const isMk = locale === 'mk';
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
            toast.success(isMk ? "Сметката е успешно избришана" : "Account deleted successfully");
            await signOut({ callbackUrl: '/' });
        } catch (err) {
            toast.error(isMk ? "Неуспешно бришење на сметката" : "Failed to delete account");
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-xl mx-auto px-3 md:px-4">
                <Card className="border-destructive/30 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                        <CardTitle className="flex items-center gap-2 text-destructive text-base md:text-lg">
                             <div className="p-1.5 bg-destructive/10 rounded-lg">
                                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                             </div>
                             {isMk ? 'Избриши Сметка' : 'Delete Account'}
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm mt-1 leading-relaxed">
                            {isMk ? 'Оваа акција е трајна и не може да се врати. Сите ваши податоци, вклучувајќи ги вашите огласи и информации за профилот, ќе бидат трајно отстранети.' : 'This action is permanent and cannot be undone. All your data, including your listings and profile information, will be permanently removed.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4 md:space-y-5">
                        <div className="bg-destructive/5 dark:bg-destructive/10 p-3 rounded-lg text-destructive text-xs md:text-sm font-medium">
                            {isMk ? '⚠️ Предупредување: Се подготвувате да ја избришете вашата сметка. Оваа акција е неповратна.' : '⚠️ Warning: You are about to delete your account. This action is irreversible.'}
                        </div>

                        <div className="space-y-1.5">
                             <Label className="text-xs md:text-sm font-semibold">{isMk ? 'Внесете "DELETE" за потврда' : 'Type "DELETE" to confirm'}</Label>
                             <Input 
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                placeholder="DELETE"
                                className="h-9 md:h-10 text-sm"
                             />
                        </div>

                        <Button 
                            variant="destructive" 
                            className="w-full h-10 md:h-11 rounded-xl font-bold text-sm" 
                            disabled={confirmation !== 'DELETE' || isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    {isMk ? 'Бришење на Сметката...' : 'Deleting Account...'}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    {isMk ? 'Трајно Избриши Ја Сметката' : 'Permanently Delete Account'}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
