import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StoryCard from '../components/StoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const MyReads = () => {
  const { user, loading: authLoading } = useAuth(); // get authLoading

  const [activeTab, setActiveTab] = useState('reading');
  const [readings, setReadings] = useState({
    reading: [],
    completed: [],
    wantToRead: [],
    liked: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if auth finished loading and user exists
    if (!authLoading && user) {
      fetchMyReads();
    }
  }, [authLoading, user]);

  const fetchMyReads = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/users/${user.id}/reads`);
      const readingData = response.data || [];

      setReadings({
        reading: readingData.filter(r => r.status === 'reading'),
        completed: readingData.filter(r => r.status === 'completed'),
        wantToRead: readingData.filter(r => r.status === 'want_to_read'),
        liked: readingData.filter(r => r.status === 'liked'),
      });
    } catch (error) {
      console.error('Failed to fetch reading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReadingStatus = async (storyId, newStatus) => {
    try {
      await api.post(`/users/${user.id}/reads`, { storyId, status: newStatus });
      fetchMyReads();
    } catch (error) {
      console.error('Failed to update reading status:', error);
    }
  };

  const removeFromLibrary = async (storyId) => {
    try {
      await api.delete(`/users/${user.id}/reads/${storyId}`);
      fetchMyReads();
    } catch (error) {
      console.error('Failed to remove from library:', error);
    }
  };

  const tabs = [
    { id: 'reading', label: 'Currently Reading', count: readings.reading.length, icon: '📖' },
    { id: 'wantToRead', label: 'Want to Read', count: readings.wantToRead.length, icon: '📚' },
    { id: 'completed', label: 'Completed', count: readings.completed.length, icon: '✅' },
    { id: 'liked', label: 'Liked Stories', count: readings.liked.length, icon: '❤️' },
  ];

  if (authLoading || loading) { // also show spinner while auth loading
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="my-reads-page">
      <div className="my-reads-container">
        {/* Page header and stats etc... */}
        {/* Tabs */}
        <div className="reading-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="reading-content">
          {readings[activeTab].length > 0 ? (
            <div className="stories-grid">
              {readings[activeTab].map((item) => {
                const story = item.story || item;

                return (
                  <div key={story.id} className="library-story-card">
                    <StoryCard story={story} />
                    {/* Story actions with buttons */}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              {/* Empty state UI */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReads;
