import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import GenreCarousel from '../components/GenreCarousel';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Get auth state and loading flag
  const { user, loading: authLoading } = useAuth();

  // Dashboard data state
  const [featuredStories, setFeaturedStories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [continueReading, setContinueReading] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(popularStories);
    // Only run fetch AFTER auth is restored and user exists
    if (!authLoading && user) {
      setDataLoading(true);
      (async () => {
        try {
          const { data } = await api.get('/stories');
          // Featured = first 6
          setFeaturedStories(data.slice(0, 6));
          // Popular = top 4 by readCount
          setPopularStories(
            [...data].sort((a, b) => (b.readCount || 0) - (a.readCount || 0)).slice(0, 4)
          );
          // Continue reading: TODO implement using user reads
          setContinueReading([]);
        } catch (err) {
          console.error('Failed to fetch dashboard data:', err);
          setError('Failed to load stories.');
          setContinueReading([]);
        } finally {
          setDataLoading(false);
        }
      })();
    }
  }, [authLoading, user]);

  // Show spinner while either auth or data is loading
  if (authLoading || dataLoading) {
    return <LoadingSpinner size="large" />;
  }

  // If auth finished but no user, prompt to login
  if (!user) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div className="dashboard">
      {/* Welcome */}
      <section className="welcome-section">
        <h1>
          Welcome back, <span className="username">{user.username}</span>! 📚
        </h1>
        <p>Ready to continue your reading adventure?</p>
        <div className="quick-actions">
          <Link to="/create-story" className="btn btn-primary">
            ✍️ Write a Story
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            🔍 Browse Stories
          </Link>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {/* Continue Reading */}
      {continueReading.length > 0 && (
        <section className="continue-reading">
          <h2>Continue Reading</h2>
          <div className="continue-list">
            {continueReading.map(item => (
              <div key={item.id} className="continue-card">
                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar"
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
                <div className="info">
                  <h4>{item.story.title}</h4>
                  <p>
                    Chapter {item.currentChapter} • {item.progress || 0}% complete
                  </p>
                </div>
                <Link
                  to={`/story/${item.story.id}/chapter/${item.currentChapter}`}
                  className="continue-btn"
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Genres */}
      <section className="genres-section">
        <GenreCarousel />
      </section>

      {/* Trending */}
      <section className="popular-stories">
        <h2>Trending Stories</h2>
        <div className="stories-grid">
          {popularStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* Recently Updated */}
      <section className="featured-stories">
        <h2>Recently Updated</h2>
        <div className="stories-grid">
          {featuredStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
