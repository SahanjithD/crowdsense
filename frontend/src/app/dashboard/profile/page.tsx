'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface UserProfile {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/profile`,
          {
            headers: {
              'Authorization': `Bearer ${(session?.user as any).accessToken}`,
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile({
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Show error message
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50';
        toast.textContent = 'Failed to load profile. Please refresh the page.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Split the name into first and last name
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session?.user as any).accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName,
          lastName,
          email: profile.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50';
      toast.textContent = 'Profile updated successfully!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      const userData = await response.json();
      
      if (userData.error) {
        throw new Error(userData.error);
      }

      // Update local state
      setProfile({
        name: `${userData.user.first_name} ${userData.user.last_name}`,
        email: userData.user.email,
        firstName: userData.user.first_name,
        lastName: userData.user.last_name,
      });

      // Update session with new data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: `${userData.user.first_name} ${userData.user.last_name}`,
        },
      });

      setIsEditing(false);
    } catch (error) {
      // Show error message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50';
      toast.textContent = 'Failed to update profile. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and profile information.</p>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled={true}
              className="mt-1 bg-gray-50"
            />
            <p className="mt-2 text-sm text-gray-500">
              Email cannot be changed. Contact support if you need to update your email address.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="default"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setProfile({
                      name: session?.user?.name || '',
                      email: session?.user?.email || '',
                    });
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // Implement password change functionality
              const toast = document.createElement('div');
              toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded shadow-lg z-50';
              toast.textContent = 'Password change feature coming soon!';
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 3000);
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
