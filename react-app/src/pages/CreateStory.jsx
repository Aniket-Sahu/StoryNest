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
        genreName: '',
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

        if (!formData.genreName) {
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

            const response = await api.post('/stories', storyData);
            const newStory = response.data;

            const shouldAddChapter = window.confirm(
                '🎉 Story created successfully! Would you like to add your first chapter now?'
            );

            if (shouldAddChapter) {
                navigate(`/story/${newStory.id}/new-chapter`);
            } else {
                navigate(`/story/${newStory.id}`);
            }
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
        <div className="create-story-container">
            <div className="container">
                <div className="create-story-header">
                    <h1>Create New Story</h1>
                    <p>Share your imagination with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="create-story-form">
                    {errors.general && (
                        <div className="error-banner">
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
                            className={errors.title ? 'input-error' : ''}
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your story to attract readers..."
                            className={errors.description ? 'input-error' : ''}
                            rows="4"
                        />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="genreName">Genre *</label>
                            <select
                                id="genreName"
                                name="genreName"
                                value={formData.genreName}
                                onChange={handleChange}
                                className={errors.genreName ? 'input-error' : ''}
                            >
                                <option value="">Select a genre...</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.name}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                            {errors.genreName && <span className="error-text">{errors.genreName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
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
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Story'}
                        </button>
                    </div>
                </form>

                <div className="tips-section">
                    <h3>💡 Tips for Creating Great Stories</h3>
                    <div className="tips-grid">
                        <div className="tip">
                            <strong>Compelling Title:</strong>
                            <p>Choose a title that grabs readers' attention and hints at your story's theme.</p>
                        </div>
                        <div className="tip">
                            <strong>Engaging Description:</strong>
                            <p>Write a clear, intriguing description that hooks potential readers without spoiling the plot.</p>
                        </div>
                        <div className="tip">
                            <strong>Right Genre:</strong>
                            <p>Select the most appropriate genre to help readers find your story.</p>
                        </div>
                        <div className="tip">
                            <strong>Strong Opening:</strong>
                            <p>Start with a compelling first chapter to keep readers coming back.</p>
                        </div>
                        <div className="tip">
                            <strong>Regular Updates:</strong>
                            <p>Update regularly to build and maintain your audience.</p>
                        </div>
                        <div className="tip">
                            <strong>Reader Engagement:</strong>
                            <p>Respond to comments and build a community around your story.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStory;
