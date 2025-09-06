import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} BookApp. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="/about" className="footer-link">About</a>
          <a href="/terms" className="footer-link">Terms</a>
          <a href="/privacy" className="footer-link">Privacy</a>
          <a href="/contact" className="footer-link">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
