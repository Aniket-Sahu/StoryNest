import React, { useRef } from 'react';
import StoryCard from './StoryCard';
import LoadingSpinner from './LoadingSpinner';

const HorizontalStoryScroll = ({ stories, onLoadMore, hasMore, loading, type = 'default' }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const handleLoadMore = () => {
        if (onLoadMore && !loading) {
            onLoadMore();
        }
    };

    return (
        <div className="horizontal-scroll-container">
            <button className="scroll-btn scroll-btn-left" onClick={scrollLeft}>
                <span>‹</span>
            </button>
            
            <div className="horizontal-scroll" ref={scrollRef}>
                {stories.map(story => (
                    <div key={story.id} className="horizontal-story-item">
                        <StoryCard story={story} compact={type !== 'continue'} />
                    </div>
                ))}
                
                {hasMore && onLoadMore && (
                    <div className="horizontal-story-item load-more-item">
                        <button 
                            className="load-more-card"
                            onClick={handleLoadMore}
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingSpinner size="small" />
                            ) : (
                                <div className="load-more-content">
                                    <span className="load-more-icon">+</span>
                                    <span className="load-more-text">Load More</span>
                                </div>
                            )}
                        </button>
                    </div>
                )}
            </div>
            
            <button className="scroll-btn scroll-btn-right" onClick={scrollRight}>
                <span>›</span>
            </button>
        </div>
    );
};

export default HorizontalStoryScroll;
