import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const CreateStory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genreName: '',  // changed from genreId to genreName
    status: 'draft',
  });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    setGenres(staticGenres);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.genreName) {  // validate genreName instead of genreId
      newErrors.genreName = 'Please select a genre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const storyData = {
        title: formData.title,
        description: formData.description,
        genreName: formData.genreName,  
        status: formData.status,
        authorId: user.id,
      };

      console.log(storyData);

      const response = await api.post('/stories', storyData);
      navigate(`/story/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create story:', error);
      setErrors({
        general: error.response?.data?.message || 'Failed to create story. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-story-page">
      <div className="create-story-container">
        <div className="page-header">
          <h1>Create New Story</h1>
          <p>Share your imagination with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="create-story-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Story Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your story title..."
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your story... What's it about? What makes it special?"
              className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
              rows="5"
              disabled={loading}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genreName">Genre *</label>
              <select
                id="genreName"
                name="genreName"
                value={formData.genreName}
                onChange={handleChange}
                className={`form-select ${errors.genreName ? 'error' : ''}`}
                disabled={loading}
              >
                <option value="">Select a genre...</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {errors.genreName && <span className="field-error">{errors.genreName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>

        <div className="create-story-tips">
          <h3>💡 Tips for Creating Great Stories</h3>
          <ul>
            <li>Choose a compelling title that grabs readers' attention</li>
            <li>Write a clear, engaging description that hooks potential readers</li>
            <li>Select the most appropriate genre for your story</li>
            <li>Start with a strong opening chapter to keep readers coming back</li>
            <li>Update regularly to build and maintain your audience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
