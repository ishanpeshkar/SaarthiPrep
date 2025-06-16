import React, { useState, useEffect, useRef } from 'react';
import api from '../../config/api';
import { FiMic, FiSend, FiSkipForward, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import './ResumeComponents.css';

const AIInterviewer = ({ sessionId, initialQuestion, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setUserAnswer(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setUserAnswer('');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Save the answer
      const updatedAnswers = [...answers, {
        question: currentQuestion,
        answer: userAnswer,
        feedback: null
      }];
      
      setAnswers(updatedAnswers);
      setUserAnswer('');
      
      // Get feedback on the answer
      const response = await api.post('/resume/evaluate-answer', {
        sessionId,
        question: currentQuestion,
        answer: userAnswer,
        questionIndex: currentIndex
      });
      
      // Update with feedback
      updatedAnswers[updatedAnswers.length - 1].feedback = response.data.feedback;
      setAnswers([...updatedAnswers]);
      setFeedback(response.data.feedback);
      setShowFeedback(true);
      
      // Move to next question or complete
      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex].question);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Continue to next question even if feedback fails
      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex].question);
      } else {
        setIsComplete(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex].question);
      setUserAnswer('');
      setFeedback(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleFeedbackRating = async (rating) => {
    try {
      await api.post('/resume/rate-feedback', {
        sessionId,
        questionIndex: currentIndex,
        rating
      });
    } catch (error) {
      console.error('Error submitting feedback rating:', error);
    }
  };

  if (isComplete) {
    return (
      <div className="interview-complete">
        <div className="success-animation">
          <div className="checkmark">✓</div>
        </div>
        <h3>Interview Complete!</h3>
        <p>You've answered all the questions. Great job!</p>
        <div className="interview-stats">
          <div className="stat">
            <span className="stat-value">{answers.length}</span>
            <span className="stat-label">Questions Answered</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {answers.filter(a => a.feedback?.rating > 3).length}
            </span>
            <span className="stat-label">Strong Answers</span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={onComplete}
        >
          Review Your Performance
        </button>
      </div>
    );
  }

  return (
    <div className="ai-interviewer">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
        <span className="progress-text">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="question-card">
        <div className="question-header">
          <h3>Question {currentIndex + 1}</h3>
          <button 
            className="btn btn-link skip-btn"
            onClick={handleSkipQuestion}
            disabled={isLoading}
          >
            <FiSkipForward /> Skip
          </button>
        </div>
        <p className="question-text">{currentQuestion}</p>
      </div>

      {showFeedback && feedback && (
        <div className="feedback-card">
          <h4>Feedback</h4>
          <p>{feedback.comments}</p>
          {feedback.suggestions && (
            <div className="suggestions">
              <h5>Suggestions for improvement:</h5>
              <ul>
                {feedback.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="feedback-rating">
            <p>Was this feedback helpful?</p>
            <div className="rating-buttons">
              <button 
                className="btn-icon"
                onClick={() => handleFeedbackRating(5)}
                title="Very helpful"
              >
                <FiThumbsUp />
              </button>
              <button 
                className="btn-icon"
                onClick={() => handleFeedbackRating(3)}
                title="Somewhat helpful"
              >
                <FiThumbsUp style={{ opacity: 0.6 }} />
              </button>
              <button 
                className="btn-icon"
                onClick={() => handleFeedbackRating(1)}
                title="Not helpful"
              >
                <FiThumbsDown />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitAnswer} className="answer-form">
        <div className="form-group">
          <label htmlFor="answer">Your Answer</label>
          <div className="input-with-button">
            <textarea
              id="answer"
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use the microphone to speak..."
              rows={4}
              disabled={isLoading}
            />
            <button 
              type="button" 
              className={`btn-icon mic-button ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <FiMic />
              {isRecording && <span className="pulse-ring"></span>}
            </button>
          </div>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!userAnswer.trim() || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </form>

      <div className="interview-tips">
        <h4>Tips for your answer:</h4>
        <ul>
          <li>Be specific with examples from your experience</li>
          <li>Use the STAR method (Situation, Task, Action, Result)</li>
          <li>Keep your answer concise but detailed</li>
          <li>Relate your answer to the job requirements when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default AIInterviewer;
