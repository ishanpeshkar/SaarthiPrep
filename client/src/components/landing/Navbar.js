import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar container">
      <div className="logo">SaarthiPrep</div>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How it Works?</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>
      <div className="nav-auth">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;