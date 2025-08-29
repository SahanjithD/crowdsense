'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPicker } from './map-picker';
import { feedbackService } from '@/lib/services/feedback';

interface Location {
  lat: number;
  lng: number;
}

interface LocationData {
  coordinates?: {
    lat: number;
    lng: number;
  };
  name: string;
  spaceType: 'toilet' | 'park' | 'station' | 'bus_stop' | 'mall' | 'other';
  city: string;
  address?: string;
  description?: string;
  landmark?: string;
  metadata?: {
    operatingHours?: {
      [key: string]: { open: string; close: string };
    };
    facilities?: string[];
    contactInfo?: {
      phone?: string;
      website?: string;
    };
  };
}

interface CombinedLocationInputProps {
  value: Partial<LocationData>;
  onChange: (location: Partial<LocationData>) => void;
  className?: string;
}

// Space types from database schema
const SPACE_TYPES = [
  { value: 'toilet', label: 'Public Toilet' },
  { value: 'park', label: 'Park' },
  { value: 'station', label: 'Station' },
  { value: 'bus_stop', label: 'Bus Stop' },
  { value: 'mall', label: 'Shopping Mall' },
  { value: 'other', label: 'Other' }
];

export function CombinedLocationInput({ value, onChange, className = '' }: CombinedLocationInputProps) {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [existingSpaces, setExistingSpaces] = useState<any[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Load existing spaces when component mounts
  useEffect(() => {
    const loadSpaces = async () => {
      setIsLoadingSpaces(true);
      try {
        const spaces = await feedbackService.getSpaces();
        setExistingSpaces(spaces);
      } catch (error) {
        console.error('Error loading existing spaces:', error);
      } finally {
        setIsLoadingSpaces(false);
      }
    };

    loadSpaces();
  }, []);
  const fetchLocationDetails = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      
      // Extract relevant information from the response
      const address = data.address;
      const city = address.city || address.town || address.village || address.county || address.state || '';
      const fullAddress = data.display_name || '';
      
      // Update the form with the fetched data while preserving existing values
      onChange({
        ...value,
        coordinates: { lat, lng },
        city: value.city || city, // Keep existing city if present
        address: value.address || fullAddress, // Keep existing address if present
        // Keep other existing values
        name: value.name || address.amenity || address.building || '',
        spaceType: value.spaceType as LocationData['spaceType'],
        landmark: value.landmark || address.landmark || address.near || '',
        description: value.description // Preserve existing description
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
      // Still update coordinates even if geocoding fails
      onChange({ ...value, coordinates: { lat, lng } });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search term');
      return;
    }
    setIsSearching(true);
    setSearchError('');

    // Filter existingSpaces by name, city, or address
    const query = searchQuery.trim().toLowerCase();
    const filtered = existingSpaces.filter(space => {
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
    setIsSearching(false);
  };

  const handleMapSelect = (coordinates: { lat: number; lng: number }) => {
    fetchLocationDetails(coordinates.lat, coordinates.lng);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSelectSearchResult = async (space: any) => {
    const coordinates = {
      lat: Number(space.latitude),
      lng: Number(space.longitude)
    };
    setSelectedLocation(coordinates);

    // Use the same logic as onSpaceClick
    const spaceDetails = {
      ...value,
      coordinates,
      name: space.name,
      spaceType: space.space_type as LocationData['spaceType'],
      description: space.total_feedback_count > 0 
        ? `Existing space with ${space.total_feedback_count} feedback${space.total_feedback_count !== 1 ? 's' : ''} and average rating of ${Number(space.avg_rating).toFixed(1)}`
        : 'Existing space with no feedback yet'
    };

    const preservedName = space.name;
    const preservedType = space.space_type;

    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
      );
      const data = await response.json();
      
      // Extract relevant information from the response
      const address = data.address;
      const city = address.city || address.town || address.village || '';
      const fullAddress = data.display_name || '';
      
      // Update with both space details and address information
      onChange({
        ...spaceDetails,
        coordinates,
        city,
        address: fullAddress,
        name: preservedName,
        spaceType: preservedType as LocationData['spaceType'],
        landmark: address.landmark || address.near || ''
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
      // If geocoding fails, at least preserve the space details
      onChange(spaceDetails);
    } finally {
      setIsLoadingAddress(false);
      setSearchResults([]); // Clear results after selection
    }
  };

  const handleFieldChange = (
    field: keyof LocationData,
    fieldValue: LocationData[keyof LocationData]
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Picker and Search */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative" style={{ zIndex: 1000 }}>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for a location..."
                className="flex-1"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) {
                    setSearchResults([]);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button 
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-red-500 mt-2">{searchError}</p>
            )}
            
            {/* Search Results List */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-[300px] overflow-auto border border-gray-200">
                {searchResults.map((space, index) => (
                  <button
                    key={space.space_id || index}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectSearchResult(space)}
                  >
                    <p className="font-medium text-sm text-gray-800">{space.name}</p>
                    <p className="text-xs text-gray-500">
                      {space.city || ''} {space.address ? `- ${space.address}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Type: {space.space_type} | Rating: {Number(space.avg_rating).toFixed(1)} ⭐ ({space.total_feedback_count || 0} reviews)
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium text-gray-700">
            Click on the map to select location or search above
          </h3>
          {isLoadingSpaces ? (
            <div className="flex items-center justify-center h-[400px] bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading spaces...</p>
              </div>
            </div>
          ) : (
            <MapPicker 
            onLocationSelect={handleMapSelect}
            defaultCenter={value.coordinates}
            selectedLocation={selectedLocation || undefined}
            existingSpaces={existingSpaces}
            onSpaceClick={async (space) => {
              // First update with the known space details
              // Transform coordinates to match LocationData interface
              const coordinates = {
                lat: Number(space.latitude),
                lng: Number(space.longitude)
              };
              
              setSelectedLocation(coordinates);

              const spaceDetails = {
                ...value,
                coordinates,
                name: space.name,
                spaceType: space.space_type as LocationData['spaceType'],
                description: space.total_feedback_count > 0 
                  ? `Existing space with ${space.total_feedback_count} feedback${space.total_feedback_count !== 1 ? 's' : ''} and average rating of ${Number(space.avg_rating).toFixed(1)}`
                  : 'Existing space with no feedback yet'
              };

              // Store these values to preserve them
              const preservedName = space.name;
              const preservedType = space.space_type;

              setIsLoadingAddress(true);
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
                );
                const data = await response.json();
                
                // Extract relevant information from the response
                const address = data.address;
                const city = address.city || address.town || address.village || '';
                const fullAddress = data.display_name || '';
                
                // Update with both space details and address information
                onChange({
                  ...spaceDetails,
                  coordinates, // Ensure we're using the properly formatted coordinates
                  city,
                  address: fullAddress,
                  name: preservedName,
                  spaceType: preservedType as LocationData['spaceType'],
                  landmark: address.landmark || address.near || ''
                });
              } catch (error) {
                console.error('Error fetching location details:', error);
                // If geocoding fails, at least preserve the space details
                onChange(spaceDetails);
              } finally {
                setIsLoadingAddress(false);
              }
            }}
          />
        )}
          {value.coordinates && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Selected coordinates: {Number(value.coordinates.lat).toFixed(6)}, {Number(value.coordinates.lng).toFixed(6)}
              </p>
              {isLoadingAddress && (
                <p className="text-sm text-blue-600 mt-1">
                  Fetching address details...
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Location Details Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Location Name*
            </label>
            <Input
              id="name"
              value={value.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Enter specific location name"
              required
            />
          </div>

          <div>
            <label htmlFor="spaceType" className="block text-sm font-medium text-gray-700 mb-1">
              Space Type*
            </label>
            <select
              id="spaceType"
              value={value.spaceType || ''}
              onChange={(e) => handleFieldChange('spaceType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a space type</option>
              {SPACE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>


          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City/Area*
            </label>
            <Input
              id="city"
              value={value.city || ''}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder="Enter city or area"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <Input
              id="address"
              value={value.address || ''}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
              Nearest Landmark (Optional)
            </label>
            <Input
              id="landmark"
              value={value.landmark || ''}
              onChange={(e) => handleFieldChange('landmark', e.target.value)}
              placeholder="Enter a nearby landmark"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={value.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Provide additional details about this location"
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
            />
          </div>

          {/* Optional Metadata Section */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h4>
            
            {/* Operating Hours - Can be expanded later */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facilities Available (Optional)
              </label>
              <div className="space-x-2">
                {['Parking', 'Wheelchair Access', 'Restrooms', 'WiFi'].map(facility => (
                  <label key={facility} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        const facilities = value.metadata?.facilities || [];
                        const newFacilities = e.target.checked
                          ? [...facilities, facility.toLowerCase()]
                          : facilities.filter(f => f !== facility.toLowerCase());
                        handleFieldChange('metadata', {
                          ...value.metadata,
                          facilities: newFacilities
                        });
                      }}
                      checked={value.metadata?.facilities?.includes(facility.toLowerCase()) || false}
                    />
                    <span className="ml-2 text-sm text-gray-600">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone (Optional)
                </label>
                <Input
                  id="phone"
                  value={value.metadata?.contactInfo?.phone || ''}
                  onChange={(e) => handleFieldChange('metadata', {
                    ...value.metadata,
                    contactInfo: {
                      ...value.metadata?.contactInfo,
                      phone: e.target.value
                    }
                  })}
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website (Optional)
                </label>
                <Input
                  id="website"
                  value={value.metadata?.contactInfo?.website || ''}
                  onChange={(e) => handleFieldChange('metadata', {
                    ...value.metadata,
                    contactInfo: {
                      ...value.metadata?.contactInfo,
                      website: e.target.value
                    }
                  })}
                  placeholder="Enter website URL"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
