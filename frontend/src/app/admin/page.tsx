'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { feedbackService } from '@/lib/services/feedback';

interface DashboardStats {
  totalSpaces: number;
  totalFeedback: number;
  totalUsers: number;
  recentSpaces: any[];
  recentFeedback: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSpaces: 0,
    totalFeedback: 0,
    totalUsers: 0,
    recentSpaces: [],
    recentFeedback: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        // Load spaces and feedback with limits
        const [spaces, feedback, statsResponse] = await Promise.all([
          feedbackService.getSpaces(5), // Only get 5 most recent spaces
          feedbackService.getAllFeedback(5), // Only get 5 most recent feedback
          feedbackService.getAdminStats()
        ]);

        setStats({
          totalSpaces: Number(statsResponse.total_spaces),
          totalFeedback: Number(statsResponse.total_feedback),
          totalUsers: Number(statsResponse.total_users),
          recentSpaces: spaces.slice(-5), // Get last 5 spaces
          recentFeedback: feedback.slice(-5) // Get last 5 feedback
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Spaces</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalSpaces}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Feedback</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalFeedback}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalUsers}</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Spaces */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Spaces</h3>
          <div className="space-y-4">
            {stats.recentSpaces.map((space, index) => (
              <div key={space.space_id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{space.name}</p>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(space.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">
                    {space.total_feedback_count || 0} reviews
                  </span>
                  <p className="text-xs text-gray-400">{space.space_type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Feedback */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {stats.recentFeedback.map((feedback, index) => (
              <div key={feedback.feedback_id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{feedback.space_name}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {feedback.space_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {feedback.comment ? (
                      feedback.comment.length > 50 
                        ? `${feedback.comment.slice(0, 50)}...` 
                        : feedback.comment
                    ) : 'No comment'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(feedback.updated_at || feedback.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    ⭐ {feedback.rating}
                  </div>
                  <p className="text-xs text-gray-400">{feedback.username || 'Anonymous'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
