'use client';

import { createUserAction } from '@/actions/user-actions';
import { UserForm } from '@/components/admin/user-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  bio?: string;
}

export default function CreateUserPage() {
  const t = useTranslations('AdminUsers');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback((values: CreateUserFormValues) => {
    startTransition(async () => {
      try {
        const result = await createUserAction(values);
        if (result.success) {
          toast.success(result.message ?? t('toast_created'));
          router.push('/admin/users');
          router.refresh();
        } else {
          toast.error(result.error ?? t('toast_create_failed'));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('toast_unexpected'));
      }
    });
  }, [router, t]);

  return (
    <div className='max-w-4xl mx-auto pb-20'>
      <div className='mb-8 animate-in fade-in slide-in-from-top-4 duration-500'>
        <Button variant='ghost' asChild className='hover:bg-secondary rounded-lg mb-6 -ml-3'>
          <Link href='/admin/users'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('back_to_users')}
          </Link>
        </Button>
        <div className='flex items-center gap-4'>
          <div className='h-12 w-12 rounded-lg bg-secondary flex items-center justify-center border border-border shadow-none'>
            <UserPlus className='h-6 w-6 text-primary' />
          </div>
          <div>
            <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
              {t('create_page_title')}
            </h1>
            <p className='text-lg text-muted-foreground font-medium mt-1'>
              {t('create_page_desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className='bg-card rounded-lg p-8 sm:p-10 shadow-none border border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
          <UserForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>

        <div className='p-6 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
          <h3 className='text-base font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300'>
            <Info className="h-4 w-4" />
            {t('password_req_title')}
          </h3>
          <ul className='list-disc list-inside space-y-1 text-sm text-blue-700/80 dark:text-blue-300/80'>
            <li>{t('password_req_min')}</li>
            <li>{t('password_req_change')}</li>
            <li>{t('password_req_admin')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}