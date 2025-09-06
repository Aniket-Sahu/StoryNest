import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';

const StoryPage = () => {
  const { storyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [authorStories, setAuthorStories] = useState([]);
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchStoryData();
  }, [storyId, user]); // refetch story and rating if user changes

  useEffect(() => {
    if (story?.author) {
      fetchAuthorStories(story.author.id, story.id);
    }
  }, [story]);

  const fetchAuthorStories = async (authorId, currentStoryId) => {
    try {
      const res = await api.get(`/stories/user/${authorId}`);
      setAuthorStories(res.data.filter(s => s.id !== currentStoryId));
    } catch {
      setAuthorStories([]);
    }
  };

  const fetchUserRating = async (storyId, userId) => {
    try {
      const res = await api.get(`/stories/${storyId}/ratings`, { params: { userId } });
      if (res.status === 204) { // no rating found
        setRating(0);
      } else {
        setRating(res.data.rating);
      }
    } catch {
      setRating(0);
    }
  };

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories/${storyId}`);
      const storyData = response.data;
      setStory(storyData);
      setChapters(storyData.chapters || []);

      if (user) {
        // Fetch user's rating for this story
        await fetchUserRating(storyId, user.id);

        // Check if user liked this story
        const likeRes = await api.get(`/stories/${storyId}/like`, { params: { userId: user.id } });
        setIsLiked(likeRes.data.liked);

        // Check if user is following the author
        if (storyData.author?.id !== user.id) {
          const followRes = await api.get(`/users/${user.id}/following`);
          setIsFollowingAuthor(followRes.data.some(f => f.id === storyData.author?.id));
        }
      } else {
        setRating(0); // reset rating if no user
        setIsLiked(false);
        setIsFollowingAuthor(false);
      }
    } catch (error) {
      console.error('Failed to fetch story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !story) return;

    try {
      if (isLiked) {
        await api.delete(`/stories/${story.id}/like`, { params: { userId: user.id } });
        setIsLiked(false);
        setStory(prev => ({ ...prev, likeCount: prev.likeCount - 1 }));
      } else {
        await api.post(`/stories/${story.id}/like`, {}, { params: { userId: user.id } });
        setIsLiked(true);
        setStory(prev => ({ ...prev, likeCount: prev.likeCount + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowAuthor = async () => {
    if (!user || !story?.author || story.author.id === user.id) return;

    try {
      if (isFollowingAuthor) {
        await api.post(`/users/${user.id}/unfollow/${story.author.id}`);
        setIsFollowingAuthor(false);
      } else {
        await api.post(`/users/${user.id}/follow/${story.author.id}`);
        setIsFollowingAuthor(true);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleRating = async (newRating) => {
    if (!user || !story) return;

    try {
      await api.post(`/stories/${story.id}/ratings`, {}, { params: { userId: user.id, rating: newRating } });
      setRating(newRating);
    } catch (error) {
      console.error('Failed to rate story:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (!story) return <div className="story-not-found">Story not found</div>;

  const isAuthor = user?.id === story.author?.id;

  return (
    <div className="story-page">
      <div className="story-container">
        {/* Story Header */}
        <div className="story-header">
          <div className="story-cover-large">{story.title.charAt(0)}</div>

          <div className="story-info">
            <div className="story-breadcrumb">
              <Link to="/dashboard">Home</Link> / <Link to="/stories">Stories</Link> / {story.title}
            </div>

            <h1 className="story-title">{story.title}</h1>

            <div className="story-author-info">
              <span>by </span>
              <Link to={`/profile/${story.author?.id}`} className="author-link">
                {story.author?.username}
              </Link>

              {!isAuthor && (
                <button className={`follow-btn ${isFollowingAuthor ? 'following' : 'follow'}`} onClick={handleFollowAuthor}>
                  {isFollowingAuthor ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            <div className="story-meta">
              <span className="genre-tag">{story.genre?.name}</span>
              <span className="story-status">{story.status}</span>
            </div>

            <div className="story-stats">
              <div className="stat">
                <span className="stat-icon">👁️</span>
                <span>{formatNumber(story.readCount)} reads</span>
              </div>
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <span>{formatNumber(story.likeCount)} likes</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⭐</span>
                <span>{story.ratingAvg?.toFixed(1) || '0.0'}</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📖</span>
                <span>{chapters.length} chapters</span>
              </div>
            </div>

            <div className="story-actions">
              <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={!user}>
                {isLiked ? '❤️ Liked' : '🤍 Like'}
              </button>

              <button className="add-to-library-btn">📚 Add to Library</button>

              {chapters.length > 0 && (
                <Link to={`/story/${story.id}/chapter/1`} className="btn btn-primary start-reading-btn">
                  🔖 Start Reading
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Story Description */}
        <div className="story-description">
          <h3>About this story</h3>
          <p>{story.description}</p>
        </div>

        {/* Rating Section */}
        {user && !isAuthor && (
          <div className="rating-section">
            <h3>Rate this story</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star ${star <= rating ? 'filled' : ''}`}
                  onClick={() => handleRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapters List */}
        <div className="chapters-section">
          <div className="section-header">
            <h3>Chapters ({chapters.length})</h3>
            {isAuthor && (
              <Link to={`/story/${story.id}/add-chapter`} className="btn btn-outline">
                + Add Chapter
              </Link>
            )}
          </div>

          <div className="chapters-list">
            {chapters.length > 0 ? (
              chapters.map(chapter => (
                <div key={chapter.id} className="chapter-item">
                  <Link to={`/story/${story.id}/chapter/${chapter.number}`} className="chapter-link">
                    <div className="chapter-info">
                      <h4>
                        Chapter {chapter.number}: {chapter.title}
                      </h4>
                      <p className="chapter-date">{new Date(chapter.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="chapter-arrow">→</div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="no-chapters">{isAuthor ? "You haven't added any chapters yet." : 'No chapters available yet.'}</div>
            )}
          </div>
        </div>

        {/* Author's Other Works */}
        {story.author && (
          <div className="author-works">
            <h3>More from {story.author.username}</h3>
            <div className="author-stories">
              {authorStories.length === 0 ? (
                <p>No other works found.</p>
              ) : (
                authorStories.map(work => <StoryCard key={work.id} story={work} showAuthor={false} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPage;