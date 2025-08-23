'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to signin page if not authenticated
      router.push('/signin');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
