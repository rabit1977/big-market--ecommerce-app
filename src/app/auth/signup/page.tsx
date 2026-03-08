import { AuthForm } from '@/components/auth/auth-form';
import { ReverseAuthGuard } from '@/components/auth/ReverseAuthGuard';

import { Suspense } from 'react';

export const metadata = {
  title: 'Sign Up | PazarPlus',
  description: 'Create an account on PazarPlustart buying and selling.',
};

export default function SignupPage() {
  return (
    <ReverseAuthGuard redirectTo='/'>
      <Suspense fallback={null}>
        <AuthForm initialMode='signup' />
      </Suspense>
    </ReverseAuthGuard>
  );
}
