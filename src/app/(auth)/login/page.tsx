import { LoginForm } from '@/components/forms/login-form';
import LoginFormSkeleton from '@/components/forms/LoginFormSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton/>}>
      <LoginForm />
    </Suspense>
  );
}

export default LoginPage;
