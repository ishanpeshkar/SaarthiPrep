import React from 'react';
import './ResumeComponents.css';

const ResumeScoreBanner = ({ scores }) => {
  const getRating = (score) => {
    if (score >= 90) return { text: 'Excellent', className: 'excellent' };
    if (score >= 75) return { text: 'Good', className: 'good' };
    if (score >= 60) return { text: 'Average', className: 'average' };
    return { text: 'Needs Improvement', className: 'improvement-needed' };
  };

  return (
    <div className="resume-score-banner">
      <div className="score-item">
        <span className="score-value">{scores.ats}</span>
        <span className="score-label">ATS Score</span>
        <span className={`score-rating ${getRating(scores.ats).className}`}>
          {getRating(scores.ats).text}
        </span>
      </div>
      <div className="score-item">
        <span className="score-value">{scores.keywords}</span>
        <span className="score-label">Keyword Match</span>
        <span className={`score-rating ${getRating(scores.keywords).className}`}>
          {getRating(scores.keywords).text}
        </span>
      </div>
      <div className="score-item">
        <span className="score-value">{scores.impact}</span>
        <span className="score-label">Impact & Action Verbs</span>
        <span className={`score-rating ${getRating(scores.impact).className}`}>
          {getRating(scores.impact).text}
        </span>
      </div>
      <div className="score-item">
        <span className="score-value">{scores.format}</span>
        <span className="score-label">Formatting</span>
        <span className={`score-rating ${getRating(scores.format).className}`}>
          {getRating(scores.format).text}
        </span>
      </div>
    </div>
  );
};

export default ResumeScoreBanner;