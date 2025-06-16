import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiAward } from 'react-icons/fi';
import './ResumeComponents.css';

const ATSFeedback = ({ scores, jobDescription }) => {
  const getFeedbackForScore = (category, score) => {
    const feedback = {
      strength: '',
      suggestion: '',
      icon: null,
      color: ''
    };

    if (score >= 80) {
      feedback.strength = `Strong ${category}`;
      feedback.suggestion = `Your resume performs well in this area.`;
      feedback.icon = <FiCheckCircle className="feedback-icon success" />;
      feedback.color = 'success';
    } else if (score >= 60) {
      feedback.strength = `Moderate ${category}`;
      feedback.suggestion = `There's room for improvement here.`;
      feedback.icon = <FiInfo className="feedback-icon info" />;
      feedback.color = 'info';
    } else {
      feedback.strength = `Needs improvement in ${category}`;
      feedback.suggestion = `Consider enhancing this aspect of your resume.`;
      feedback.icon = <FiAlertTriangle className="feedback-icon warning" />;
      feedback.color = 'warning';
    }

    switch (category.toLowerCase()) {
      case 'ats':
        feedback.details = 'Overall ATS compatibility score based on content, format, and relevance.';
        break;
      case 'keywords':
        feedback.details = 'How well your resume matches common industry keywords and job requirements.';
        break;
      case 'skills':
        feedback.details = 'The breadth and relevance of your technical and soft skills.';
        break;
      case 'experience':
        feedback.details = 'The depth and relevance of your professional experience.';
        break;
      case 'education':
        feedback.details = 'Your educational background and certifications.';
        break;
      case 'format':
        feedback.details = 'The structure and readability of your resume.';
        break;
      default:
        feedback.details = '';
    }

    return feedback;
  };

  const feedbacks = Object.entries(scores).map(([category, score]) => ({
    category,
    score,
    ...getFeedbackForScore(category, score)
  }));

  const overallFeedback = scores.ats >= 80
    ? 'Your resume looks strong! It should perform well with most ATS systems.'
    : scores.ats >= 60
    ? 'Your resume is decent but could use some improvements to be more competitive.'
    : 'Your resume needs significant improvements to be ATS-friendly.';

  return (
    <div className="ats-feedback">
      <div className="feedback-header">
        <h3>Resume Analysis</h3>
        <p className="feedback-summary">
          <FiAward className="award-icon" /> {overallFeedback}
        </p>
      </div>

      <div className="feedback-grid">
        {feedbacks.map((item, index) => (
          <div key={index} className={`feedback-item ${item.color}`}>
            <div className="feedback-category">
              {item.icon}
              <span className="category-name">{item.category}</span>
              <span className="category-score">{item.score}/100</span>
            </div>
            <div className="feedback-details">
              <p className="feedback-strength">{item.strength}</p>
              <p className="feedback-suggestion">{item.suggestion}</p>
              <p className="feedback-more">{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      {jobDescription && (
        <div className="job-description-feedback">
          <h4>Job Description Match</h4>
          <p>Your resume has been analyzed against the provided job description.</p>
          <div className="match-stats">
            <div className="stat">
              <span className="stat-value">{scores.keywordMatches || 0}</span>
              <span className="stat-label">Keywords Matched</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {scores.totalKeywords ? Math.round((scores.keywordMatches / scores.totalKeywords) * 100) : 0}%
              </span>
              <span className="stat-label">Match Rate</span>
            </div>
          </div>
        </div>
      )}

      <div className="improvement-tips">
        <h4>Tips to Improve Your Resume</h4>
        <ul>
          {scores.keywords < 70 && (
            <li>
              <strong>Add more relevant keywords</strong> from the job description to improve ATS matching.
            </li>
          )}
          {scores.skills < 70 && (
            <li>
              <strong>Highlight key skills</strong> in a dedicated skills section and throughout your experience.
            </li>
          )}
          {scores.experience < 70 && (
            <li>
              <strong>Quantify your achievements</strong> with metrics and specific results.
            </li>
          )}
          {scores.format < 70 && (
            <li>
              <strong>Improve formatting</strong> with clear section headers and consistent styling.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ATSFeedback;
