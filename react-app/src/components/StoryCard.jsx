import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story, showAuthor = true, compact = false }) => {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const cardClass = compact ? 'story-card story-card-compact' : 'story-card';

    return (
        <div className={cardClass}>
            <Link to={`/story/${story.id}`} className="story-card-link">
                {/* Story Cover */}
                <div className="story-cover">
                    <div className="cover-placeholder">
                        {story.title?.charAt(0) || '?'}
                    </div>
                    {story.status && (
                        <span className="status-badge">
                            {story.status}
                        </span>
                    )}
                </div>

                {/* Story Content */}
                <div className="story-content">
                    <h3 className="story-title">
                        {story.title}
                    </h3>
                    
                    {showAuthor && story.author && (
                        <p className="story-author">
                            by {story.author.username}
                        </p>
                    )}
                    
                    {!compact && story.description && (
                        <p className="story-description">
                            {story.description.length > 100 
                                ? `${story.description.substring(0, 100)}...`
                                : story.description
                            }
                        </p>
                    )}

                    {/* Genre Tag */}
                    {story.genre && (
                        <span className="genre-tag">
                            {story.genre.name}
                        </span>
                    )}

                    {/* Story Stats */}
                    <div className="story-stats">
                        <div className="stat">
                            <span className="stat-icon">👁️</span>
                            <span className="stat-value">
                                {formatNumber(story.readCount)}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-icon">❤️</span>
                            <span className="stat-value">
                                {formatNumber(story.likeCount)}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">
                                {story.ratingAvg?.toFixed(1) || '0.0'}
                            </span>
                        </div>
                    </div>

                    {/* Story Meta */}
                    {!compact && (
                        <div className="story-meta">
                            <span>{story.chapters?.length || 0} chapters</span>
                            <span>Updated {formatDate(story.updatedAt || story.createdAt)}</span>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default StoryCard;
