import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const staticGenres = [
  { id: '1', name: 'Romance', color: '#ff6b9d' },
  { id: '2', name: 'Fantasy', color: '#9c88ff' },
  { id: '3', name: 'Mystery', color: '#4ecdc4' },
  { id: '4', name: 'Science Fiction', color: '#45b7d1' },
  { id: '5', name: 'Horror', color: '#ff6b6b' },
  { id: '6', name: 'Adventure', color: '#96ceb4' },
  { id: '7', name: 'Drama', color: '#ffeaa7' },
  { id: '8', name: 'Comedy', color: '#fd79a8' }
];

const GenreCarousel = () => {
  const [genres] = useState(staticGenres);
  const navigate = useNavigate();

  const handleGenreClick = (genreName) => {
    navigate(`/stories/genre/${genreName}`);
  };

  return (
    <div className="genre-carousel">
      <h2 className="section-title">Explore Genres</h2>
      <div className="genre-scroll-container">
        <div className="genre-list">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="genre-card"
              style={{ '--genre-color': genre.color }}
              onClick={() => handleGenreClick(genre.name)}
            >
              <div className="genre-background"></div>
              <div className="genre-content">
                <h3 className="genre-name">{genre.name}</h3>
                <div className="genre-icon">📚</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreCarousel;
