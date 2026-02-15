
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
    <div className='max-w-3xl mx-auto space-y-3'>
      <Skeleton className='h-24 md:h-36 w-full rounded-xl' />
      <div className="flex gap-3">
        <Skeleton className='h-16 w-16 md:h-20 md:w-20 rounded-lg -mt-8 md:-mt-10 border-3 border-background' />
      </div>
      <Skeleton className='h-8 w-full' />
      <Skeleton className='h-64 w-full rounded-xl' />
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
        // Call Convex Mutation
        await updateUser({
            externalId: session.user.id,
            name: values.name,
            bio: values.bio,
            image: values.image,
            banner: values.banner,
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
              image: values.image,
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
      <div className='min-h-screen pt-4 md:pt-6 pb-8 bg-background'>
        <div className='container mx-auto px-3 md:px-4'>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (user === null) {
      return <div className="p-20 text-center">User not found</div>;
  }

  return (
    <div className='min-h-screen pt-4 md:pt-6 pb-8 bg-background'>
      <div className='container max-w-4xl mx-auto px-3 md:px-4'>
        <AppBreadcrumbs />
        {/* Header */}
        <div className='mb-5 md:mb-8'>
              <Link href='/account' className="text-xs md:text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground mb-2 transition-colors">
                 <ArrowLeft className='h-3.5 w-3.5' /> Back to Account
              </Link>
              <h1 className='text-lg md:text-2xl font-black tracking-tighter text-foreground'>
                Edit Profile
              </h1>
              <p className='text-muted-foreground text-xs md:text-sm font-medium'>
                Manage your public profile and preferences
              </p>
        </div>

        <Card className="border-border shadow-sm bg-card overflow-hidden rounded-2xl md:rounded-3xl">
            <CardHeader className="sr-only">
               <CardTitle>Edit Profile Form</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4 md:p-6 lg:p-8">
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