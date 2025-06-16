// client/src/pages/DashboardPage.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import InterviewStats from '../components/dashboard/InterviewStats';
import Roadmap from '../components/dashboard/Roadmap';
import ProgressWheel from '../components/dashboard/ProgressWheel';
import UpcomingInterviews from '../components/dashboard/UpcomingInterviews';
import './DashboardPage.css';

// DUMMY DATA (remains the same)
const dummyInterviewData = { count: 5 };
const dummyRoadmapData = [
  { id: 1, title: 'Complete "Arrays & Hashing" practice set', status: 'completed' },
  { id: 2, title: 'Take first AI mock interview for "SDE 1"', status: 'completed' },
  { id: 3, title: 'Study "System Design Basics"', status: 'in-progress' },
  { id: 4, title: 'Build a project for your resume', status: 'pending' },
];
const dummyProgressData = { solved: 75, total: 150, acceptance: 88 };
const dummyUpcomingInterviews = [
  { id: 1, company: 'Google', role: 'Software Engineer', date: 'Oct 25, 2023' },
  { id: 2, company: 'Amazon', role: 'Cloud Engineer', date: 'Nov 2, 2023' },
  { id: 3, company: 'Microsoft', role: 'Product Manager', date: 'Nov 10, 2023' },
];

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-page">
      {/* --- MODIFICATION START --- */}
      <div className="dashboard-header">
        {user ? (
          <h1 className="dashboard-welcome">Welcome back, {user.name}!</h1>
        ) : (
          <h1 className="dashboard-welcome">Loading...</h1>
        )}
        <p className="dashboard-subtext">Here's a snapshot of your preparation journey.</p>
      </div>
      {/* --- MODIFICATION END --- */}
      
      <div className="dashboard-grid">
        <InterviewStats count={dummyInterviewData.count} />
        <Roadmap steps={dummyRoadmapData} />
        <ProgressWheel 
          solved={dummyProgressData.solved} 
          total={dummyProgressData.total} 
          acceptance={dummyProgressData.acceptance} 
        />
      </div>
      
      <UpcomingInterviews interviews={dummyUpcomingInterviews} />
    </div>
  );
};

export default DashboardPage;