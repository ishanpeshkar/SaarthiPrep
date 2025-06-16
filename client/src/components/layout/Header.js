// client/src/components/layout/Header.js
import React from 'react';
import { FiMenu } from 'react-icons/fi';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FiMenu />
      </button>
      {/* Other header content like notifications or user profile can go here */}
    </header>
  );
};

export default Header;