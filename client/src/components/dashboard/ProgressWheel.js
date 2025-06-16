// client/src/components/dashboard/ProgressWheel.js
import React from 'react';
import './DashboardCard.css';

const ProgressWheel = ({ solved, total, acceptance }) => {
const progressPercentage = (solved / total) * 100;

return (
    <div className="dashboard-card">
    <h3>Practice Progress</h3>
    <div className="progress-wheel-container">
        <div className="progress-wheel" style={{ background: `conic-gradient(#4F46E5 ${progressPercentage}%, #e5e7eb ${progressPercentage}%)` }}>
        <div className="progress-text">
            <span>{acceptance}%</span>
            <small>Acceptance</small>
        </div>
        </div>
    </div>
    <p className="progress-summary">Solved: {solved} / {total}</p>
    </div>
);
};

export default ProgressWheel;