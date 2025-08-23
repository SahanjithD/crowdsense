// Types for location data
export interface Location {
  id?: string;
  name: string;
  district: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmark?: string;
}

// Interface for location service
export interface LocationService {
  getCurrentLocation?: () => Promise<Location>;
  searchLocation?: (query: string) => Promise<Location[]>;
  validateLocation: (location: Location) => boolean;
  formatLocation: (location: Location) => string;
}

// Temporary implementation
class BasicLocationService implements LocationService {
  validateLocation(location: Location): boolean {
    return Boolean(location.name && location.district && location.city);
  }

  formatLocation(location: Location): string {
    const parts = [location.name, location.city, location.district];
    if (location.landmark) {
      parts.unshift(location.landmark);
    }
    return parts.join(', ');
  }
}

// This will be replaced with Google Maps implementation later
export const locationService = new BasicLocationService();
