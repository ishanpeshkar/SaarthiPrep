// client/src/components/dashboard/UpcomingInterviews.js
import React from 'react';
import './DashboardCard.css';

const UpcomingInterviews = ({ interviews }) => {
return (
    <div className="upcoming-interviews-banner">
    <div className="moving-text">
        {interviews.map(interview => (
        <span key={interview.id} className="interview-item">
            <strong>{interview.company}</strong> ({interview.role}) - {interview.date}
        </span>
        ))}
        {/* Duplicate for seamless loop */}
        {interviews.map(interview => (
        <span key={`${interview.id}-clone`} className="interview-item">
            <strong>{interview.company}</strong> ({interview.role}) - {interview.date}
        </span>
        ))}
    </div>
    </div>
);
};

export default UpcomingInterviews;