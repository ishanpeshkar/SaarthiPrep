// client/src/components/layout/Sidebar.js
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiGrid, FiBriefcase, FiBarChart2, FiFileText, FiGitMerge, FiSettings, FiLogOut, FiUsers } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Add a class when collapsed
    <div className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {isSidebarOpen ? 'SaarthiPrep' : 'SP'}
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link" title="Dashboard">
          <FiGrid /><span>Dashboard</span>
        </NavLink>
        <NavLink to="/interview" className="sidebar-link" title="Interview">
          <FiBriefcase /><span>Interview</span>
        </NavLink>
        <NavLink to="/practice" className="sidebar-link" title="Practice Mode">
          <FiGitMerge /><span>Practice Mode</span>
        </NavLink>
        <NavLink to="/resume" className="sidebar-link" title="Resume">
          <FiFileText /><span>Resume</span>
        </NavLink>
        <NavLink to="/progress" className="sidebar-link" title="My Progress">
          <FiBarChart2 /><span>My Progress</span>
        </NavLink>
        <NavLink to="/hiring-companies" className="sidebar-link" title="Hiring Companies">
          <FiUsers /><span>Hiring Companies</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user" title={user.name}>
             <img src={`https://ui-avatars.com/api/?name=${user.name}&background=4F46E5&color=fff`} alt="avatar" />
             <span>{user.name}</span>
          </div>
        )}
        <NavLink to="/settings" className="sidebar-link" title="Settings">
          <FiSettings /><span>Settings</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link logout-btn" title="Logout">
          <FiLogOut /><span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;