// client/src/components/interview/ScheduleInterviewCard.js
import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import './InterviewCards.css';

const ScheduleInterviewCard = ({ onScheduleClick }) => {
  return (
    <div className="interview-card feature-card schedule-card">
      <FiPlusCircle className="feature-icon" />
      <h3>Schedule a New Interview</h3>
      <p>Set up a mock or a real interview and add it to your calendar.</p>
      <button className="btn btn-primary" onClick={onScheduleClick}>
        Schedule Now
      </button>
    </div>
  );
};

export default ScheduleInterviewCard;