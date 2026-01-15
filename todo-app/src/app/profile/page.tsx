'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else {
      // Redirect to dashboard if authenticated
      router.push('/todo-app');
    }
  }, [router, isAuthenticated]);

  return null; // Render nothing since we're redirecting
}