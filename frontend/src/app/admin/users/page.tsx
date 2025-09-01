'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Lock, Mail } from 'lucide-react';
import { API_CONFIG } from '@/lib/config';
import { getSession } from 'next-auth/react';

interface User {
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  created_at: string;
  last_login: string;
  status: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  // Function to load users
  const loadUsers = async () => {
    try {
      const session = await getSession();
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      const session = await getSession();
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Failed to update user role');
        return;
      }

      // Refresh the users list
      await loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setUpdating(userId);
      const session = await getSession();
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Refresh the users list
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const session = await getSession();
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${(session?.user as any)?.accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={
                      user.status === 'active' ? 'border-green-500 text-green-600' :
                      user.status === 'inactive' ? 'border-gray-500 text-gray-600' :
                      'border-yellow-500 text-yellow-600'
                    }>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? formatDate(user.last_login) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                      className="mr-2 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      disabled={updating === user.user_id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={
                        user.status === 'active' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }
                      onClick={() => updateUserStatus(user.user_id, user.status === 'inactive')}
                      disabled={updating === user.user_id}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search criteria
          </div>
        )}
      </Card>
    </div>
  );
}
