'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Star, Map, Filter, MapPin } from 'lucide-react';
import { feedbackService } from '@/lib/services/feedback';

// Dynamically import the map component to avoid SSR issues with Leaflet
const ExploreMapWithNoSSR = dynamic(() => import('@/components/ui/explore-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <Map className="h-8 w-8 text-gray-400" />
    </div>
  ),
});

interface Space {
  space_id: string;
  name: string;
  space_type: string;
  latitude: number;
  longitude: number;
  address?: string;
  avg_rating: number;
  total_feedback_count: number;
  last_feedback_at: string | null;
}

export default function ExplorePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRating, setSelectedRating] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 6.079565868771222, lng: 80.19253173040384 });
  const [mapZoom, setMapZoom] = useState(13);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get('lat') || '');
    const lng = parseFloat(params.get('lng') || '');
    const zoom = parseInt(params.get('zoom') || '13');

    if (!isNaN(lat) && !isNaN(lng)) {
      setMapCenter({ lat, lng });
    }
    if (!isNaN(zoom)) {
      setMapZoom(zoom);
    }
  }, []);

  // Load spaces data
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

  // Filter spaces based on search, type, and rating
  useEffect(() => {
    let filtered = spaces;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(space => 
        space.name.toLowerCase().includes(query) ||
        space.address?.toLowerCase().includes(query) ||
        space.space_type.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(space => 
        space.space_type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filter by minimum rating
    if (selectedRating > 0) {
      filtered = filtered.filter(space => 
        Number(space.avg_rating) >= selectedRating
      );
    }

    setFilteredSpaces(filtered);
  }, [searchQuery, selectedType, selectedRating, spaces]);

  // Get unique space types for filter
  const spaceTypes = ['all', ...new Set(spaces.map(space => space.space_type))];

  const getSpaceMarkers = () => {
    return filteredSpaces.map(space => ({
      id: space.space_id,
      position: { lat: space.latitude, lng: space.longitude },
      popup: `
        <div class="text-sm">
          <div class="font-semibold">${space.name}</div>
          <div class="text-gray-600">${space.space_type}</div>
          <div class="mt-1">
            ${Number(space.avg_rating).toFixed(1)} ⭐ (${space.total_feedback_count} reviews)
          </div>
        </div>
      `,
      tooltip: space.name
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Public Spaces</h1>
        <p className="text-gray-600">
          Discover and explore public spaces in your area with community feedback
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm"
            >
              {spaceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-gray-500" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              className="flex-1 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
              <option value={2}>2+ Stars</option>
              <option value={1}>1+ Stars</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <div className="h-[600px]">
          <ExploreMapWithNoSSR
            onMarkerClick={(marker) => {
              // Handle marker click - could navigate to detail view
              console.log('Marker clicked:', marker);
            }}
            markers={getSpaceMarkers()}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </Card>

      {filteredSpaces.length === 0 && !isLoading && (
        <Card className="mt-8 p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No spaces found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query
          </p>
        </Card>
      )}
    </div>
  );
}
