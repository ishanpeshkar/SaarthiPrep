import React, { useState, useMemo } from 'react';
import ScheduleInterviewCard from '../components/interview/ScheduleInterviewCard';
import StartInterviewCard from '../components/interview/StartInterviewCard';
import UpcomingInterviewList from '../components/interview/UpcomingInterviewList';
import PastInterviewList from '../components/interview/PastInterviewList';
import ScheduleInterviewModal from '../components/interview/ScheduleInterviewModal';
import './InterviewPage.css';

// DUMMY DATA - This would normally come from your backend
const initialInterviews = [
  { 
    id: 1, 
    company: 'Google', 
    role: 'Software Engineer', 
    date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    duration: 60, 
    status: 'upcoming' 
  },
  { 
    id: 2, 
    company: 'Facebook', 
    role: 'Product Manager', 
    date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    duration: 45, 
    status: 'upcoming' 
  },
  { 
    id: 3, 
    company: 'Amazon', 
    role: 'Cloud Engineer', 
    date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    duration: 60, 
    status: 'completed',
    feedback: 'Great problem-solving skills, but need to improve on system design explanations. The STAR method was used effectively.'
  },
];


const InterviewPage = () => {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize filtered lists to avoid re-calculating on every render
  const upcomingInterviews = useMemo(() => 
    interviews
      .filter(iv => iv.status === 'upcoming')
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [interviews]
  );

  const pastInterviews = useMemo(() =>
    interviews
      .filter(iv => iv.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [interviews]
  );

  const handleScheduleInterview = (newInterviewData) => {
    const newInterview = {
      ...newInterviewData,
      id: Date.now(), // Simple unique ID
      status: 'upcoming',
    };
    setInterviews(prev => [...prev, newInterview]);
    // In a real app, you would also post this to your backend API
  };

  const handleDeleteInterview = (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      setInterviews(prev => prev.filter(iv => iv.id !== id));
      // In a real app, you would also send a DELETE request to your API
    }
  };

  const handleReschedule = (id) => {
    // For now, this is a placeholder. A real implementation would likely
    // open the modal again with the existing data to be edited.
    alert(`Reschedule functionality for interview ID: ${id} would be implemented here.`);
  };

  return (
    <div className="interview-page">
      <div className="interview-page-header">
        <h1>Interviews</h1>
        <p>Schedule, practice, and review your interviews all in one place.</p>
      </div>

      <div className="interview-actions-grid">
        <ScheduleInterviewCard onScheduleClick={() => setIsModalOpen(true)} />
        <StartInterviewCard nextInterview={upcomingInterviews[0]} />
      </div>

      <UpcomingInterviewList 
        interviews={upcomingInterviews}
        onDelete={handleDeleteInterview}
        onReschedule={handleReschedule}
      />
      
      <PastInterviewList interviews={pastInterviews} />

      <ScheduleInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleScheduleInterview}
      />
    </div>
  );
};

export default InterviewPage;