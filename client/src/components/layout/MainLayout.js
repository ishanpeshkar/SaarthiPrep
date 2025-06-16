// client/src/components/layout/MainLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Import the new Header
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    // Add a class based on the sidebar state
    <div className={`main-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="content-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;