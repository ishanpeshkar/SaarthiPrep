import React from 'react';
import { FiClipboard, FiMic } from 'react-icons/fi';
import { format } from 'date-fns';
import './ProgressComponents.css';

const ProgressTimeline = ({ data }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'quiz': return <FiClipboard />;
      case 'interview': return <FiMic />;
      default: return null;
    }
  };

  const renderDetails = (item) => {
    if (item.type === 'quiz') {
      return (
        <p>Completed <strong>{item.topic}</strong> quiz with a score of <strong>{item.score}/{item.total}</strong>.</p>
      );
    }
    if (item.type === 'interview') {
      return (
        <p>Completed <strong>{item.type}</strong> interview for <strong>{item.role}</strong> and scored <strong>{item.score}%</strong>.</p>
      );
    }
    return null;
  };

  return (
    <div className="progress-card timeline-section">
      <h3>Progress Over Time</h3>
      <div className="timeline-container">
        {data.map(item => (
          <div key={item.id} className="timeline-item">
            <div className={`timeline-icon ${item.type}`}>
              {getIcon(item.type)}
            </div>
            <div className="timeline-content">
              <span className="timeline-date">{format(new Date(item.date), 'MMMM d, yyyy')}</span>
              {renderDetails(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTimeline;