import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { EventCard } from '../../components/EventCard';
import { Card, CardContent, CardHeader, CardActions } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';
import { Event, Staff } from '../../types';
import { DEPARTMENTS } from '../../utils/constants';
import { Plus, Calendar } from 'lucide-react';

export const StaffEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { state } = useAuth();
  
  const staff = state.user as Staff;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    department: staff.department
  });

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await apiService.fetchEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const eventData = {
        ...formData,
        createdBy: staff.staffId
      };

      if (editingEvent) {
        // Update existing event (mock implementation)
        const updatedEvent = { ...editingEvent, ...eventData };
        setEvents(prev => prev.map(event => event.id === editingEvent.id ? updatedEvent : event));
      } else {
        // Create new event
        const newEvent = await apiService.createEvent(eventData);
        setEvents(prev => [newEvent, ...prev]);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        department: staff.department
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      department: event.department
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        // Mock delete implementation
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      department: staff.department
    });
    setShowForm(true);
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
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600">Create and manage college events</p>
          </div>
          <Button onClick={handleNewEvent} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>

        {/* Event Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <FormInput
                  name="title"
                  label="Event Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Annual Sports Day"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the event..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    name="date"
                    type="date"
                    label="Event Date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />

                  <FormInput
                    name="time"
                    type="time"
                    label="Event Time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="All Departments">All Departments</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardActions className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </CardActions>
            </form>
          </Card>
        )}

        {/* Events List */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Created</h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first event for students.
              </p>
              <Button onClick={handleNewEvent}>
                Create First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};