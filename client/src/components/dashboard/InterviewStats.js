// client/src/components/dashboard/InterviewStats.js
import React from 'react';
import './DashboardCard.css';

const InterviewStats = ({ count }) => {
return (
    <div className="dashboard-card">
    <h3>Interviews Taken</h3>
    <p className="stat-number">{count}</p>
    </div>
);
};

export default InterviewStats;