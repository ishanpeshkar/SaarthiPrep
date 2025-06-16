// client/src/components/interview/StartInterviewCard.js
import React from 'react';
import { FiPlayCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import './InterviewCards.css';

const StartInterviewCard = ({ nextInterview }) => {
  return (
    <div className="interview-card feature-card start-card">
      <FiPlayCircle className="feature-icon" />
      <h3>Your Next Interview</h3>
      {nextInterview ? (
        <>
          <p className="next-interview-details">
            <strong>{nextInterview.company}</strong> - {nextInterview.role}
          </p>
          <p className="next-interview-time">
            {format(new Date(nextInterview.date), "EEE, MMM d, yyyy 'at' h:mm a")}
          </p>
          <button className="btn btn-secondary">Start Now</button>
        </>
      ) : (
        <p>No upcoming interviews scheduled. Great time to practice!</p>
      )}
    </div>
  );
};

export default StartInterviewCard;