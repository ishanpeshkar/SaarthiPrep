import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <h3>SaarthiPrep</h3>
            <p>Your smart interview preparation buddy.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} SaarthiPrep. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;