import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import StoryCard from './StoryCard';
import LoadingSpinner from './LoadingSpinner';

const UserProfile = () => {
  const { userId } = useParams(); // now expecting UUID in route param
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');

  useEffect(() => {
    console.log('Fetching profile for userId:', userId);
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, storiesRes, followersRes, followingRes] = await Promise.all([
        api.get(`/users/id/${userId}`),
        api.get(`/stories/user/${userId}`),
        api.get(`/users/${userId}/followers`),
        api.get(`/users/${userId}/following`)
      ]);

      setProfile(profileRes.data);
      setStories(storiesRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);

      // Check if current user is following this profile
      if (currentUser && profileRes.data.id !== currentUser.id) {
        const isFollowingUser = followersRes.data.some(
          follower => follower.id === currentUser.id
        );
        setIsFollowing(isFollowingUser);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return;

    try {
      if (isFollowing) {
        await api.post(`/users/${currentUser.id}/unfollow/${profile.id}`);
        setIsFollowing(false);
        setFollowers(prev => prev.filter(f => f.id !== currentUser.id));
      } else {
        await api.post(`/users/${currentUser.id}/follow/${profile.id}`);
        setIsFollowing(true);
        setFollowers(prev => [...prev, currentUser]);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!profile) {
    return <div className="profile-not-found">User not found</div>;
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="profile-info">
          <h1 className="profile-username">{profile.username}</h1>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{stories.length}</span>
              <span className="stat-label">Stories</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followers.length}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{following.length}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              className={`follow-btn ${isFollowing ? 'following' : 'follow'}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          Stories ({stories.length})
        </button>
        <button
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following ({following.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'stories' && (
          <div className="stories-grid">
            {stories.length > 0 ? (
              stories.map(story => (
                <StoryCard key={story.id} story={story} showAuthor={false} />
              ))
            ) : (
              <div className="no-stories">
                {isOwnProfile ? "You haven't published any stories yet." : "This user hasn't published any stories yet."}
              </div>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="users-list">
            {followers.map(follower => (
              <div key={follower.id} className="user-item">
                <div className="user-avatar">
                  {follower.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{follower.username}</h4>
                  {follower.bio && <p>{follower.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="users-list">
            {following.map(followedUser => (
              <div key={followedUser.id} className="user-item">
                <div className="user-avatar">
                  {followedUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{followedUser.username}</h4>
                  {followedUser.bio && <p>{followedUser.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
