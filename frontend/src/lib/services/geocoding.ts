import { API_CONFIG } from '../config';
import { LocationSearchResult } from '@/components/ui/location-search';

class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org';

  async searchLocation(query: string): Promise<LocationSearchResult[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location results');
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        name: item.display_name.split(',')[0],
        address: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `${this.apiUrl}/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }
}

export const geocodingService = new GeocodingService();
