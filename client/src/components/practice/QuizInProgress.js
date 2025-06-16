import React, { useState, useMemo } from 'react';
import './PracticeComponents.css';

const quizData = {
  'Arrays & Hashing': [
    { question: 'Which data structure is best for mapping keys to values?', options: ['Array', 'Set', 'Hash Map', 'Stack'], correctAnswer: 'Hash Map' },
    { question: 'What is the time complexity of accessing an element in an array by its index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
    // ... add 8 more questions for a total of 10
  ],
  // ... add question arrays for other topics
};

const QuizInProgress = ({ topic, onComplete }) => {
  const questions = useMemo(() => quizData[topic] || quizData['Arrays & Hashing'], [topic]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 0: 'Answer', 1: 'Answer' }

  const handleSelectOption = (option) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of quiz
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    onComplete({
      id: Date.now(),
      topic,
      score,
      total: questions.length,
      date: new Date().toISOString()
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="practice-card quiz-in-progress">
      <h3>{topic} Quiz</h3>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="quiz-question-container">
        <h4>{currentQuestionIndex + 1}. {currentQuestion.question}</h4>
        <div className="quiz-options">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              className={`option-btn ${userAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
};

export default QuizInProgress;