'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPicker } from './map-picker';

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
  const fetchLocationDetails = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      
      // Extract relevant information from the response
      const address = data.address;
      const city = address.city || address.town || address.village || '';
      const fullAddress = data.display_name || '';
      
      // Update the form with the fetched data
      onChange({
        ...value,
        coordinates: { lat, lng },
        city,
        address: fullAddress,
        // Only update these fields if they're not already set by the user
        ...(!value.name && { name: address.amenity || address.building || '' }),
        landmark: address.landmark || address.near || ''
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
      // Still update coordinates even if geocoding fails
      onChange({ ...value, coordinates: { lat, lng } });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleMapSelect = (coordinates: { lat: number; lng: number }) => {
    fetchLocationDetails(coordinates.lat, coordinates.lng);
  };

  const handleFieldChange = (
    field: keyof LocationData,
    fieldValue: LocationData[keyof LocationData]
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Picker */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Click on the map to select location
        </h3>
        <MapPicker 
          onLocationSelect={handleMapSelect}
          defaultCenter={value.coordinates}
        />
        {value.coordinates && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected coordinates: {value.coordinates.lat.toFixed(6)}, {value.coordinates.lng.toFixed(6)}
            </p>
            {isLoadingAddress && (
              <p className="text-sm text-blue-600 mt-1">
                Fetching address details...
              </p>
            )}
          </div>
        )}
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
