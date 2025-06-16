import React, { useState } from 'react';
import './PracticeComponents.css';

const QuizStartCard = ({ onStartQuiz }) => {
  const [selectedTopic, setSelectedTopic] = useState('Arrays & Hashing');

  const handleStart = () => {
    if (selectedTopic) {
      onStartQuiz(selectedTopic);
    }
  };

  return (
    <div className="practice-card">
      <h3>Take a Quick Quiz</h3>
      <p>Test your knowledge on a specific topic with a 10-question quiz.</p>
      <div className="quiz-start-controls">
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
          <option>Arrays & Hashing</option>
          <option>Two Pointers</option>
          <option>Stack</option>
          <option>Binary Search</option>
          <option>Linked List</option>
        </select>
        <button className="btn btn-primary" onClick={handleStart}>Start Quiz</button>
      </div>
    </div>
  );
};

export default QuizStartCard;