import { AuthForm } from '@/components/auth/auth-form';
import { ReverseAuthGuard } from '@/components/auth/ReverseAuthGuard';

export const metadata = {
  title: 'Sign Up | Big Market',
  description: 'Create an account on Big Market to start buying and selling.',
};

export default function SignupPage() {
  return (
    <ReverseAuthGuard redirectTo='/'>
      <AuthForm initialMode="signup" />
    </ReverseAuthGuard>
  );
}
