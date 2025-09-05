'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { feedbackService } from '@/lib/services/feedback';

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpaces, setFilteredSpaces] = useState<any[]>([]);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const data = await feedbackService.getSpaces();
        setSpaces(data);
        setFilteredSpaces(data);
      } catch (error) {
        console.error('Error loading spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpaces();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = spaces.filter(space => 
      space.name.toLowerCase().includes(query) ||
      space.space_type.toLowerCase().includes(query) ||
      (space.address && space.address.toLowerCase().includes(query))
    );
    setFilteredSpaces(filtered);
  }, [searchQuery, spaces]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Spaces</h1>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md"
          />
        </div>
      </Card>

      {/* Spaces List */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSpaces.map((space) => (
                <tr key={space.space_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{space.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{space.space_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{space.address || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {space.avg_rating ? `${Number(space.avg_rating).toFixed(1)} ⭐` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{space.total_feedback_count || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
