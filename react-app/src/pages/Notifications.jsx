import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Sample notifications for demonstration
  const sampleNotifications = [
    {
      id: '1',
      type: 'follow',
      message: 'romance_author started following you',
      user: { username: 'romance_author', id: 'user-2' },
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      type: 'like',
      message: 'fantasy_writer liked your story "The Enchanted Forest"',
      user: { username: 'fantasy_writer', id: 'user-1' },
      story: { title: 'The Enchanted Forest', id: 'story-1' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true
    },
    {
      id: '3',
      type: 'chapter',
      message: 'New chapter available in "Love in Paris"',
      user: { username: 'romance_author', id: 'user-2' },
      story: { title: 'Love in Paris', id: 'story-2' },
      chapter: { number: 3, title: 'The Confession' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: false
    },
    {
      id: '4',
      type: 'comment',
      message: 'mystery_master commented on your story',
      user: { username: 'mystery_master', id: 'user-3' },
      story: { title: 'The Last Detective', id: 'story-3' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${user.id}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Use sample data as fallback
      setNotifications(sampleNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/users/${user.id}/notifications/read-all`);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow': return '👤';
      case 'like': return '❤️';
      case 'chapter': return '📖';
      case 'comment': return '💬';
      default: return '🔔';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="page-header">
          <h1>Notifications</h1>
          <p>Stay updated with your reading community</p>
        </div>

        <div className="notifications-actions">
          <div className="notification-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              className="btn btn-outline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-message">
                    {notification.type === 'follow' && (
                      <span>
                        <Link to={`/profile/${notification.user.username}`} className="user-link">
                          {notification.user.username}
                        </Link>{' '}
                        started following you
                      </span>
                    )}

                    {notification.type === 'like' && (
                      <span>
                        <Link to={`/profile/${notification.user.username}`} className="user-link">
                          {notification.user.username}
                        </Link>{' '}
                        liked your story{' '}
                        <Link to={`/story/${notification.story.id}`} className="story-link">
                          "{notification.story.title}"
                        </Link>
                      </span>
                    )}

                    {notification.type === 'chapter' && (
                      <span>
                        New chapter available in{' '}
                        <Link to={`/story/${notification.story.id}`} className="story-link">
                          "{notification.story.title}"
                        </Link>{' '}
                        by{' '}
                        <Link to={`/profile/${notification.user.username}`} className="user-link">
                          {notification.user.username}
                        </Link>
                      </span>
                    )}

                    {notification.type === 'comment' && (
                      <span>
                        <Link to={`/profile/${notification.user.username}`} className="user-link">
                          {notification.user.username}
                        </Link>{' '}
                        commented on your story{' '}
                        <Link to={`/story/${notification.story.id}`} className="story-link">
                          "{notification.story.title}"
                        </Link>
                      </span>
                    )}
                  </div>

                  <div className="notification-time">
                    {formatTime(notification.createdAt)}
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <div className="unread-dot"></div>
                  )}
                  
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <div className="empty-icon">🔔</div>
              <h3>No notifications</h3>
              <p>
                {filter === 'unread' && 'No unread notifications'}
                {filter === 'read' && 'No read notifications'}
                {filter === 'all' && "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
