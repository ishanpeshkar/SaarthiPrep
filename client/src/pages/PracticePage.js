import React, { useState } from 'react';
import QuizStartCard from '../components/practice/QuizStartCard';
import QuizResults from '../components/practice/QuizResults';
import QuestionBank from '../components/practice/QuestionBank';
import SoftSkillsCard from '../components/practice/SoftSkillsCard';
import PeerPracticeCard from '../components/practice/PeerPracticeCard';
import QuizInProgress from '../components/practice/QuizInProgress';
import './PracticePage.css';

// Dummy data for past quiz results
const initialQuizHistory = [
  { id: 1, topic: 'Arrays & Hashing', score: 8, total: 10, date: new Date().toISOString() },
  { id: 2, topic: 'Two Pointers', score: 6, total: 10, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
];

const PracticePage = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizHistory, setQuizHistory] = useState(initialQuizHistory);
  const [activeQuizTopic, setActiveQuizTopic] = useState('');

  const handleStartQuiz = (topic) => {
    setActiveQuizTopic(topic);
    setIsQuizActive(true);
  };

  const handleQuizComplete = (result) => {
    setQuizHistory(prevHistory => [result, ...prevHistory]);
    setIsQuizActive(false);
    // In a real app, this is where you'd update the backend and potentially the global state
    // to reflect the new progress on the dashboard.
    alert(`Quiz Complete! Your score: ${result.score}/${result.total}. This will now be reflected in your progress.`);
  };

  // This is the main view of the practice page
  const MainPracticeView = () => (
    <>
      <div className="practice-grid">
        <div className="practice-main-column">
          <QuizStartCard onStartQuiz={handleStartQuiz} />
          <QuizResults history={quizHistory} />
        </div>
        <div className="practice-side-column">
          <QuestionBank />
          <SoftSkillsCard />
        </div>
      </div>
      <PeerPracticeCard />
    </>
  );

  return (
    <div className="practice-page">
      <div className="practice-page-header">
        <h1>Practice Arena</h1>
        <p>Sharpen your skills with quizzes, question banks, and specialized training.</p>
      </div>
      
      {isQuizActive ? (
        <QuizInProgress topic={activeQuizTopic} onComplete={handleQuizComplete} />
      ) : (
        <MainPracticeView />
      )}
    </div>
  );
};

export default PracticePage;