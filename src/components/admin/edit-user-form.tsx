'use client';

import { updateUserAction } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type EditUserFormValues = {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  bio?: string;
};

interface EditUserFormProps {
  user: User;
  isEditingSelf?: boolean;
}

export function EditUserForm({
  user,
  isEditingSelf = false,
}: EditUserFormProps) {
  const t = useTranslations('AdminUsers');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const editUserFormSchema = z.object({
    name: z.string().min(2, t('zod_name_min')),
    email: z.string().email(t('zod_email_invalid')),
    role: z.enum(['USER', 'ADMIN']),
    bio: z.string().optional(),
  });

  const form = useForm<EditUserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editUserFormSchema) as any,
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'USER',
      bio: user.bio || '',
    },
  });

  const onSubmit: SubmitHandler<EditUserFormValues> = async (values) => {
    startTransition(async () => {
      try {
        const result = await updateUserAction(user.id, {
          name: values.name,
          email: values.email,
          role: values.role as any,
          bio: values.bio,
        });

        if (result.success) {
          toast.success(result.message || t('toast_updated'));
          router.push('/admin/users');
          router.refresh();
        } else {
          toast.error(result.error || t('toast_update_failed'));
        }
      } catch (error) {
        console.error('Update user error:', error);
        toast.error(t('toast_unexpected'));
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Name Field */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_name_label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('field_name_placeholder')} {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                {t('field_name_desc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_email_label')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder={t('field_email_placeholder')}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                {t('field_email_desc_edit')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_role_label')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending || isEditingSelf}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('field_role_placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='USER'>{t('role_user')}</SelectItem>
                  <SelectItem value='ADMIN'>{t('role_admin')}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {isEditingSelf ? t('field_role_desc_self') : t('field_role_desc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Field */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_bio_label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('field_bio_placeholder')}
                  className='resize-none'
                  rows={4}
                  {...field}
                  value={field.value || ''}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/users')}
            disabled={isPending}
          >
            {t('btn_cancel')}
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                {t('btn_saving')}
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                {t('btn_save')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}