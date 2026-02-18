'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ALL_MUNICIPALITIES, MACEDONIA_CITIES } from '@/lib/constants/locations';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function CompleteRegistrationModal() {
  const { data: session } = useSession();

  const user = useQuery(
    api.users.getByExternalId,
    session?.user?.id ? { externalId: session.user.id } : 'skip'
  );
  const completeRegistration = useMutation(api.users.completeRegistration);

  const [city, setCity] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields and open modal once user data is available
  const needsCompletion =
    !!user && (!user.registrationComplete || !user.phone || !user.city);

  useEffect(() => {
    if (!user || !needsCompletion) return;
    if (user.city) setCity(user.city);
    if (user.phone) setPhone(user.phone);
    if (user.municipality) setMunicipality(user.municipality);
  }, [user, needsCompletion]);

  const handleSubmit = async () => {
    if (!city || !municipality || !phone) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the Terms of Use');
      return;
    }
    if (!session?.user?.id) {
      toast.error('Session expired. Please refresh.');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeRegistration({ externalId: session.user.id, city, municipality, phone });
      toast.success('Profile saved!');
      window.location.href = '/premium';
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render until we know the user needs to complete registration
  if (!needsCompletion) return null;

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Complete Registration</DialogTitle>
          <DialogDescription>
            Please enter your location and phone number to complete your registration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Select onValueChange={setCity} value={city}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {MACEDONIA_CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="municipality">Municipality</Label>
            <Select onValueChange={setMunicipality} value={municipality}>
              <SelectTrigger id="municipality">
                <SelectValue placeholder="Select Municipality" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {ALL_MUNICIPALITIES.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07x xxx xxx"
              type="tel"
              inputMode="tel"
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
            >
              I agree to the{' '}
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-4"
                target="_blank"
              >
                Terms of Use & Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary font-bold"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}