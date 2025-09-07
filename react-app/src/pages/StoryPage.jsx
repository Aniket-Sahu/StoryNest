import React, { useState, useEffect, useCallback } from 'react';
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

    // Reading status and progress states
    const [readingStatus, setReadingStatus] = useState(null);
    const [readingData, setReadingData] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        if (story?.author) {
            fetchAuthorStories(story.author.id, story.id);
        }
    }, [story]);

    // Fetch user's reading status for this story
    const fetchReadingStatus = async () => {
        if (!user) return;

        try {
            const response = await api.get(`/reads/user/${user.id}/story/${storyId}`);
            if (response.status === 200) {
                setReadingData(response.data);
                setReadingStatus(response.data.status);
            }
        } catch (error) {
            if (error.response?.status !== 204) {
                console.error('Failed to fetch reading status:', error);
            }
            setReadingData(null);
            setReadingStatus(null);
        }
    };

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
            if (res.status === 204) {
                setRating(0);
            } else {
                setRating(res.data.rating);
            }
        } catch {
            setRating(0);
        }
    };

    const fetchStoryData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/stories/${storyId}`);
            const storyData = response.data;
            setStory(storyData);
            setChapters(storyData.chapters || []);

            if (user) {
                await fetchUserRating(storyId, user.id);
                await fetchReadingStatus();

                const likeRes = await api.get(`/stories/${storyId}/like`, { params: { userId: user.id } });
                setIsLiked(likeRes.data.liked);

                if (storyData.author?.id !== user.id) {
                    const followRes = await api.get(`/users/${user.id}/following`);
                    setIsFollowingAuthor(followRes.data.some(f => f.id === storyData.author?.id));
                }
            } else {
                setRating(0);
                setIsLiked(false);
                setIsFollowingAuthor(false);
            }
        } catch (error) {
            console.error('Failed to fetch story:', error);
        } finally {
            setLoading(false);
        }
    }, [storyId, user]);

    useEffect(() => {
        fetchStoryData();
    }, [storyId, user, fetchStoryData]);

    const handleStatusChange = async (newStatus) => {
        if (!user || statusLoading) return;

        setStatusLoading(true);
        try {
            await api.post('/reads/status', null, {
                params: {
                    userId: user.id,
                    storyId: storyId,
                    status: newStatus
                }
            });
            setReadingStatus(newStatus);
            await fetchReadingStatus(); // Refresh reading data
        } catch (error) {
            console.error('Failed to update reading status:', error);
        } finally {
            setStatusLoading(false);
        }
    };

    const handleChapterClick = async (chapterNumber) => {
        try {
            await api.post('/reads/progress', null, {
                params: {
                    userId: user.id,
                    storyId: storyId,
                    chapterNumber: chapterNumber
                }
            });
            navigate(`/story/${storyId}/chapter/${chapterNumber}`);
        } catch (error) {
            console.error('Failed to update reading progress:', error);
            navigate(`/story/${storyId}/chapter/${chapterNumber}`);
        }
    };

    const handleContinueReading = async () => {
        if (!user || chapters.length === 0) return;

        const targetChapter = readingData?.currentChapter || 1;

        try {
            await api.post('/reads/progress', null, {
                params: {
                    userId: user.id,
                    storyId: storyId,
                    chapterNumber: targetChapter
                }
            });

            navigate(`/story/${storyId}/chapter/${targetChapter}`);
        } catch (error) {
            console.error('Failed to update reading progress:', error);
            navigate(`/story/${storyId}/chapter/${targetChapter}`);
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

    const getStatusOptions = () => [
        { value: 'WANT_TO_READ', label: '📚 Want to Read' },
        { value: 'READING', label: '📖 Reading' },
        { value: 'COMPLETED', label: '✅ Completed' }
    ];

    const calculateProgress = () => {
        if (!readingData || !chapters.length) return 0;
        return Math.round((readingData.currentChapter / chapters.length) * 100);
    };

    if (loading) return <LoadingSpinner />;
    if (!story) return <div>Story not found</div>;

    const isAuthor = user?.id === story.author?.id;
    const progress = calculateProgress();

    return (
        <div className="story-page">
            <div className="container">
                {/* Story Header */}
                <div className="story-header">
                    <div className="story-avatar">
                        {story.title.charAt(0)}
                    </div>

                    <div className="story-content">
                        <div className="breadcrumb">
                            Home / Stories / {story.title}
                        </div>

                        <div className="story-title-section">
                            <h1>{story.title}</h1>

                            <div className="story-author">
                                by <Link to={`/profile/${story.author?.id}`}>{story.author?.username}</Link>
                                {!isAuthor && (
                                    <button onClick={handleFollowAuthor} className={`follow-btn ${isFollowingAuthor ? 'following' : ''}`}>
                                        {isFollowingAuthor ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            <div className="story-tags">
                                <span className="genre-tag">{story.genre?.name}</span>
                                <span className="status-tag">{story.status}</span>
                            </div>

                            <div className="story-stats">
                                <div className="stat">
                                    <span className="stat-icon">👁️</span>
                                    <span>{formatNumber(story.readCount)} reads</span>
                                </div>
                                <div className="stat">
                                    <button onClick={handleLike} className={`stat-btn ${isLiked ? 'liked' : ''}`}>
                                        <span className="stat-icon">❤️</span>
                                        <span>{formatNumber(story.likeCount)} likes</span>
                                    </button>
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
                                {chapters.length > 0 && (
                                    <button onClick={handleContinueReading} className="btn-primary">
                                        🔖 {readingData?.currentChapter ? `Continue Reading (Ch. ${readingData.currentChapter})` : 'Start Reading'}
                                    </button>
                                )}
                                {isAuthor && (
                                    <Link to={`/story/${storyId}/new-chapter`} className="btn-secondary">
                                        ✏️ Add Chapter
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reading Status and Progress */}
                {user && !isAuthor && (
                    <div className="reading-status-section">
                        <div className="section-card">
                            <h3 className="reading-status-title">Your Reading Status</h3>
                            <div className="reading-status-controls">
                                <div className="status-dropdown">
                                    <select
                                        value={readingStatus || ''}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={statusLoading}
                                        className="status-select"
                                    >
                                        <option value="">Select Status</option>
                                        {getStatusOptions().map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {chapters.length > 0 && (
                                    <div className="progress-section">
                                        <div className="progress-info">
                                            <span>
                                                Chapter {readingData?.currentChapter > 0 ? readingData.currentChapter : 0} of {chapters.length}
                                            </span>
                                            <span>{progress || 0}% complete</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Story Description */}
                <div className="story-description">
                    <div className="section-card">
                        <h3>About this story</h3>
                        <p>{story.description}</p>
                    </div>
                </div>

                {/* Rating Section */}
                {user && !isAuthor && (
                    <div className="rating-section">
                        <div className="section-card">
                            <h3>Rate this story</h3>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className={`star ${rating >= star ? 'filled' : ''}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapters List */}
                <div className="chapters-section">
                    <div className="section-card">
                        <div className="section-header">
                            <h3>Chapters ({chapters.length})</h3>
                            {isAuthor && (
                                <Link to={`/story/${storyId}/new-chapter`} className="btn-outline">
                                    + Add Chapter
                                </Link>
                            )}
                        </div>

                        <div className="chapters-list">
                            {chapters.length > 0 ? (
                                chapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleChapterClick(chapter.number)}
                                        className={`chapter-item ${readingData?.currentChapter === chapter.number ? 'current' : ''}`}
                                    >
                                        <div className="chapter-info">
                                            <div className="chapter-number">
                                                {chapter.number}
                                            </div>
                                            <div className="chapter-details">
                                                <h4>Chapter {chapter.number}: {chapter.title}</h4>
                                                <p>{new Date(chapter.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="chapter-arrow">
                                            {readingData?.currentChapter === chapter.number && <span className="current-indicator">📍</span>}
                                            →
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="no-chapters">
                                    {isAuthor ? "You haven't added any chapters yet." : 'No chapters available yet.'}
                                    {isAuthor && (
                                        <Link to={`/story/${storyId}/new-chapter`} className="btn-primary" style={{ marginTop: '1rem' }}>
                                            Write Your First Chapter
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Author's Other Works */}
                {story.author && (
                    <div className="other-works-section">
                        <div className="section-card">
                            <h3>More from {story.author.username}</h3>
                            <div className="other-works">
                                {authorStories.length === 0 ? (
                                    <p>No other works found.</p>
                                ) : (
                                    authorStories.map(work => <StoryCard key={work.id} story={work} />)
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryPage;
