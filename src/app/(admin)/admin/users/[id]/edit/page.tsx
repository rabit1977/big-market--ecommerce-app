// app/admin/users/[id]/edit/page.tsx

import { getUserByIdAction } from '@/actions/user-actions';
import { auth } from '@/auth';
import { EditUserForm } from '@/components/admin/edit-user-form';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit User Page - Server Component
 *
 * Admin interface for editing user details
 */
export default async function EditUserPage({ params }: EditUserPageProps) {
  // Check admin authorization
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Await params in Next.js 15
  const { id } = await params;

  // Fetch user data & translations in parallel
  const [result, t] = await Promise.all([
    getUserByIdAction(id),
    getTranslations('AdminUsers'),
  ]);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;
  const isEditingSelf = session.user.id === user.id;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Header */}
        <div className='space-y-4'>
          <Button variant='ghost' asChild>
            <Link href='/admin/users'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              {t('back_to_users')}
            </Link>
          </Button>

          <div className='flex items-start gap-4'>
            <UserAvatar
              user={user}
              className='h-16 w-16'
              fallbackClassName="text-xl"
            />
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <h1 className='text-3xl font-bold tracking-tight'>{t('edit_page_title')}</h1>
                <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                  <Shield className='h-3 w-3 mr-1' />
                  {user.role}
                </Badge>
              </div>
              <p className='text-muted-foreground mt-1'>
                {t('edit_page_desc', { name: user.name || user.email })}
              </p>
            </div>
          </div>
        </div>

        {/* Warning for editing own account */}
        {isEditingSelf && (
          <Card className='border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20'>
            <CardHeader>
              <CardTitle className='text-base flex items-center gap-2'>
                <Shield className='h-4 w-4' />
                {t('editing_self_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              {t('editing_self_desc')}
            </CardContent>
          </Card>
        )}

        {/* Edit Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('card_title')}</CardTitle>
            <CardDescription>
              {t('card_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditUserForm user={user} isEditingSelf={isEditingSelf} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className='border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='text-base'>{t('notes_title')}</CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground space-y-2'>
            <ul className='list-disc list-inside space-y-1'>
              <li>{t('note_email')}</li>
              <li>{t('note_role')}</li>
              <li>{t('note_own_role')}</li>
              <li>{t('note_password')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}