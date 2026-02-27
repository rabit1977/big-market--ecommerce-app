'use client';

import { updateStoreSettings } from '@/actions/admin/settings-actions';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface StoreSettings {
  _id: string;
  siteName: string;
  siteEmail?: string;
  sitePhone?: string;
  currency: string;
  currencySymbol: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  termsOfService?: string;
  privacyPolicy?: string;
}

const storeSettingsSchema = z.z.object({
  storeName: z.string().min(1, 'Site name is required'),
  storeEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  storePhone: z.string().optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  facebook: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  twitter: z.string().optional().or(z.literal('')),
  termsOfService: z.string().optional().or(z.literal('')),
  privacyPolicy: z.string().optional().or(z.literal('')),
});

type StoreSettingsValues = z.infer<typeof storeSettingsSchema>;

interface SettingsClientProps {
  initialData?: any;
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<StoreSettingsValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(storeSettingsSchema) as any,
    defaultValues: {
      storeName: initialData?.siteName || 'Biggest Market',
      storeEmail: initialData?.siteEmail || '',
      storePhone: initialData?.sitePhone || '',
      currency: initialData?.currency || 'MKD',
      currencySymbol: initialData?.currencySymbol || 'ден',
      facebook: initialData?.facebook || '',
      instagram: initialData?.instagram || '',
      twitter: initialData?.twitter || '',
      termsOfService: initialData?.termsOfService || '',
      privacyPolicy: initialData?.privacyPolicy || '',
    },
  });

  function onSubmit(data: StoreSettingsValues) {
    startTransition(async () => {
      try {
        const result = await updateStoreSettings(data);
        if (result.success) {
          toast.success('Store settings updated successfully');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to update settings');
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    });
  }

  return (
    <div className='flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-foreground'>Store Settings</h2>
          <p className='text-sm text-muted-foreground font-medium mt-1'>
            Manage your store preferences and configurations.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Tabs defaultValue='general' className='space-y-4 text-sm w-full'>
            <TabsList className="w-full h-auto p-2 rounded-lg border border-border bg-background grid grid-cols-3 gap-2">
              <TabsTrigger value='general' className='h-8 px-4 text-sm font-medium rounded-md data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:font-semibold'>General</TabsTrigger>
              <TabsTrigger value='social' className='h-8 px-4 text-sm font-medium rounded-md data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:font-semibold'>Social Media</TabsTrigger>
              <TabsTrigger value='policies' className='h-8 px-4 text-sm font-medium rounded-md data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:font-semibold'>Policies</TabsTrigger>
            </TabsList>

            <TabsContent value='general'>
              <Card className="rounded-lg border border-border shadow-none overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className='text-lg font-bold'>General Information</CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    Basic details about your platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='storeName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs md:text-sm'>Site Name</FormLabel>
                        <FormControl>
                          <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='Biggest Market' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='storeEmail'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Contact Email</FormLabel>
                          <FormControl>
                            <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='support@example.com' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='storePhone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Contact Phone</FormLabel>
                          <FormControl>
                            <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='+389...' {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='currency'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs md:text-sm'>Currency Code</FormLabel>
                          <FormControl>
                            <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='MKD' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='currencySymbol'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel   className='text-xs md:text-sm'>Currency Symbol</FormLabel>
                          <FormControl>
                            <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='ден' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='social'>
              <Card className="rounded-lg border border-border shadow-none overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className='text-lg font-bold'>Social Media Links</CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    Links to your official social media profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='facebook'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Facebook URL</FormLabel>
                        <FormControl>
                          <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='https://facebook.com/...' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='instagram'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Instagram URL</FormLabel>
                        <FormControl>
                          <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='https://instagram.com/...' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='twitter'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className='text-xs md:text-sm'>Twitter/X URL</FormLabel>
                        <FormControl>
                          <Input className='h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground' placeholder='https://twitter.com/...' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='policies'>
              <Card className="rounded-lg border border-border shadow-none overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className='text-lg font-bold'>Legal Policies</CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    Manage your platform terms and privacy guidelines.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='termsOfService'
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Terms of Service</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[100px] md:min-h-[150px] px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground" placeholder='Your terms...' {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='privacyPolicy'
                        render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='text-xs md:text-sm'>Privacy Policy</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[100px] md:min-h-[150px] px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground" placeholder='Your privacy policy...' {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className='flex justify-end'>
            <Button type='submit' className="rounded-lg font-bold tracking-wide shadow-none min-w-[200px]" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
