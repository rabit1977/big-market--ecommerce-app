'use client';

import { completeRegistrationAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function CompleteRegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    city: '',
    municipality: '',
    phone: '',
    termsAccepted: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return;
    }

    startTransition(async () => {
      const res = await completeRegistrationAction(formData);
      if (res.success) {
        toast.success('Registration complete!');
        // Force a hard refresh to update the session
        window.location.href = '/premium'; 
      } else {
        toast.error(res.error || 'Failed to complete registration');
      }
    });
  };

  return (
    <div className='flex min-h-[80vh] items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 shadow-xl shadow-amber-500/25 mb-4'>
            <UserCheck className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-2xl font-bold text-foreground'>Final Step</h1>
          <p className='text-muted-foreground mt-1'>Please complete your profile to continue</p>
        </div>

        <div className='rounded-2xl border border-border bg-card shadow-xl overflow-hidden p-6 sm:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            
            <div className='space-y-2'>
              <Label htmlFor='city'>City</Label>
              <Input
                id='city'
                required
                placeholder='e.g. Skopje'
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='municipality'>Municipality</Label>
              <Input
                id='municipality'
                required
                placeholder='e.g. Centar'
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                disabled={isPending}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone Number</Label>
              <Input
                id='phone'
                required
                type='tel'
                placeholder='+389 70 123 456'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                required
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                disabled={isPending}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the <a href="/terms" className="text-primary hover:underline" target="_blank">terms and conditions</a> and <a href="/privacy" className="text-primary hover:underline" target="_blank">privacy policy</a>
              </label>
            </div>

            <Button
                type='submit'
                className='w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 bg-amber-500 hover:bg-amber-600'
                size='lg'
                disabled={isPending}
            >
                {isPending ? (
                <>
                    <Loader2 className='h-5 w-5 animate-spin mr-2' />
                    Saving...
                </>
                ) : (
                <>
                    <Sparkles className='h-4 w-4 mr-2' />
                    Complete Registration
                </>
                )}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}
