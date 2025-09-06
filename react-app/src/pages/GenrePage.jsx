import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import StoryCard from '../components/StoryCard';

const GenrePage = () => {
    const { user } = useAuth();
    const { genreName } = useParams();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        api.get(`/stories/genre/${genreName}`)
            .then(res => setStories(res.data))
            .catch(err => setError('Failed to load stories for this genre.'))
            .finally(() => setLoading(false));
    }, [genreName]);

    if (loading) return <LoadingSpinner size="large" />;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="dashboard">
            <section className="welcome-section">
                <h1>
                    {user
                        ? <>Stories in <span className="username">{genreName.charAt(0).toUpperCase() + genreName.slice(1)}</span></>
                        : <>Stories in {genreName.charAt(0).toUpperCase() + genreName.slice(1)}</>
                    }
                </h1>
                <div className="quick-actions">
                    <Link to="/create-story" className="btn btn-primary">
                        ✍️ Write a Story
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline">
                        🔍 Browse Stories
                    </Link>
                </div>
            </section>

            {/* Stories List */}
            <section className="genre-stories">
                <h2>
                    {stories.length > 0
                        ? `Stories in "${genreName.charAt(0).toUpperCase() + genreName.slice(1)}"`
                        : `No stories found for "${genreName.charAt(0).toUpperCase() + genreName.slice(1)}"`}
                </h2>
                <div className="stories-grid">
                    {stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GenrePage;
