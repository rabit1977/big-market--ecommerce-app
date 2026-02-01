
'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery } from 'convex/react';
import {
  ArrowLeft
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { EditProfileForm, EditProfileFormValues } from './edit-user-form';

/**
 * Loading State Component
 */
function ProfileSkeleton() {
  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <Skeleton className='h-48 w-full rounded-xl' />
      <div className="flex gap-4">
        <Skeleton className='h-32 w-32 rounded-xl -mt-16 border-4 border-white' />
      </div>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-96 w-full' />
    </div>
  );
}

/**
 * Edit Profile Page Component
 */
export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  
  const user = useQuery(api.users.getByExternalId, { 
      externalId: session?.user?.id || '' 
  });
  
  const updateUser = useMutation(api.users.updateByExternalId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (values: EditProfileFormValues) => {
    if (!user || !session?.user?.id) return;
    
    setIsSubmitting(true);
    try {
        let uploadedImageUrl = user.image;
        let uploadedBannerUrl = user.banner;

        // Image Upload Helper
        const uploadImage = async (dataUrl: string) => {
             const response = await fetch(dataUrl);
             const blob = await response.blob();
             const file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });
             const formData = new FormData();
             formData.append('file', file);
             
             const uploadRes = await fetch('/api/upload', {
                 method: 'POST',
                 body: formData,
             });
             const result = await uploadRes.json();
             if (result.success) return result.url;
             throw new Error("Upload failed");
        };

        if (values.image && values.image.startsWith('data:')) {
            uploadedImageUrl = await uploadImage(values.image);
        }

        if (values.banner && values.banner.startsWith('data:')) {
            uploadedBannerUrl = await uploadImage(values.banner);
        }

        // Call Convex Mutation
        await updateUser({
            externalId: session.user.id,
            name: values.name,
            bio: values.bio,
            image: uploadedImageUrl,
            banner: uploadedBannerUrl,
            accountType: values.accountType,
            companyName: values.companyName || undefined,
            phone: values.phone || undefined,
            hasWhatsapp: values.hasWhatsapp,
            hasViber: values.hasViber,
            city: values.city || undefined,
            municipality: values.municipality || undefined,
            address: values.address || undefined,
            postalCode: values.postalCode || undefined,
            dateOfBirth: values.dateOfBirth?.toISOString(),
            gender: values.gender || undefined,
        });

        toast.success('Profile updated successfully');
          
        await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: values.name,
              image: uploadedImageUrl,
            },
        });
          
    } catch (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (user === undefined) {
    return (
      <div className='min-h-screen pt-24 pb-12 bg-gray-50/50'>
        <div className='container mx-auto px-4'>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (user === null) {
      return <div className="p-20 text-center">User not found</div>;
  }

  return (
    <div className='min-h-screen pt-24 pb-12 bg-gray-50/50'>
      <div className='container max-w-4xl mx-auto px-4'>
        <AppBreadcrumbs />
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
              <Link href='/account' className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground mb-2">
                 <ArrowLeft className='h-4 w-4' /> Back to Account
              </Link>
              <h1 className='text-3xl font-black tracking-tight text-slate-900'>
                Edit Profile
              </h1>
              <p className='text-muted-foreground'>
                Manage your public profile and preferences
              </p>
          </div>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl">
            <CardHeader className="sr-only">
               <CardTitle>Edit Profile Form</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 lg:p-8">
                <EditProfileForm
                  user={user as any}
                  onSubmit={handleUpdateProfile}
                  isSubmitting={isSubmitting}
                />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}