'use client';

import { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { CombinedLocationInput } from '@/components/ui/combined-location-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { feedbackService } from '@/lib/services/feedback';
import { useRouter } from 'next/navigation';


interface FeedbackCategory {
  category_id: string;
  name: string;
  description: string;
  icon_url?: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<FeedbackCategory[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await feedbackService.getFeedbackCategories();
        setCategories(categories);
      } catch (err) {
        console.error('Error loading feedback categories:', err);
        setError('Failed to load feedback categories. Some features may be limited.');
      }
    };

    loadCategories();
  }, []);
  const [location, setLocation] = useState<{
    coordinates?: { lat: number; lng: number };
    city?: string;
    name?: string;
    landmark?: string;
    spaceType?: 'toilet' | 'park' | 'station' | 'bus_stop' | 'mall' | 'other';
  }>({});
  const [rating, setRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location?.coordinates || !location.spaceType) {
      alert('Please select a location and space type');
      return;
    }

    if (!rating) {
      alert('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        location: {
          coordinates: location.coordinates,
          spaceType: location.spaceType,
          name: location.name,
          address: location.city,
          description: location.landmark,
        },
        rating,
        issues: selectedIssues,
        comments
      });
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50';
      toast.textContent = 'Feedback submitted successfully!';
      document.body.appendChild(toast);
      
      // Navigate to home page after a brief delay to show the success message
      setTimeout(() => {
        toast.remove();
        router.push('/');
      }, 500);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      
      // Show error message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50';
      toast.textContent = error.message || 'Failed to submit feedback. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Report Public Space Issue</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">Location Details</h2>
          <CombinedLocationInput 
            value={location} 
            onChange={setLocation}
          />
        </div>

        <Card className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate this space
            </label>
            <div className="flex items-center">
              <Rating
                onClick={setRating}
                initialValue={rating}
                size={32}
                fillColor="#3b82f6"
                SVGstyle={{ display: 'inline-block' }}
                style={{ display: 'flex', gap: '8px' }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Issues</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          {categories.map(category => (
              <Button
                key={category.category_id}
                type="button"
                variant={selectedIssues.includes(category.name) ? "default" : "outline"}
                onClick={() => handleIssueToggle(category.name)}
                className="w-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Additional Comments</h2>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Provide any additional details about the issue..."
            className="min-h-[100px]"
          />
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
}
