'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery } from 'convex/react';
import {
    ArrowLeft,
    Camera,
    Mail,
    MapPin,
    Shield
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
    <div className='space-y-6'>
      <Skeleton className='h-32 w-32 rounded-full mx-auto' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-32 w-full' />
      <Skeleton className='h-10 w-40' />
    </div>
  );
}

/**
 * Edit Profile Page Component
 * 
 * Powered by Convex for real-time updates.
 */
export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  
  // Fetch user data from Convex
  const user = useQuery(api.users.getByExternalId, { 
      externalId: session?.user?.id || '' 
  });
  
  const updateUser = useMutation(api.users.updateByExternalId);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (values: EditProfileFormValues) => {
    if (!user || !session?.user?.id) return;
    
    setIsSubmitting(true);
    try {
        let uploadedImageUrl = user.image;

        // Image Upload Logic (Mocked if needed, or real layout)
        // If there's a new image preview (base64/blob)
        if (imagePreview && imagePreview.startsWith('data:')) {
          // Convert base64 back to a blob/file to upload via our API
          const response = await fetch(imagePreview);
          const blob = await response.blob();
          const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });

          const formData = new FormData();
          formData.append('file', file);

          const uploadRes = await fetch('/api/upload', {
             method: 'POST',
             body: formData,
          });

          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            uploadedImageUrl = uploadResult.url;
          } else {
             toast.error('Failed to upload image');
             // Proceed without image update or return?
             // return; 
             // We'll continue saving other fields
          }
        }

        // Call Convex Mutation
        await updateUser({
            externalId: session.user.id,
            name: values.name,
            bio: values.bio,
            image: uploadedImageUrl,
            phone: values.phone || undefined,
            city: values.city || undefined,
            dateOfBirth: values.dateOfBirth?.toISOString(),
            gender: values.gender || undefined,
        });

        toast.success('Profile updated successfully');
          
        // Update NextAuth session (optimistic update)
        await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: values.name,
              image: uploadedImageUrl,
            },
        });
          
        setImagePreview(null);
    } catch (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (user === undefined) {
    return (
      <div className='min-h-screen pt-24 pb-12 bg-muted/10'>
        <div className='container mx-auto px-4'>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (user === null) {
      // User not found in Convex?
      return <div className="p-20 text-center">User not found</div>;
  }

  const userInitials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className='min-h-screen pt-24 pb-12 bg-muted/10'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/account'>
            <Button variant='ghost' className='mb-4 -ml-2'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Account
            </Button>
          </Link>
          
          <h1 className='text-3xl font-bold tracking-tight'>
            Edit Profile
          </h1>
          <p className='text-muted-foreground mt-2'>
            Manage your account information and preferences
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Avatar & Account Info */}
          <div className='space-y-6'>
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a photo to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col items-center'>
                  <div className='relative group'>
                    <Avatar className='h-32 w-32 border-4 border-background shadow-xl'>
                      <AvatarImage 
                        src={imagePreview || user.image} 
                        alt={user.name || 'User'} 
                        className="object-cover"
                      />
                      <AvatarFallback className='text-3xl bg-primary/10 text-primary'>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload Overlay */}
                    <label 
                      htmlFor='avatar-upload'
                      className='absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white'
                    >
                      <Camera className='h-8 w-8' />
                    </label>
                    <input
                      id='avatar-upload'
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                  </div>
                  
                  <p className='text-xs text-muted-foreground mt-4 text-center'>
                    Click to upload • Max 5MB
                  </p>
                </div>

                {imagePreview && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setImagePreview(null)}
                    className='w-full'
                  >
                    Remove Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Account Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Mail className='h-4 w-4' />
                    <span>Email</span>
                  </div>
                  <p className='font-medium truncate'>{user.email}</p>
                </div>

                <Separator />

                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Shield className='h-4 w-4' />
                    <span>Verification</span>
                  </div>
                  {user.isVerified ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Verified</Badge>
                  ) : (
                      <Badge variant="outline">Unverified</Badge>
                  )}
                </div>

                <Separator />

                <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <MapPin className='h-4 w-4' />
                        <span>Location</span>
                    </div>
                    <p className='font-medium'>{user.city || 'Not set'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and bio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditProfileForm
                  user={user as any}
                  onSubmit={handleUpdateProfile}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}