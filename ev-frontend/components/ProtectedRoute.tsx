'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/');
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading || !user || (requiredRole && user.role !== requiredRole)) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}