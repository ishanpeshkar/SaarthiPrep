// client/src/components/interview/PastInterviewList.js
import React from 'react';
import { format } from 'date-fns';
import './InterviewCards.css';

const PastInterviewList = ({ interviews }) => {
  const handleViewFeedback = (feedback) => {
    alert(`Feedback:\n\n${feedback}`);
  };

  return (
    <div className="interview-list-section">
      <h2>Past Interviews</h2>
      {interviews.length > 0 ? (
        <div className="past-interviews-container">
          {interviews.map(iv => (
            <div key={iv.id} className="past-interview-item">
              <div className="past-interview-info">
                <h4>{iv.company} - <span>{iv.role}</span></h4>
                <p>{format(new Date(iv.date), 'MMMM d, yyyy')}</p>
              </div>
              <button className="btn btn-secondary" onClick={() => handleViewFeedback(iv.feedback)}>
                View Feedback
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no past interview records.</p>
      )}
    </div>
  );
};

export default PastInterviewList;