import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import GenreCarousel from '../components/GenreCarousel';
import StoryCard from '../components/StoryCard';
import HorizontalStoryScroll from '../components/HorizontalStoryScroll';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        trending: [],
        recent: []
    });
    const [continueReading, setContinueReading] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMoreLoading, setShowMoreLoading] = useState(false);
    const [hasMoreTrending, setHasMoreTrending] = useState(true);
    const [hasMoreRecent, setHasMoreRecent] = useState(true);
    const [trendingPage, setTrendingPage] = useState(0);
    const [recentPage, setRecentPage] = useState(0);

    const fetchDashboardData = useCallback(async () => {
        try {
            const { data } = await api.get('/stories/dashboard');
            setDashboardData(data);
            setHasMoreTrending(data.trending.length >= 6);
            setHasMoreRecent(data.recent.length >= 8);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load stories.');
        } finally {
            setDataLoading(false);
        }
    }, []);

    const loadMoreTrending = async () => {
        if (showMoreLoading || !hasMoreTrending) return;

        setShowMoreLoading(true);
        try {
            const nextPage = trendingPage + 1;
            const { data } = await api.get(`/stories/trending?limit=6&page=${nextPage}`);

            if (data.length === 0) {
                setHasMoreTrending(false);
            } else {
                setDashboardData(prev => ({
                    ...prev,
                    trending: [...prev.trending, ...data]
                }));
                setTrendingPage(nextPage);
                setHasMoreTrending(data.length >= 6);
            }
        } catch (err) {
            console.error('Failed to load more trending stories:', err);
        } finally {
            setShowMoreLoading(false);
        }
    };

    const loadMoreRecent = async () => {
        if (showMoreLoading || !hasMoreRecent) return;

        setShowMoreLoading(true);
        try {
            const nextPage = recentPage + 1;
            const { data } = await api.get(`/stories/recent?limit=8&page=${nextPage}`);

            if (data.length === 0) {
                setHasMoreRecent(false);
            } else {
                setDashboardData(prev => ({
                    ...prev,
                    recent: [...prev.recent, ...data]
                }));
                setRecentPage(nextPage);
                setHasMoreRecent(data.length >= 8);
            }
        } catch (err) {
            console.error('Failed to load more recent stories:', err);
        } finally {
            setShowMoreLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            setDataLoading(true);
            fetchDashboardData();
        }
    }, [authLoading, user, fetchDashboardData]);

    if (authLoading || dataLoading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome to StoryNest</h2>
                    <p className="text-gray-600 mb-6">Please log in to explore amazing stories</p>
                    <Link to="/login" className="btn-primary">Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <section className="welcome-section">
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Welcome back, {user.username}! 📚
                    </h1>
                    <p className="welcome-subtitle">
                        Ready to continue your reading adventure?
                    </p>

                    <div className="action-buttons">
                        <Link to="/create-story" className="btn-primary">
                            ✍️ Write a Story
                        </Link>
                        <Link to="/dashboard" className="btn-secondary">
                            🔍 Browse Stories
                        </Link>
                    </div>
                </div>
            </section>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Continue Reading */}
            {continueReading.length > 0 && (
                <section className="continue-reading-section">
                    <h2 className="section-title">Continue Reading</h2>
                    <HorizontalStoryScroll stories={continueReading} type="continue" />
                </section>
            )}

            {/* Genres */}
            <section className="genres-section">
                <GenreCarousel />
            </section>

            {/* Trending Stories */}
            <section className="trending-section">
                <div className="section-header">
                    <h2 className="section-title">Trending Stories</h2>
                    <p className="section-subtitle">Highest rated stories this week</p>
                </div>

                <HorizontalStoryScroll
                    stories={dashboardData.trending}
                    onLoadMore={loadMoreTrending}
                    hasMore={hasMoreTrending}
                    loading={showMoreLoading}
                />

                {hasMoreTrending && (
                    <div className="show-more-container">
                        <button
                            onClick={loadMoreTrending}
                            disabled={showMoreLoading}
                            className="show-more-btn"
                        >
                            {showMoreLoading ? (
                                <LoadingSpinner size="small" />
                            ) : (
                                <>Show More <span className="arrow">→</span></>
                            )}
                        </button>
                    </div>
                )}
            </section>

            {/* Recent Stories */}
            <section className="recent-section">
                <div className="section-header">
                    <h2 className="section-title">Recently Updated</h2>
                    <p className="section-subtitle">Fresh content from our community</p>
                </div>

                <HorizontalStoryScroll
                    stories={dashboardData.recent}
                    onLoadMore={loadMoreRecent}
                    hasMore={hasMoreRecent}
                    loading={showMoreLoading}
                />
            </section>
        </div>
    );
};

export default Dashboard;
