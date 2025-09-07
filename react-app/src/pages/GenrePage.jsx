import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
// import StoryCard from '../components/StoryCard';
import HorizontalStoryScroll from '../components/HorizontalStoryScroll';

const GenrePage = () => {
    const { genreName } = useParams();
    const { user, loading: authLoading } = useAuth();
    
    // Genre page data state
    const [genreData, setGenreData] = useState({
        trending: [],
        popular: []
    });
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state for "Show More" functionality
    const [showMoreLoading, setShowMoreLoading] = useState(false);
    const [hasMoreTrending, setHasMoreTrending] = useState(true);
    const [hasMorePopular, setHasMorePopular] = useState(true);
    const [trendingPage, setTrendingPage] = useState(0);
    const [popularPage, setPopularPage] = useState(0);

    const fetchGenreData = useCallback(async () => {
        try {
            const [trendingResponse, popularResponse] = await Promise.all([
                api.get(`/stories/genre/${genreName}/trending?limit=8`),
                api.get(`/stories/genre/${genreName}/popular?limit=8`)
            ]);
            
            setGenreData({
                trending: trendingResponse.data,
                popular: popularResponse.data
            });
            
            setHasMoreTrending(trendingResponse.data.length >= 8);
            setHasMorePopular(popularResponse.data.length >= 8);
        } catch (err) {
            console.error('Failed to fetch genre data:', err);
            setError('Failed to load genre stories.');
        } finally {
            setDataLoading(false);
        }
    }, [genreName]);

    const loadMoreTrending = async () => {
        if (showMoreLoading || !hasMoreTrending) return;
        
        setShowMoreLoading(true);
        try {
            const nextPage = trendingPage + 1;
            const { data } = await api.get(`/stories/genre/${genreName}/trending?limit=8&page=${nextPage}`);
            
            if (data.length === 0) {
                setHasMoreTrending(false);
            } else {
                setGenreData(prev => ({
                    ...prev,
                    trending: [...prev.trending, ...data]
                }));
                setTrendingPage(nextPage);
                setHasMoreTrending(data.length >= 8);
            }
        } catch (err) {
            console.error('Failed to load more trending stories:', err);
        } finally {
            setShowMoreLoading(false);
        }
    };

    const loadMorePopular = async () => {
        if (showMoreLoading || !hasMorePopular) return;
        
        setShowMoreLoading(true);
        try {
            const nextPage = popularPage + 1;
            const { data } = await api.get(`/stories/genre/${genreName}/popular?limit=8&page=${nextPage}`);
            
            if (data.length === 0) {
                setHasMorePopular(false);
            } else {
                setGenreData(prev => ({
                    ...prev,
                    popular: [...prev.popular, ...data]
                }));
                setPopularPage(nextPage);
                setHasMorePopular(data.length >= 8);
            }
        } catch (err) {
            console.error('Failed to load more popular stories:', err);
        } finally {
            setShowMoreLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && genreName) {
            setDataLoading(true);
            setError('');
            setTrendingPage(0);
            setPopularPage(0);
            setHasMoreTrending(true);
            setHasMorePopular(true);
            fetchGenreData();
        }
    }, [authLoading, user, genreName, fetchGenreData]);

    if (authLoading || dataLoading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please log in to explore {genreName} stories</h2>
                </div>
            </div>
        );
    }

    const formatGenreName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    return (
        <div className="genre-page-container">
            {/* Genre Header */}
            <section className="genre-header">
                <div className="genre-header-content">
                    <h1 className="genre-title">
                        📖 {formatGenreName(genreName)} Stories
                    </h1>
                    <p className="genre-subtitle">
                        Discover amazing {genreName.toLowerCase()} stories from our community
                    </p>
                </div>
            </section>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Trending Stories */}
            <section className="genre-trending-section">
                <div className="section-header">
                    <h2 className="section-title">🔥 Trending in {formatGenreName(genreName)}</h2>
                    <p className="section-subtitle">Most highly-rated {genreName.toLowerCase()} stories</p>
                </div>
                
                {genreData.trending.length > 0 ? (
                    <HorizontalStoryScroll 
                        stories={genreData.trending}
                        onLoadMore={loadMoreTrending}
                        hasMore={hasMoreTrending}
                        loading={showMoreLoading}
                    />
                ) : (
                    <div className="empty-state">
                        <p>No trending stories found in this genre yet.</p>
                    </div>
                )}
            </section>

            {/* Popular Stories */}
            <section className="genre-popular-section">
                <div className="section-header">
                    <h2 className="section-title">⭐ Popular in {formatGenreName(genreName)}</h2>
                    <p className="section-subtitle">Most read and loved stories</p>
                </div>
                
                {genreData.popular.length > 0 ? (
                    <HorizontalStoryScroll 
                        stories={genreData.popular}
                        onLoadMore={loadMorePopular}
                        hasMore={hasMorePopular}
                        loading={showMoreLoading}
                    />
                ) : (
                    <div className="empty-state">
                        <p>No popular stories found in this genre yet.</p>
                    </div>
                )}
            </section>

            {/* All Stories Grid - Optional fallback */}
            {genreData.trending.length === 0 && genreData.popular.length === 0 && (
                <section className="genre-all-section">
                    <div className="section-header">
                        <h2 className="section-title">All {formatGenreName(genreName)} Stories</h2>
                        <p className="section-subtitle">Browse all stories in this genre</p>
                    </div>
                    
                    <div className="stories-grid">
                        <div className="empty-state">
                            <p>No stories found in this genre yet.</p>
                            <p>Be the first to write a {genreName.toLowerCase()} story!</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default GenrePage;