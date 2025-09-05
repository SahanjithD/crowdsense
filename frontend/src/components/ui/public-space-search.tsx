'use client';

import { useState } from 'react';
import { Input } from './input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { feedbackService } from '@/lib/services/feedback';

export function LocationSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const spaces = await feedbackService.getSpaces();
      
      // Filter spaces by name, city, or address
      const query = searchQuery.trim().toLowerCase();
      const filtered = spaces.filter(space => {
        return (
          (space.name && space.name.toLowerCase().includes(query)) ||
          (space.city && space.city.toLowerCase().includes(query)) ||
          (space.address && space.address.toLowerCase().includes(query))
        );
      });

      if (filtered.length === 0) {
        setSearchError('No public spaces found');
      }
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching spaces:', error);
      setSearchError('Error searching spaces');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (space: any) => {
    // Navigate to explore page centered on the selected space
    router.push(`/explore?lat=${space.latitude}&lng=${space.longitude}&zoom=17`);
    setSearchResults([]); // Clear results after selection
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) {
              setSearchResults([]);
              setSearchError('');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search nearby public spaces..."
          className="pl-11 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
        />
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {searchResults.map((space, index) => (
            <button
              key={space.space_id || index}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectResult(space)}
            >
              <div className="font-medium text-gray-900">{space.name}</div>
              <div className="text-sm text-gray-500">
                {space.space_type} • {Number(space.avg_rating).toFixed(1)} ⭐ ({space.total_feedback_count} reviews)
              </div>
              {space.address && (
                <div className="text-sm text-gray-500 truncate mt-1">
                  {space.address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {searchError && (
        <div className="absolute mt-1 w-full text-center p-2 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-sm text-red-500">{searchError}</p>
        </div>
      )}
    </div>
  );
}
