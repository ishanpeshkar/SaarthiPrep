// client/src/pages/ProgressPage.js

import React, { useMemo, useState, useEffect } from 'react';
import ReadinessScore from '../components/progress/ReadinessScore';
import SkillsBreakdown from '../components/progress/SkillsBreakdown';
import ProgressTimeline from '../components/progress/ProgressTimeline';
import ATSScoreChecker from '../components/progress/ATSScoreChecker';
import { useWebSocket } from '../hooks/useWebSocket';
import './ProgressPage.css'; // We'll keep this CSS name for now

// DUMMY DATA AGGREGATED FROM OTHER PAGES
const dummyQuizHistory = [
  { id: 1, topic: 'Arrays & Hashing', score: 8, total: 10, date: new Date('2023-10-10').toISOString() },
  { id: 2, topic: 'Two Pointers', score: 6, total: 10, date: new Date('2023-10-12').toISOString() },
  { id: 3, topic: 'Arrays & Hashing', score: 9, total: 10, date: new Date('2023-10-15').toISOString() },
  { id: 4, topic: 'Stack', score: 7, total: 10, date: new Date('2023-10-18').toISOString() },
];

const dummyInterviewHistory = [
  { id: 1, type: 'AI Mock', role: 'SDE 1', date: new Date('2023-10-11').toISOString(), score: 75 },
  { id: 2, type: 'Peer Practice', role: 'Frontend Developer', date: new Date('2023-10-16').toISOString(), score: 88 },
];

const dummyResumeScore = 85;

const ProgressPage = () => {
  const [resumeScore, setResumeScore] = useState(dummyResumeScore);
  const [realTimeData, setRealTimeData] = useState({
    quizzes: [...dummyQuizHistory],
    interviews: [...dummyInterviewHistory]
  });

  // WebSocket connection for real-time updates
  const ws = useWebSocket('ws://localhost:5000/progress-updates', {
    onMessage: (data) => {
      // Handle real-time updates from WebSocket
      if (data.type === 'QUIZ_COMPLETED') {
        setRealTimeData(prev => ({
          ...prev,
          quizzes: [data.payload, ...prev.quizzes]
        }));
      } else if (data.type === 'INTERVIEW_COMPLETED') {
        setRealTimeData(prev => ({
          ...prev,
          interviews: [data.payload, ...prev.interviews]
        }));
      }
    }
  });

  const readinessScore = useMemo(() => {
    if (realTimeData.quizzes.length === 0 || realTimeData.interviews.length === 0) return 0;
    const avgQuizScore = realTimeData.quizzes.reduce((acc, q) => acc + (q.score / q.total), 0) / realTimeData.quizzes.length;
    const avgInterviewScore = realTimeData.interviews.reduce((acc, i) => acc + i.score, 0) / realTimeData.interviews.length;
    const score = (avgQuizScore * 100 * 0.4) + (avgInterviewScore * 0.4) + (resumeScore * 0.2);
    return Math.round(score);
  }, [realTimeData, resumeScore]);

  const skillsData = useMemo(() => {
    const skills = {};
    realTimeData.quizzes.forEach(q => {
      if (!skills[q.topic]) {
        skills[q.topic] = { totalScore: 0, count: 0 };
      }
      skills[q.topic].totalScore += (q.score / q.total) * 100;
      skills[q.topic].count++;
    });
    return Object.entries(skills).map(([subject, data]) => ({
      subject,
      score: Math.round(data.totalScore / data.count),
      fullMark: 100,
    }));
  }, [realTimeData]);

  const timelineData = useMemo(() => {
    const quizzes = realTimeData.quizzes.map(q => ({ type: 'quiz', ...q }));
    const interviews = realTimeData.interviews.map(i => ({ type: 'interview', ...i }));
    return [...quizzes, ...interviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [realTimeData]);

  return (
    <div className="progress-page">
      <h1>Your Progress Dashboard</h1>
      <div className="progress-grid">
        <div className="score-cards">
          <ReadinessScore score={readinessScore} />
          <ATSScoreChecker onScoreUpdate={setResumeScore} />
        </div>
        <SkillsBreakdown data={skillsData} />
        <ProgressTimeline data={timelineData} />
      </div>
    </div>
  );
};

export default ProgressPage; // Exporting the correct component name