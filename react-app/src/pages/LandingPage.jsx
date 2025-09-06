import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const featuredStories = [
    {
      id: 1,
      title: "The Enchanted Forest",
      author: "fantasy_writer",
      genre: "Fantasy",
      reads: "15K",
      description: "A magical journey through an ancient forest where nothing is as it seems."
    },
    {
      id: 2,
      title: "Love in Paris",
      author: "romance_author", 
      genre: "Romance",
      reads: "8.5K",
      description: "A romantic tale set in the beautiful city of Paris."
    },
    {
      id: 3,
      title: "The Last Detective",
      author: "mystery_master",
      genre: "Mystery",
      reads: "12K", 
      description: "A gripping mystery that will keep you guessing until the very end."
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Reading Journey <br />
              <span className="gradient-text">Starts Here</span>
            </h1>
            <p className="hero-description">
              Discover millions of stories, share your own tales, and connect with readers 
              and writers from around the world. Join our community of storytellers today.
            </p>
            
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Start Reading
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="floating-books">
              <div className="book book-1">📚</div>
              <div className="book book-2">📖</div>
              <div className="book book-3">📕</div>
              <div className="book book-4">📗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose BookApp?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Endless Stories</h3>
              <p>Access millions of stories across every genre imaginable</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Create & Share</h3>
              <p>Write your own stories and share them with the world</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Connect</h3>
              <p>Follow your favorite authors and discover new voices</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Read Anywhere</h3>
              <p>Enjoy your stories on any device, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="featured-stories">
        <div className="container">
          <h2 className="section-title">Featured Stories</h2>
          
          <div className="stories-grid">
            {featuredStories.map(story => (
              <div key={story.id} className="featured-story-card">
                <div className="story-cover-placeholder">
                  {story.title.charAt(0)}
                </div>
                
                <div className="story-details">
                  <h3>{story.title}</h3>
                  <p className="story-author">by {story.author}</p>
                  <p className="story-description">{story.description}</p>
                  
                  <div className="story-meta">
                    <span className="genre-tag">{story.genre}</span>
                    <span className="read-count">{story.reads} reads</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="featured-cta">
            <Link to="/register" className="btn btn-primary">
              Join to Read More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Stories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Writers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Readers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Genres</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of readers and writers in our growing community</p>
            
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
