import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import './PracticeComponents.css';

const QuizResults = ({ history }) => {
  return (
    <div className="practice-card">
      <h3>Previous Quiz Results</h3>
      <ul className="results-list">
        {history.length > 0 ? history.map(result => (
          <li key={result.id} className="result-item">
            <div className="result-info">
              <span className="result-topic">{result.topic}</span>
              <span className="result-date">{formatDistanceToNow(new Date(result.date), { addSuffix: true })}</span>
            </div>
            <div className="result-score">
              {result.score}/{result.total}
            </div>
          </li>
        )) : <p>No quiz history yet. Take a quiz to get started!</p>}
      </ul>
    </div>
  );
};

export default QuizResults;