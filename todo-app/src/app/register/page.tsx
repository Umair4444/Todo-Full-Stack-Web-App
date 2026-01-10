// src/app/register/page.tsx
'use client';

import RegistrationForm from '@/components/auth/RegistrationForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;