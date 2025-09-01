'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MapPin, MessageSquare, Star, Activity } from 'lucide-react';
import { feedbackService } from '@/lib/services/feedback';

interface DashboardStats {
  totalFeedback: number;
  pendingFeedback: number;
  resolvedFeedback: number;
  averageRating: number;
}

interface RecentFeedback {
  id: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
  rating: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalFeedback: 0,
    pendingFeedback: 0,
    resolvedFeedback: 0,
    averageRating: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, feedbackResponse] = await Promise.all([
          feedbackService.getUserStats(),
          feedbackService.getUserRecentFeedback(5),
        ]);
        setStats({
          totalFeedback: Number(statsResponse.total_feedback),
          pendingFeedback: Number(statsResponse.pending_feedback),
          resolvedFeedback: Number(statsResponse.resolved_feedback),
          averageRating: Number(Number(statsResponse.average_rating).toFixed(1)),
        });
        setRecentFeedback(feedbackResponse.map((item: any) => ({
          id: item.feedback_id,
          location: item.location || 'Unknown Location',
          type: item.type || 'Unknown Type',
          status: item.status || 'Pending',
          createdAt: new Date(item.created_at).toLocaleDateString(),
          rating: item.rating || 0,
        })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values on error
        setStats({
          totalFeedback: 0,
          pendingFeedback: 0,
          resolvedFeedback: 0,
          averageRating: 0,
        });
        setRecentFeedback([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => router.push('/feedback')}
            className="inline-flex items-center"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Report an Issue
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="px-5 py-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Feedback</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalFeedback}</dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="px-5 py-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.pendingFeedback}</dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="px-5 py-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.resolvedFeedback}</dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="px-5 py-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.averageRating} ⭐</dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Feedback */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Feedback</h2>
        <div className="mt-4 bg-white shadow-sm rounded-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : recentFeedback.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {recentFeedback.map((feedback) => (
                <li key={feedback.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {feedback.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {feedback.type} • Submitted on {feedback.createdAt}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            feedback.status === 'problematic'
                              ? 'bg-red-100 text-red-800'
                              : feedback.status === 'mixed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {feedback.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No feedback submitted yet
            </div>
          )}
        </div>
        {recentFeedback.length > 0 && (
          <div className="mt-4 text-right">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/my-feedback')}
            >
              View All Feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
