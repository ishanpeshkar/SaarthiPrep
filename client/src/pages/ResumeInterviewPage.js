import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import Interview from '../components/Interview';

const ResumeInterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [showInterview, setShowInterview] = useState(false);
  const navigate = useNavigate();

  const handleQuestionsGenerated = (generatedQuestions) => {
    setQuestions(generatedQuestions);
    setShowInterview(true);
  };

  const handleRestart = () => {
    setShowInterview(false);
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI-Powered Interview Preparation
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Upload your resume and practice with personalized interview questions
          </p>
        </div>

        <div className="mt-10">
          {!showInterview ? (
            <ResumeUpload onQuestionsGenerated={handleQuestionsGenerated} />
          ) : (
            <Interview 
              questions={questions} 
              onRestart={handleRestart} 
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeInterviewPage;
