import { API_CONFIG } from '../config';
import { getSession } from 'next-auth/react';

interface FeedbackLocation {
  coordinates: {
    lat: number;
    lng: number;
  };
  spaceType: string;
  name?: string;
  address?: string;
  description?: string;
}

interface FeedbackSubmission {
  location: FeedbackLocation;
  rating: number;
  issues?: string[];
  comments?: string;
}

export class FeedbackService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/feedback`;

  async submitFeedback(feedback: FeedbackSubmission): Promise<void> {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('Please sign in to submit feedback');
      }

      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).token}` // Add JWT token
        },
        credentials: 'include',
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  async getFeedbackCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback categories:', error);
      throw error;
    }
  }

  async getSpaceFeedback(spaceId: string, limit = 10, offset = 0): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/space/${spaceId}?limit=${limit}&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch space feedback');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching space feedback:', error);
      throw error;
    }
  }

  async getSpaceByLocation(lat: number, lng: number, type: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/space-by-location?lat=${lat}&lng=${lng}&type=${type}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch space information');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching space:', error);
      throw error;
    }
  }

  async getSpaces(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces`);
      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }
  }

  async getAllFeedback(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/all`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch all feedback');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  }

  async getAdminStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/stats`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();
