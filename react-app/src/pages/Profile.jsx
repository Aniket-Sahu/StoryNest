import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../components/UserProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const Profile = () => {
  const { username } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editing = searchParams.get("edit") === "true";
  const [isEditing, setIsEditing] = useState(editing);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isOwnProfile = !username || username === user?.username;
  const displayUsername = username || user?.username;

  useEffect(() => {
    console.log(user);
    if (isOwnProfile && user) {
      setEditData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user, isOwnProfile]);


  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
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

    if (!editData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await api.put(`/users/${user.id}`, editData);
      
      // Update user in context
      updateUser(response.data);
      
      setIsEditing(false);
      
      // If username changed, redirect to new URL
      if (editData.username !== user.username) {
        navigate(`/profile/${editData.username}`);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // If this is someone else's profile, render the UserProfile component
  if (!isOwnProfile) {
    return <UserProfile />;
  }

  // If this is the current user's profile and they're editing
  if (isEditing) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="page-header">
            <h1>Edit Profile</h1>
            <p>Update your profile information</p>
          </div>

          <form className="edit-profile-form">
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="form-input form-textarea"
                rows="4"
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Regular profile view with edit button
  return (
    <div className="profile-page">
      <div className="profile-header-actions">
        <button
          className="btn btn-outline edit-profile-btn"
          onClick={handleEditToggle}
        >
          ✏️ Edit Profile
        </button>
      </div>
      
      <UserProfile />
    </div>
  );
};

export default Profile;
