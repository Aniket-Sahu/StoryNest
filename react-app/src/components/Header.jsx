import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <h1>BookApp</h1>
          </Link>

          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link">Stories</Link>
            <Link to="/my-reads" className="nav-link">My Reads</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </nav>
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          <Link to="/notifications" className="notification-bell">
            <span className="bell-icon">🔔</span>
          </Link>

          <div className="profile-dropdown">
            <button
              className="profile-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="profile-username">{user?.username}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileDropdown && (
              <div className="dropdown-menu">
                <Link to={`/profile/${user?.id}`} className="dropdown-item">
                  View Profile
                </Link>
                <Link to="/profile/edit" className="dropdown-item">
                  Edit Profile
                </Link>
                <Link to="/create-story" className="dropdown-item">
                  Create Story
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
