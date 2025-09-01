'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Calendar, Filter } from 'lucide-react';
import { feedbackService } from '@/lib/services/feedback';

interface UserFeedback {
  feedback_id: string;
  location: string;
  type: string;
  status: string;
  created_at: string;
  rating: number;
  comment?: string;
}

export default function MyFeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, statusFilter, sortBy]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      // For now, we'll fetch all feedback and handle pagination client-side
      // In a real app, you'd want to implement server-side pagination
      const allFeedback = await feedbackService.getUserFeedback();
      
      // Filter by status
      let filteredFeedback = allFeedback;
      if (statusFilter !== 'all') {
        filteredFeedback = allFeedback.filter((item: any) => 
          item.status === statusFilter
        );
      }

      // Sort feedback
      filteredFeedback.sort((a: any, b: any) => {
        if (sortBy === 'date') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });

      // Calculate pagination
      const totalItems = filteredFeedback.length;
      const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
      setTotalPages(totalPagesCount);

      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = filteredFeedback.slice(startIndex, endIndex);

      setFeedback(pageItems.map((item: any) => ({
        feedback_id: item.feedback_id,
        location: item.space_name || 'Unknown Location',
        type: item.category_name || 'General',
        status: item.status || 'Pending',
        created_at: item.created_at,
        rating: item.rating || 0,
        comment: item.comment,
      })));
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedback([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'problematic':
        return 'bg-red-100 text-red-800';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
      case 'good':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Feedback</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and track all your submitted feedback
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => router.push('/feedback')}
            className="inline-flex items-center"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Submit New Feedback
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="good">Good</option>
              <option value="mixed">Mixed</option>
              <option value="problematic">Problematic</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your feedback...</p>
          </div>
        ) : feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.feedback_id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.location}
                      </h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{item.type}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(item.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({item.rating}/5)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {item.comment && (
                      <p className="text-sm text-gray-600 mb-3">
                        "{item.comment}"
                      </p>
                    )}

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback found
            </h3>
            <p className="text-gray-500 mb-4">
              {statusFilter !== 'all' 
                ? `No feedback with status "${statusFilter}" found.`
                : "You haven't submitted any feedback yet."
              }
            </p>
            <Button onClick={() => router.push('/feedback')}>
              Submit Your First Feedback
            </Button>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 