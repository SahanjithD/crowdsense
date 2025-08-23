'use client';

import { useState } from 'react';
import { Location, locationService } from '@/lib/services/location';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Sri Lankan districts
const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

interface LocationInputProps {
  value: Partial<Location>;
  onChange: (location: Partial<Location>) => void;
  className?: string;
}

export function LocationInput({ value, onChange, className = '' }: LocationInputProps) {
  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (field: keyof Location, fieldValue: string) => {
    const newLocation = {
      ...value,
      [field]: fieldValue
    };
    
    // Clear validation error when user types
    if (validationError) {
      setValidationError('');
    }

    onChange(newLocation);
  };

  const validateInput = () => {
    if (!value.name || !value.district || !value.city) {
      setValidationError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
            District*
          </label>
          <select
            id="district"
            value={value.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
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
            onChange={(e) => handleChange('city', e.target.value)}
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
            onChange={(e) => handleChange('name', e.target.value)}
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
            onChange={(e) => handleChange('landmark', e.target.value)}
            placeholder="Enter a nearby landmark"
          />
        </div>

        {validationError && (
          <p className="text-red-500 text-sm mt-2">{validationError}</p>
        )}
      </div>
    </Card>
  );
}
