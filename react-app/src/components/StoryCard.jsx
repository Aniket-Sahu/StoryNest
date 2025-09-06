import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story, showAuthor = true }) => {

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="story-card">
      <Link to={`/story/${story.id}`} className="story-link">
        <div className="story-cover">
          <div className="story-cover-placeholder">
            {story.title.charAt(0)}
          </div>
          <div className="story-status">
            <span className={`status-badge ${story.status}`}>
              {story.status}
            </span>
          </div>
        </div>

        <div className="story-info">
          <h3 className="story-title">{story.title}</h3>
          
          {showAuthor && (
            <p className="story-author">by {story.author?.username}</p>
          )}
          
          <p className="story-description">
            {story.description?.substring(0, 100)}
            {story.description?.length > 100 && '...'}
          </p>

          <div className="story-genre">
            <span className="genre-tag">{story.genre?.name}</span>
          </div>

          <div className="story-metrics">
            <div className="metric">
              <span className="metric-icon">👁️</span>
              <span className="metric-value">{formatNumber(story.readCount)}</span>
            </div>
            <div className="metric">
              <span className="metric-icon">❤️</span>
              <span className="metric-value">{formatNumber(story.likeCount)}</span>
            </div>
            <div className="metric">
              <span className="metric-icon">⭐</span>
              <span className="metric-value">{story.ratingAvg?.toFixed(1)}</span>
            </div>
          </div>

          <div className="story-meta">
            <span className="story-chapters">{story.chapters?.length || 0} chapters</span>
            <span className="story-date">Updated {formatDate(story.updatedAt || story.createdAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StoryCard;
