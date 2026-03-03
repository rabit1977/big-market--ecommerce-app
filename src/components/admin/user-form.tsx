'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type UserFormValues = {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  bio?: string;
};

interface UserFormProps {
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}

/**
 * User Form Component
 *
 * Form for creating new users with validation
 */
export function UserForm({ onSubmit, isSubmitting }: UserFormProps) {
  const t = useTranslations('AdminUsers');

  const userFormSchema = z.object({
    name: z.string().min(2, t('zod_name_min')),
    email: z.string().email(t('zod_email_invalid')),
    password: z.string().min(6, t('zod_password_min')),
    role: z.enum(['USER', 'ADMIN']),
    bio: z.string().optional(),
  });

  const form = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(userFormSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
      bio: '',
    },
  });

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
                <Input
                  placeholder={t('field_name_placeholder')}
                  {...field}
                  disabled={isSubmitting}
                />
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
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t('field_email_desc_create')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_password_label')}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='••••••••'
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t('field_password_desc')}
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
                disabled={isSubmitting}
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
                {t('field_role_desc')}
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
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t('field_bio_desc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className='flex justify-end gap-4 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            {t('btn_reset')}
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                {t('btn_creating')}
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                {t('btn_create')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}