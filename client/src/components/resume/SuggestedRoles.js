import React from 'react';
import './ResumeComponents.css';

const SuggestedRoles = ({ roles }) => {
  return (
    <div className="practice-card suggested-roles-card">
      <h3>Top Suggested Roles For You</h3>
      <ul className="roles-list">
        {roles.map(role => (
          <li key={role.title} className="role-item">
            <span className="role-title">{role.title}</span>
            <div className="role-match">
              <span className="match-percent">{role.match}%</span>
              <span>Match</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedRoles;