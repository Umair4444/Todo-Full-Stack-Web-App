// src/components/auth/RedirectIfAuthenticated.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
  redirectTo?: string; // Path to redirect to if user is authenticated (default: '/')
  fallback?: ReactNode; // Component to show while checking auth status
}

export default function RedirectIfAuthenticated({
  children,
  redirectTo = '/',
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-muted-foreground">Checking authentication status...</p>
      </div>
    </div>
  )
}: RedirectIfAuthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to home if user is authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking auth status
  if (isLoading) {
    return fallback;
  }

  // Show children if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show redirecting message if authenticated
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}