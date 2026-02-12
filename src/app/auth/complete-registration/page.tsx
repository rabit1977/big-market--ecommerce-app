import { CompleteRegistrationForm } from '@/components/auth/complete-registration-form';
import { Metadata } from 'next';

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: 'Complete Registration',
};

export default async function CompleteRegistrationPage() {
    const session = await auth();

    // Double check to prevent accessing this page if already complete
    if (session?.user?.registrationComplete) {
       // Ideally redirect, but middleware handles most routing
    //    redirect('/'); 
    }

    return (
        <div className="container max-w-lg mx-auto py-10">
            <CompleteRegistrationForm />
        </div>
    );
}
