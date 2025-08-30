'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Admin Layout - Session:', session);
    console.log('Admin Layout - Status:', status);
    
    // Only redirect if explicitly unauthenticated
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render admin content if user is authenticated and is an admin
  if (session?.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Admin Sidebar */}
          <div className="w-64 min-h-screen bg-white shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
            </div>
            <nav className="mt-4">
              <a
                href="/admin"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Overview
              </a>
              <a
                href="/admin/spaces"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Manage Spaces
              </a>
              <a
                href="/admin/feedback"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Review Feedback
              </a>
              <a
                href="/admin/users"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                User Management
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
