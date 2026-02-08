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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  image: z.string().optional(), // Logo
  banner: z.string().optional(), // Banner
  phone: z.string().max(20).optional(),
  hasWhatsapp: z.boolean().default(false),
  hasViber: z.boolean().default(false),
  email: z.string().email().optional(), // Read-only typically but good to have in form state
  dateOfBirth: z.date().optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: any; // Using any for flexibility with new fields, ideally typed properly
  onSubmit: (values: EditProfileFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const MUNICIPALITIES = [
    "Aerodrom", "Centar", "Karpos", "Kisela Voda", "Gazi Baba", "Butel", "Chair", "Gjorce Petrov", "Saraj", "Suto Orizari"
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

  // File Input Refs
  const bannerInputRef = useState<HTMLInputElement | null>(null);
  const logoInputRef = useState<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'banner' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // You might want to pass error handling or toast here, but simple alert for now or ignore
        return; 
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(fieldName, reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        
        {/* Banner & Logo Section */}
        <div className="space-y-4">
             {/* Banner Upload */}
             <div 
                className="relative w-full h-48 bg-muted rounded-xl overflow-hidden border border-dashed border-border group hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('banner-upload')?.click()}
             >
                 {form.watch('banner') ? (
                     <Image src={form.watch('banner')!} alt="Banner" fill className="object-cover" />
                 ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                         <Camera className="w-8 h-8 opacity-50" />
                         <span className="text-xs uppercase font-bold tracking-wider">Banner (1200 x 300px)</span>
                     </div>
                 )}
                 <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                 <input 
                    id="banner-upload"
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'banner')}
                 />
             </div>

             {/* Logo / Initials - Overlapping, Static (No Upload) */}
             <div className="relative -mt-16 ml-8 w-32 h-32 bg-card rounded-xl shadow-lg border border-border p-1 z-10">
                 <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center text-white text-4xl font-black shadow-inner">
                    {form.watch('name')?.slice(0, 2).toUpperCase() || 'US'}
                 </div>
             </div>
        </div>

        {/* Account Type Toggle */}
        <div className="flex p-1 bg-muted rounded-xl w-full max-w-md mx-auto relative">
            <div 
                className={cn(
                    "absolute top-1 bottom-1 w-1/2 bg-card rounded-lg shadow-sm transition-transform duration-300 ease-in-out",
                    accountType === 'COMPANY' ? "translate-x-full" : "translate-x-0"
                )} 
            />
            <button
                type="button"
                className={cn("flex-1 relative z-10 py-2 text-sm font-bold transition-colors text-center", accountType === 'PERSON' ? "text-primary" : "text-muted-foreground")}
                onClick={() => form.setValue('accountType', 'PERSON')}
            >
                Person
            </button>
            <button
                type="button"
                className={cn("flex-1 relative z-10 py-2 text-sm font-bold transition-colors text-center", accountType === 'COMPANY' ? "text-primary" : "text-muted-foreground")}
                onClick={() => form.setValue('accountType', 'COMPANY')}
            >
                Company
            </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
            
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-black uppercase text-[10px] tracking-wider">Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder={accountType === 'COMPANY' ? 'Company Name' : 'Full Name'} {...field} className="h-12 bg-muted border-border rounded-xl focus:ring-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone & Apps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-black uppercase text-[10px] tracking-wider">Your Phone</FormLabel>
                          <FormControl>
                            <Input placeholder='07x xxx xxx' {...field} className="h-12 bg-muted border-border rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="flex items-end pb-3 gap-3">
                    <FormField
                        control={form.control}
                        name="hasWhatsapp"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <div 
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors border",
                                            field.value ? "bg-green-100 border-green-500 text-green-600" : "bg-gray-50 border-gray-200 text-gray-300 hover:border-green-300"
                                        )}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hasViber"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <div 
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors border",
                                            field.value ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground/30 hover:border-primary/50"
                                        )}
                                    >
                                        <Phone className="w-5 h-5" />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Email (Read Only style) */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-black uppercase text-[10px] tracking-wider">Your E-Mail</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="h-12 bg-muted/50 border-border rounded-xl text-muted-foreground opacity-70" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Address' {...field} className="h-12 bg-muted border-border rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Postal code' {...field} className="h-12 bg-muted border-border rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location & Municipality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[10px] tracking-wider">Select Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted border-border rounded-xl">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="skopje">Skopje</SelectItem>
                           <SelectItem value="bitola">Bitola</SelectItem>
                           <SelectItem value="kumanovo">Kumanovo</SelectItem>
                           <SelectItem value="ohrid">Ohrid</SelectItem>
                           <SelectItem value="tetovo">Tetovo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='municipality'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-black uppercase text-[10px] tracking-wider">Select Municipality</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted border-border rounded-xl">
                            <SelectValue placeholder="Select Municipality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {MUNICIPALITIES.map(m => (
                               <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

        </div>

        <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-12 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
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