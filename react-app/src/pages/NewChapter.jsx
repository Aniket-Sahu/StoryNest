import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const NewChapter = () => {
    const { storyId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchStoryData();
    }, [storyId]);

    const fetchStoryData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/stories/${storyId}`);
            const storyData = response.data;
            
            // Check if user is the author
            if (!user || storyData.author.id !== user.id) {
                navigate('/dashboard');
                return;
            }
            
            setStory(storyData);
        } catch (error) {
            console.error('Failed to fetch story:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Chapter title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters long';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Chapter content is required';
        } else if (formData.content.length < 50) {
            newErrors.content = 'Content must be at least 50 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setErrors({});

        try {
            const chapterData = {
                title: formData.title.trim(),
                content: formData.content.trim()
            };

            const response = await api.post(`/stories/${storyId}/chapters`, chapterData);
            const newChapter = response.data;

            // Navigate to the story page
            navigate(`/story/${storyId}`);
        } catch (error) {
            console.error('Failed to create chapter:', error);
            setErrors({
                general: error.response?.data?.message || 'Failed to create chapter. Please try again.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!formData.title.trim() && !formData.content.trim()) {
            return;
        }

        // Here you could implement draft saving functionality
        console.log('Draft saved locally');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!story) {
        return <div className="error-message">Story not found</div>;
    }

    return (
        <div className="new-chapter-container">
            <div className="new-chapter-header">
                <div className="breadcrumb">
                    <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
                        Dashboard
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span onClick={() => navigate(`/story/${storyId}`)} className="breadcrumb-link">
                        {story.title}
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">New Chapter</span>
                </div>

                <div className="story-info">
                    <h1>Add New Chapter</h1>
                    <p>Writing for: <strong>{story.title}</strong></p>
                    <p>Next chapter number: <strong>{(story.chapters?.length || 0) + 1}</strong></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="new-chapter-form">
                {errors.general && (
                    <div className="error-banner">
                        {errors.general}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="title">Chapter Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter chapter title..."
                        className={errors.title ? 'input-error' : ''}
                        maxLength="200"
                    />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                    <small className="char-count">{formData.title.length}/200</small>
                </div>

                <div className="form-group content-group">
                    <label htmlFor="content">Chapter Content *</label>
                    <div className="content-editor">
                        <div className="editor-toolbar">
                            <small className="writing-tip">
                                💡 Tip: Write engaging content that keeps readers wanting more!
                            </small>
                        </div>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Start writing your chapter here...

Remember to:
• Create engaging dialogue
• Build suspense and tension
• Develop your characters
• Paint vivid scenes

Your readers are waiting!"
                            className={errors.content ? 'input-error' : ''}
                            rows="20"
                        />
                        {errors.content && <span className="error-text">{errors.content}</span>}
                        <small className="char-count">{formData.content.length} characters</small>
                    </div>
                </div>

                <div className="form-actions">
                    <div className="action-buttons">
                        <button
                            type="button"
                            onClick={() => navigate(`/story/${storyId}`)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="btn-outline"
                            disabled={saving}
                        >
                            Save Draft
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Publishing...' : 'Publish Chapter'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="writing-tips">
                <h3>Writing Tips</h3>
                <div className="tips-grid">
                    <div className="tip">
                        <strong>📖 Chapter Length:</strong>
                        <p>Aim for 1,500-3,000 words per chapter for optimal reader engagement.</p>
                    </div>
                    <div className="tip">
                        <strong>🎭 Cliffhangers:</strong>
                        <p>End chapters with hooks to keep readers coming back for more.</p>
                    </div>
                    <div className="tip">
                        <strong>✏️ Editing:</strong>
                        <p>Review your chapter before publishing. You can always edit later!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewChapter;
