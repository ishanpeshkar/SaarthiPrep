// client/src/components/interview/UpcomingInterviewList.js
import React from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { format } from 'date-fns';
import './InterviewCards.css';

const UpcomingInterviewList = ({ interviews, onDelete, onReschedule }) => {
  return (
    <div className="interview-list-section">
      <h2>Upcoming Interviews</h2>
      {interviews.length > 0 ? (
        <div className="horizontal-scroll-container">
          {interviews.map(iv => (
            <div key={iv.id} className="interview-card upcoming-card">
              <h4>{iv.company}</h4>
              <p>{iv.role}</p>
              <p className="interview-time">{format(new Date(iv.date), 'MMM d, h:mm a')}</p>
              <div className="card-actions">
                <button onClick={() => onReschedule(iv.id)} className="action-btn reschedule-btn" title="Reschedule">
                  <FiEdit />
                </button>
                <button onClick={() => onDelete(iv.id)} className="action-btn delete-btn" title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no upcoming interviews.</p>
      )}
    </div>
  );
};

export default UpcomingInterviewList;