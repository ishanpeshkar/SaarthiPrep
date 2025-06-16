import React, { useState, useEffect, useRef } from 'react';
import api from '../config/api';

const Interview = ({ sessionId, initialQuestion, onComplete }) => {
  const [session, setSession] = useState({
    id: sessionId,
    questions: initialQuestion ? [initialQuestion] : [],
    currentQuestionIndex: 0,
    answers: [],
    completed: false
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const answerHistory = useRef([]);

  // Initialize interview session
  useEffect(() => {
    if (initialQuestion) {
      setIsTimerRunning(true);
    }
  }, [initialQuestion]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  const currentQuestion = session.questions[session.currentQuestionIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitAnswer = async (requestFollowUp = false) => {
    if (!userAnswer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/resume/submit-answer', {
        sessionId: session.id,
        question: currentQuestion,
        answer: userAnswer,
        isFollowUp: isFollowUp,
        requestFollowUp: requestFollowUp
      });

      if (response.data.completed) {
        // Interview completed
        setInterviewComplete(true);
        setSession(prev => ({
          ...prev,
          completed: true,
          answers: [...prev.answers, { question: currentQuestion, answer: userAnswer }]
        }));
        setUserAnswer('');
        setIsTimerRunning(false);
        
        // Get feedback
        const feedbackRes = await api.get(`/resume/feedback/${session.id}`);
        setFeedback(feedbackRes.data.feedback);
        setShowFeedback(true);
        
        if (onComplete) {
          onComplete(feedbackRes.data);
        }
      } else {
        // Move to next question
        setSession(prev => ({
          ...prev,
          questions: [...prev.questions, response.data],
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          answers: [...prev.answers, { question: currentQuestion, answer: userAnswer }]
        }));
        setUserAnswer('');
        setTimer(0);
        setIsFollowUp(response.data.isFollowUp || false);
        answerHistory.current.push({ question: currentQuestion, answer: userAnswer });
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    submitAnswer();
  };

  const handleRequestFollowUp = () => {
    submitAnswer(true);
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  if (!session.questions.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Preparing your interview questions...</p>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Interview Complete! 🎉</h2>
        
        {showFeedback ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {feedback?.overallScore?.toFixed(1)}/5.0
              </div>
              <p className="text-gray-600">{feedback?.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {feedback?.strengths?.map((strength, i) => (
                    <li key={i}>{strength.observation}</li>
                  )) || <li>No specific strengths identified</li>}
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  {feedback?.areasForImprovement?.map((area, i) => (
                    <li key={i}>{area.suggestion}</li>
                  )) || <li>No specific areas for improvement identified</li>}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Your Responses</h3>
              <div className="space-y-4">
                {answerHistory.current.map((item, i) => (
                  <div key={i} className="border-b pb-4">
                    <p className="font-medium">Q: {item.question.text}</p>
                    <p className="text-gray-700 mt-1">A: {item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Generating your feedback...</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header with progress and timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isFollowUp ? 'Follow-up Question' : 'Mock Interview'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isFollowUp ? 'The interviewer would like to know more about your previous answer.' : 'Answer thoughtfully and concisely.'}
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium text-blue-700">
            {session.currentQuestionIndex + 1} / {session.questions.length}
          </div>
          <div className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{currentQuestion?.text}</h3>
            {currentQuestion?.context?.hint && (
              <p className="mt-1 text-sm text-gray-500">{currentQuestion.context.hint}</p>
            )}
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="mb-6">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Response
        </label>
        <div className="relative">
          <textarea
            id="answer"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {userAnswer.length} characters
            </span>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Tips Section */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <button
              type="button"
              className="text-left text-sm leading-5 font-medium text-yellow-700 focus:outline-none"
              onClick={toggleTips}
            >
              {showTips ? 'Hide tips' : 'Show tips for answering'}
            </button>
            {showTips && (
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be specific and provide concrete examples from your experience</li>
                  <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                  <li>Keep your answer concise but informative (1-2 minutes)</li>
                  <li>Relate your answer to the job requirements when possible</li>
                  {isFollowUp && (
                    <li className="font-medium">Since this is a follow-up, provide more details about your previous answer</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to restart the interview? All progress will be lost.')) {
                window.location.reload();
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isTimerRunning ? 'Pause' : 'Resume'}
          </button>
        </div>
        
        <div className="flex space-x-3">
          {!isFollowUp && (
            <button
              type="button"
              onClick={() => handleRequestFollowUp()}
              className="px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading || !userAnswer.trim()}
            >
              Request Follow-up
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading || !userAnswer.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>Submit & {session.currentQuestionIndex === session.questions.length - 1 ? 'Finish' : 'Next'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((session.currentQuestionIndex / session.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(session.currentQuestionIndex / session.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
