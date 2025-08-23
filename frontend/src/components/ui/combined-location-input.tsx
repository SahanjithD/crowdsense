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
  district: string;
  city: string;
  name: string;
  landmark?: string;
}

interface CombinedLocationInputProps {
  value: Partial<LocationData>;
  onChange: (location: Partial<LocationData>) => void;
  className?: string;
}

// Sri Lankan districts
const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export function CombinedLocationInput({ value, onChange, className = '' }: CombinedLocationInputProps) {
  const handleMapSelect = (coordinates: { lat: number; lng: number }) => {
    onChange({ ...value, coordinates });
  };

  const handleFieldChange = (field: keyof LocationData, fieldValue: string) => {
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
          <p className="mt-2 text-sm text-gray-600">
            Selected coordinates: {value.coordinates.lat.toFixed(6)}, {value.coordinates.lng.toFixed(6)}
          </p>
        )}
      </Card>

      {/* Location Details Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              District*
            </label>
            <select
              id="district"
              value={value.district || ''}
              onChange={(e) => handleFieldChange('district', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a district</option>
              {DISTRICTS.map(district => (
                <option key={district} value={district}>{district}</option>
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
        </div>
      </Card>
    </div>
  );
}
