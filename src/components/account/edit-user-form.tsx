'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ALL_MUNICIPALITIES, MACEDONIA_CITIES } from '@/lib/constants/locations';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Loader2, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

/**
 * Enhanced profile schema with all new fields from design
 */
const editProfileSchema = z.object({
  name: z.string().min(2).max(50),
  accountType: z.enum(['PERSON', 'COMPANY']),
  companyName: z.string().optional(),
  bio: z.string().max(500).optional(),
  city: z.string().optional(),
  municipality: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  image: z.string().optional(),
  banner: z.string().optional(),
  phone: z.string().max(20).optional(),
  hasWhatsapp: z.boolean().default(false),
  hasViber: z.boolean().default(false),
  email: z.string().email().optional(),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: any;
  onSubmit: (values: EditProfileFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];


export function EditProfileForm({
  user,
  onSubmit,
  isSubmitting,
}: EditProfileFormProps) {
  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema) as any,
    defaultValues: {
      name: user?.name || '',
      accountType: user?.accountType || 'PERSON',
      companyName: user?.companyName || '',
      city: user?.city || '',
      municipality: user?.municipality || '',
      address: user?.address || '',
      postalCode: user?.postalCode || '',
      bio: user?.bio || '',
      image: user?.image || '',
      banner: user?.banner || '',
      phone: user?.phone || '',
      hasWhatsapp: user?.hasWhatsapp || false,
      hasViber: user?.hasViber || false,
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth 
        ? (typeof user.dateOfBirth === 'string' ? new Date(user.dateOfBirth) : user.dateOfBirth) 
        : null,
      gender: (user?.gender as any) || '',
    },
  });

  const accountType = form.watch('accountType');

  const bannerInputRef = useState<HTMLInputElement | null>(null);
  const logoInputRef = useState<HTMLInputElement | null>(null);

  const [bannerProgress, setBannerProgress] = useState<number | null>(null);
  const [avatarProgress, setAvatarProgress] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'banner' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large (max 5MB)');
        return;
    }

    const setProgress = fieldName === 'banner' ? setBannerProgress : setAvatarProgress;
    
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<{ success: boolean; url?: string }>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      const data = await uploadPromise;
      if (data.success && data.url) {
        form.setValue(fieldName, data.url, { shouldDirty: true });
        toast.success(`${fieldName === 'banner' ? 'Banner' : 'Avatar'} uploaded`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setProgress(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 md:space-y-6 p-3 md:p-0'>
        
        {/* Banner & Logo Section */}
        <div className="space-y-0">
              {/* Banner Upload */}
              <div 
                 className="relative w-full h-28 md:h-36 bg-muted rounded-xl overflow-hidden border border-dashed border-border group hover:border-primary/50 transition-colors cursor-pointer"
                 onClick={() => document.getElementById('banner-upload')?.click()}
              >
                  {form.watch('banner') ? (
                      <Image src={form.watch('banner')!} alt="Banner" fill className="object-cover" />
                  ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-1.5">
                          <Camera className="w-5 h-5 md:w-6 md:h-6 opacity-40" />
                          <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest opacity-60">Banner (1200 × 300px)</span>
                      </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  
                  {/* Banner Progress Overlay */}
                  <AnimatePresence>
                    {bannerProgress !== null && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20"
                        >
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/30" />
                                    <motion.circle 
                                        cx="50%" cy="50%" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                        strokeDasharray="175.8" initial={{ strokeDashoffset: 175.8 }}
                                        animate={{ strokeDashoffset: 175.8 - (175.8 * bannerProgress) / 100 }}
                                        className="text-primary transition-all duration-300" 
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{Math.round(bannerProgress)}%</span>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <input 
                     id="banner-upload"
                     type="file" 
                     className="hidden" 
                     accept="image/*"
                     onChange={(e) => handleFileChange(e, 'banner')}
                  />
              </div>

              {/* Logo / Avatar Upload */}
              <div 
                  className="relative -mt-10 md:-mt-12 ml-4 md:ml-6 w-20 h-20 md:w-24 md:h-24 bg-card rounded-xl shadow-lg border-2 border-background p-0.5 z-10 cursor-pointer group overflow-hidden"
                  onClick={() => document.getElementById('logo-upload')?.click()}
              >
                  <div className="w-full h-full rounded-lg overflow-hidden relative">
                    {form.watch('image') ? (
                        <Image src={form.watch('image')!} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-inner">
                           {form.watch('name')?.slice(0, 2).toUpperCase() || 'US'}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Avatar Progress Overlay */}
                  <AnimatePresence>
                    {avatarProgress !== null && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20"
                        >
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-muted/30" />
                                    <motion.circle 
                                        cx="50%" cy="50%" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" 
                                        strokeDasharray="125.6" initial={{ strokeDashoffset: 125.6 }}
                                        animate={{ strokeDashoffset: 125.6 - (125.6 * avatarProgress) / 100 }}
                                        className="text-primary transition-all duration-300" 
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{Math.round(avatarProgress)}%</span>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  <input 
                     id="logo-upload"
                     type="file" 
                     className="hidden" 
                     accept="image/*"
                     onChange={(e) => handleFileChange(e, 'image')}
                  />
              </div>
        </div>

        {/* Account Type Toggle */}
        <div className="flex p-0.5 bg-muted rounded-lg w-full max-w-xs mx-auto relative h-8 md:h-9">
            <div 
                className={cn(
                    "absolute top-0.5 bottom-0.5 w-1/2 bg-card rounded-md shadow-sm transition-transform duration-300 ease-in-out",
                    accountType === 'COMPANY' ? "translate-x-full" : "translate-x-0"
                )} 
            />
            <button
                type="button"
                className={cn("flex-1 relative z-10 text-[10px] md:text-xs font-bold transition-colors text-center", accountType === 'PERSON' ? "text-primary" : "text-muted-foreground")}
                onClick={() => form.setValue('accountType', 'PERSON')}
            >
                Person
            </button>
            <button
                type="button"
                className={cn("flex-1 relative z-10 text-[10px] md:text-xs font-bold transition-colors text-center", accountType === 'COMPANY' ? "text-primary" : "text-muted-foreground")}
                onClick={() => form.setValue('accountType', 'COMPANY')}
            >
                Company
            </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 md:space-y-4">
            
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder={accountType === 'COMPANY' ? 'Company Name' : 'Full Name'} {...field} className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg focus:ring-primary/20" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Phone & Apps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Your Phone</FormLabel>
                          <FormControl>
                            <Input placeholder='07x xxx xxx' {...field} className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg" />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="flex items-end pb-2 gap-2">
                    <FormField
                        control={form.control}
                        name="hasWhatsapp"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <div 
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors border",
                                            field.value ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400" : "bg-muted border-border text-muted-foreground/30 hover:border-green-300"
                                        )}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hasViber"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-1.5 space-y-0">
                                <FormControl>
                                    <div 
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors border",
                                            field.value ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground/30 hover:border-primary/50"
                                        )}
                                    >
                                        <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Email (Read Only) */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Your E-Mail</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="h-9 md:h-10 text-xs md:text-sm bg-muted/50 border-border rounded-lg text-muted-foreground opacity-70" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Address & Postal Code - side by side on mobile */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Address</FormLabel>
                      <FormControl>
                        <Input placeholder='Street address' {...field} className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder='1000' {...field} className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
            </div>

            {/* Location & Municipality */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                 <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">City</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[250px]">
                           {MACEDONIA_CITIES.map(c => (
                               <SelectItem key={c} value={c}>{c}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='municipality'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[9px] md:text-[10px] tracking-wider">Municipality</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm bg-muted border-border rounded-lg">
                            <SelectValue placeholder="Select Municipality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[250px]">
                           {ALL_MUNICIPALITIES.map(m => (
                               <SelectItem key={m} value={m}>{m}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
            </div>

        </div>

        <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-9 md:h-10 text-xs md:text-sm font-bold rounded-lg bg-primary hover:bg-primary/90'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-3.5 w-3.5 mr-1.5 animate-spin' />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
        </Button>
      </form>
    </Form>
  );
}