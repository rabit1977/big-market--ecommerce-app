import { AuthForm } from '@/components/auth/auth-form';
import { ReverseAuthGuard } from '@/components/auth/ReverseAuthGuard';

export const metadata = {
  title: 'Sign Up | Biggest Market',
  description: 'Create an account on Biggest Market to start buying and selling.',
};

export default function SignupPage() {
  return (
    <ReverseAuthGuard redirectTo='/'>
      <AuthForm initialMode="signup" />
    </ReverseAuthGuard>
  );
}
