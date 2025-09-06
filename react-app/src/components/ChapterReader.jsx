import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

const ChapterReader = () => {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    fetchChapterData();
  }, [storyId, chapterNumber]);

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      const [storyRes, chaptersRes] = await Promise.all([
        api.get(`/stories/${storyId}`),
        api.get(`/stories/${storyId}/chapters`)
      ]);

      setStory(storyRes.data);
      const currentChapter = chaptersRes.data.find(
        ch => ch.number === parseInt(chapterNumber)
      );
      setChapter(currentChapter);
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction) => {
    const newChapterNumber = direction === 'next' 
      ? parseInt(chapterNumber) + 1 
      : parseInt(chapterNumber) - 1;
    
    navigate(`/story/${storyId}/chapter/${newChapterNumber}`);
  };

  const canNavigatePrevious = parseInt(chapterNumber) > 1;
  const canNavigateNext = story?.chapters && parseInt(chapterNumber) < story.chapters.length;

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!chapter || !story) {
    return <div className="chapter-not-found">Chapter not found</div>;
  }

  return (
    <div className="chapter-reader">
      <div className="reader-header">
        <button 
          className="back-btn"
          onClick={() => navigate(`/story/${storyId}`)}
        >
          ← Back to Story
        </button>
        
        <div className="chapter-info">
          <h1 className="story-title">{story.title}</h1>
          <h2 className="chapter-title">
            Chapter {chapter.number}: {chapter.title}
          </h2>
        </div>

        <div className="reader-controls">
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
            className="font-size-selector"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
      </div>

      <div className={`chapter-content ${fontSize}`}>
        <div className="content-text">
          {chapter.content?.split('\n').map((paragraph, index) => (
            <p key={index} className="paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="chapter-navigation">
        <button
          className="nav-btn prev"
          onClick={() => navigateChapter('previous')}
          disabled={!canNavigatePrevious}
        >
          ← Previous Chapter
        </button>

        <div className="chapter-progress">
          Chapter {chapterNumber} of {story.chapters?.length}
        </div>

        <button
          className="nav-btn next"
          onClick={() => navigateChapter('next')}
          disabled={!canNavigateNext}
        >
          Next Chapter →
        </button>
      </div>
    </div>
  );
};

export default ChapterReader;
