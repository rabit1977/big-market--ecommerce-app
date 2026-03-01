'use client';

import { changePasswordAction } from '@/actions/auth-actions';
import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from 'convex/react';
import { Loader2, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../../convex/_generated/api';

export default function PasswordPage() {
    const { data: session } = useSession();
    const t = useTranslations('Password');
    const user = useQuery(api.users.getByExternalId, { externalId: session?.user?.id || '' });

    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const hasPassword = !!user?.password;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasPassword && !oldPass) {
            toast.error(t('err_required'));
            return;
        }
        if (newPass !== confirmPass) {
            toast.error(t('err_mismatch'));
            return;
        }
        if (newPass.length < 6) {
             toast.error(t('err_length'));
             return;
        }
        
        setSubmitting(true);
        try {
            if (!session?.user?.id) return;
            const res = await changePasswordAction({
                oldPassword: oldPass,
                newPassword: newPass
            });
            
            if (res.success) {
                toast.success(t('success'));
                setOldPass('');
                setNewPass('');
                setConfirmPass('');
            } else {
                toast.error(res.error || t('failed'));
            }
        } catch (err) {
            toast.error(t('failed'));
        } finally {
            setSubmitting(false);
        }
    };

    if (user === undefined) return <div className="p-20 text-center text-muted-foreground">{t('loading')}</div>;
    if (user === null) return <div className="p-20 text-center text-muted-foreground">{t('user_not_found')}</div>;

    return (
        <div className="min-h-screen pt-4 md:pt-6 pb-8 bg-muted/20">
            <div className="container max-w-xl mx-auto px-3 md:px-4">
                <div className="mb-6 md:mb-3">
                    <AppBreadcrumbs />
                </div>
                <Card className="border-border shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                             <div className="p-1.5 bg-primary/10 rounded-lg">
                                 <Lock className="w-4 h-4 text-primary" />
                             </div>
                             {t('title')}
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm mt-1">
                            {hasPassword ? t('desc_existing') : t('desc_provider')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                        <form onSubmit={handleSave} className="space-y-3 md:space-y-4">
                            {hasPassword && (
                                <div className="space-y-1.5 mb-6">
                                    <Label className="text-xs md:text-sm font-semibold">{t('current_password')}</Label>
                                    <Input 
                                        type="password" 
                                        value={oldPass} 
                                        onChange={e => setOldPass(e.target.value)}
                                        placeholder={t('current_placeholder')}
                                        required
                                        className="h-9 md:h-10 text-sm border-primary/20 bg-primary/5 focus-visible:ring-primary/20"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label className="text-xs md:text-sm font-semibold">{t('new_password')}</Label>
                                <Input 
                                    type="password" 
                                    value={newPass} 
                                    onChange={e => setNewPass(e.target.value)}
                                    placeholder={t('new_placeholder')}
                                    required
                                    className="h-9 md:h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs md:text-sm font-semibold">{t('confirm_password')}</Label>
                                <Input 
                                    type="password" 
                                    value={confirmPass} 
                                    onChange={e => setConfirmPass(e.target.value)}
                                    placeholder={t('confirm_placeholder')}
                                    required
                                    className="h-9 md:h-10 text-sm"
                                />
                            </div>
                            
                            <Button type="submit" className="w-full h-10 md:h-11 rounded-xl font-bold text-sm" disabled={submitting}>
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {hasPassword ? t('update_btn') : t('set_btn')}
                             </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
