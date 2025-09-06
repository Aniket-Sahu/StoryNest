import React, { useEffect, useState } from 'react';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const StoriesPage = () => {
  const [trendingStories, setTrendingStories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // For now just fetch all stories once and draft example subsets
    api.get('/stories')
      .then(({ data }) => {
        setTrendingStories(data.slice(0, 4)); // placeholder subset
        setPopularStories(data.slice(4, 8));  // placeholder subset
        setNewReleases(data.slice(8, 12));    // placeholder subset
      })
      .catch(() => setError('Failed to load stories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="large" />;

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="welcome-title">Welcome to Stories</h1>
        <p className="welcome-subtitle">Explore trending, popular, and new stories.</p>
        <div className="quick-actions">
          <Link to="/create-story" className="btn btn-primary">Write a Story</Link>
          <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {/* Trending Stories */}
      <section className="featured-stories">
        <div className="section-header">
          <h2>Trending Stories</h2>
          <Link to="/stories/trending" className="section-link">See all</Link>
        </div>
        <div className="stories-grid">
          {trendingStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* Popular Stories */}
      <section className="popular-stories">
        <div className="section-header">
          <h2>Popular Stories</h2>
          <Link to="/stories/popular" className="section-link">See all</Link>
        </div>
        <div className="stories-grid">
          {popularStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="featured-stories">
        <div className="section-header">
          <h2>New Releases</h2>
          <Link to="/stories/new" className="section-link">See all</Link>
        </div>
        <div className="stories-grid">
          {newReleases.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StoriesPage;
