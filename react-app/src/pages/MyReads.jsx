import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StoryCard from '../components/StoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const MyReads = () => {
    const { user, loading: authLoading } = useAuth();

    const [activeTab, setActiveTab] = useState('reading');
    const [readings, setReadings] = useState({
        reading: [],
        completed: [],
        wantToRead: [],
        liked: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyReads = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch reading statuses (excluding liked)
            const response = await api.get(`/reads/user/${user.id}`);
            const readingData = response.data || [];

            // Fetch liked stories separately
            const likedResponse = await api.get(`/users/${user.id}/likes`);
            const likedStories = likedResponse.data || [];

            // Organize readings by status (excluding liked)
            const organizedReadings = {
                reading: readingData.filter((r) => r.status === "READING"),
                completed: readingData.filter((r) => r.status === "COMPLETED"),
                wantToRead: readingData.filter((r) => r.status === "WANT_TO_READ"),
                liked: likedStories.map(story => ({
                    story,
                    // Add dummy or default values for other reading fields that UI expects
                    currentChapter: 0,
                    status: "",
                    lastReadAt: null,
                })),
            };

            setReadings(organizedReadings);
        } catch (error) {
            console.error("Failed to fetch reading data:", error);
            setError("Failed to load your reading list. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user]);


    useEffect(() => {
        if (!authLoading && user) {
            fetchMyReads();
        }
    }, [authLoading, user, fetchMyReads]);

    const updateReadingStatus = async (storyId, newStatus) => {
        if (!user) return;

        try {
            await api.post('/reads/status', null, {
                params: {
                    userId: user.id,
                    storyId: storyId,
                    status: newStatus
                }
            });

            // Refresh the reading list
            await fetchMyReads();
        } catch (error) {
            console.error('Failed to update reading status:', error);
        }
    };

    const removeFromLibrary = async (storyId) => {
        if (!user) return;

        if (!window.confirm('Are you sure you want to remove this story from your library?')) {
            return;
        }

        try {
            await api.delete(`/reads/user/${user.id}/story/${storyId}`);

            // Refresh the reading list
            await fetchMyReads();
        } catch (error) {
            console.error('Failed to remove from library:', error);
        }
    };

    const getProgressPercentage = (read) => {
        if (!read.story?.chapters || read.story.chapters.length === 0) return 0;
        return Math.round((read.currentChapter / read.story.chapters.length) * 100);
    };

    const formatLastRead = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const tabs = [
        { id: 'reading', label: 'Currently Reading', count: readings.reading.length, icon: '📖' },
        { id: 'wantToRead', label: 'Want to Read', count: readings.wantToRead.length, icon: '📚' },
        { id: 'completed', label: 'Completed', count: readings.completed.length, icon: '✅' },
        { id: 'liked', label: 'Liked Stories', count: readings.liked.length, icon: '❤️' },
    ];

    const statusOptions = [
        { value: 'WANT_TO_READ', label: '📚 Want to Read' },
        { value: 'READING', label: '📖 Reading' },
        { value: 'COMPLETED', label: '✅ Completed' },
        { value: 'LIKED', label: '❤️ Liked' }
    ];

    if (authLoading || loading) {
        return <LoadingSpinner size="large" />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your reading list</h2>
                    <Link to="/login" className="btn-primary">Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="my-reads-page">
            <div className="my-reads-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">📚 My Reading Library</h1>
                    <p className="page-subtitle">Track your reading progress and discover new stories</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Reading Stats */}
                <div className="reading-stats">
                    <div className="stat-card">
                        <div className="stat-number">{readings.reading.length}</div>
                        <div className="stat-label">Currently Reading</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{readings.completed.length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{readings.wantToRead.length}</div>
                        <div className="stat-label">Want to Read</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{readings.liked.length}</div>
                        <div className="stat-label">Liked</div>
                    </div>
                </div>

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
                            {readings[activeTab].map((read) => {
                                const story = read.story;
                                const progress = getProgressPercentage(read);

                                return (
                                    <div key={story.id} className="library-story-card">
                                        <StoryCard story={story} />

                                        {/* Reading Progress */}
                                        {read.currentChapter > 0 && (
                                            <div className="reading-progress">
                                                <div className="progress-info">
                                                    <span>Chapter {read.currentChapter}</span>
                                                    <span>{progress}% complete</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Last Read Info */}
                                        {read.lastReadAt && (
                                            <div className="last-read">
                                                Last read: {formatLastRead(read.lastReadAt)}
                                            </div>
                                        )}

                                        {/* Story Actions */}
                                        <div className="story-actions">
                                            <div className="status-controls">
                                                <select
                                                    value={read.status}
                                                    onChange={(e) => updateReadingStatus(story.id, e.target.value)}
                                                    className="status-select-small"
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="action-buttons">
                                                {read.currentChapter > 0 ? (
                                                    <Link
                                                        to={`/story/${story.id}/chapter/${read.currentChapter}`}
                                                        className="btn-primary-small"
                                                    >
                                                        Continue
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/story/${story.id}`}
                                                        className="btn-primary-small"
                                                    >
                                                        Read
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => removeFromLibrary(story.id)}
                                                    className="btn-remove"
                                                    title="Remove from library"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                {activeTab === 'reading' && '📖'}
                                {activeTab === 'wantToRead' && '📚'}
                                {activeTab === 'completed' && '✅'}
                                {activeTab === 'liked' && '❤️'}
                            </div>
                            <h3>No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} yet</h3>
                            <p>
                                {activeTab === 'reading' && "Start reading some stories to see them here!"}
                                {activeTab === 'wantToRead' && "Add stories to your want-to-read list from story pages."}
                                {activeTab === 'completed' && "Finish reading stories to see them here."}
                                {activeTab === 'liked' && "Like stories to see them in your collection."}
                            </p>
                            <Link to="/stories" className="btn-primary">
                                Browse Stories
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyReads;