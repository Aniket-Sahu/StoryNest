import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const [storiesResponse, usersResponse] = await Promise.all([
        api.get(`/stories?search=${query}`),
        api.get(`/users?search=${query}`)
      ]);

      const searchResults = [
        ...storiesResponse.data.map(story => ({ ...story, type: 'story' })),
        ...usersResponse.data.map(user => ({ ...user, type: 'user' }))
      ];

      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'story') {
      navigate(`/story/${result.id}`);
    } else if (result.type === 'user') {
      navigate(`/profile/${result.username}`);
    }
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search stories and authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {showResults && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleResultClick(result)}
              >
                {result.type === 'story' ? (
                  <div className="story-result">
                    <h4>{result.title}</h4>
                    <p>by {result.author?.username}</p>
                    <span className="result-type">Story</span>
                  </div>
                ) : (
                  <div className="user-result">
                    <h4>{result.username}</h4>
                    <p>{result.bio}</p>
                    <span className="result-type">Author</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
