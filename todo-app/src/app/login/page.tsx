// src/app/login/page.tsx
'use client';

import LoginForm from '@/components/auth/LoginForm';
import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';

const LoginPage = () => {
  return (
    <RedirectIfAuthenticated redirectTo="/">
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                By signing in, you agree to our{' '}
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
      </MainLayout>
    </RedirectIfAuthenticated>
  );
};

export default LoginPage;