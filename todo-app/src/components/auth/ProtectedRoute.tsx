// src/components/auth/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Component to show while checking auth status
}

export default function ProtectedRoute({
  children,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-lg text-muted-foreground">Checking authentication status...</p>
      </div>
    </div>
  )
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth status
  if (isLoading) {
    return fallback;
  }

  // Show redirecting message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render the protected content if authenticated
  return <>{children}</>;
}