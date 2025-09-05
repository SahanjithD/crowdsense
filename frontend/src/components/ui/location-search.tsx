'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './input';
import { Search } from 'lucide-react';
import { geocodingService } from '@/lib/services/geocoding';

export interface LocationSearchResult {
  name: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function LocationSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of the search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const locations = await geocodingService.searchLocation(query);
      setResults(locations);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    }
  };

  // Handle location selection
  const handleSelectLocation = (location: LocationSearchResult) => {
    setSearchQuery(location.name);
    setShowResults(false);
    
    // Navigate to explore page with location parameters
    router.push(`/explore?lat=${location.coordinates.lat}&lng=${location.coordinates.lng}&zoom=15`);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input 
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search nearby public spaces..."
          className="pl-11 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleSelectLocation(result)}
            >
              <div className="font-medium text-gray-900">{result.name}</div>
              {result.address && (
                <div className="text-sm text-gray-500 truncate">{result.address}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
