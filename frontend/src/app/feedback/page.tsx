'use client';

import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { CombinedLocationInput } from '@/components/ui/combined-location-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';


const QUICK_ISSUES = [
  { id: 'cleanliness', label: 'Cleanliness Issue' },
  { id: 'crowding', label: 'Overcrowding' },
  { id: 'safety', label: 'Safety Concern' },
  { id: 'maintenance', label: 'Needs Maintenance' },
  { id: 'accessibility', label: 'Accessibility Issue' }
];

export default function FeedbackPage() {
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
    if (!location || !location.spaceType) {
      alert('Please select a location and space type');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          location,
          rating,
          issues: selectedIssues,
          comments
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');
      // Reset form
      setLocation({});
      setRating(0);
      setSelectedIssues([]);
      setComments('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
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
            {QUICK_ISSUES.map(issue => (
              <Button
                key={issue.id}
                type="button"
                variant={selectedIssues.includes(issue.id) ? "default" : "outline"}
                onClick={() => handleIssueToggle(issue.id)}
                className="w-full"
              >
                {issue.label}
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
