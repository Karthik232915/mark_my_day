import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { EventCard } from '../../components/EventCard';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/apiService';
import { Event } from '../../types';
import { RefreshCw, Calendar } from 'lucide-react';

export const StudentEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await apiService.fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Stay updated with upcoming college events</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            loading={refreshing}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Summary</h3>
                <p className="text-sm text-gray-600">Overview of upcoming events</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">
                    {events.filter(event => new Date(event.date) > new Date()).length}
                  </p>
                  <p className="text-sm font-medium text-blue-700">Upcoming Events</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">
                    {events.filter(event => 
                      new Date(event.date) > new Date() && 
                      new Date(event.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                  <p className="text-sm font-medium text-green-700">This Week</p>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-900">{events.length}</p>
                  <p className="text-sm font-medium text-purple-700">Total Events</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600 mb-4">
                There are no events scheduled at the moment. Check back later!
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Refresh Events
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};