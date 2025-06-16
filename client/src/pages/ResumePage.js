import React, { useState, useRef, useEffect } from 'react';
import api from '../config/api';
import ResumeUpload from '../components/resume/ResumeUpload';
import SuggestedRoles from '../components/resume/SuggestedRoles';
import ResumeScoreBanner from '../components/resume/ResumeScoreBanner';
import ATSFeedback from '../components/resume/ATSFeedback';
import AIInterviewer from '../components/resume/AIInterviewer';
import { FiFileText, FiRefreshCw, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import './ResumePage.css';

const ResumePage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('analysis');
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError('Please upload a valid PDF file (max 5MB)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds 5MB limit');
      return;
    }

    setResumeFile(file);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await api.post('/resume/start-interview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { data } = response;
      if (data.success) {
        setAnalysisResult({
          scores: data.atsScore,
          questions: data.questions,
          currentQuestion: data.question,
          questionType: data.questionType,
          context: data.context,
          progress: data.progress,
        });
        setSessionId(data.sessionId);
        setActiveTab('interview');
      } else {
        throw new Error(data.message || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobDescriptionChange = (text) => {
    setJobDescription(text);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setAnalysisResult(null);
    setJobDescription('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetryAnalysis = () => {
    setError(null);
    if (resumeFile) {
      handleFileSelect(resumeFile);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-page-header">
        <h1>Resume Hub</h1>
        <p>Upload your resume to get AI-powered feedback and job recommendations.</p>
      </div>

      <div className="resume-content-area">
        {!resumeFile ? (
          <ResumeUpload 
            onFileSelect={handleFileSelect} 
            onJobDescriptionChange={handleJobDescriptionChange}
            jobDescription={jobDescription}
            isLoading={isAnalyzing}
          />
        ) : (
          <div className="resume-analysis-container">
            <div className="practice-card resume-info-card">
              <div className="file-info">
                <FiFileText className="file-icon" />
                <div>
                  <div className="file-name">{resumeFile.name}</div>
                  <div className="file-size">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-outline"
                onClick={handleRemoveResume}
                disabled={isAnalyzing}
              >
                <FiRefreshCw className={isAnalyzing ? 'spin' : ''} /> 
                {isAnalyzing ? 'Analyzing...' : 'Upload New'}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <FiAlertTriangle className="error-icon" />
                <span>{error}</span>
                <button 
                  className="btn btn-link" 
                  onClick={handleRetryAnalysis}
                >
                  Try Again
                </button>
              </div>
            )}

            {isAnalyzing ? (
              <div className="analyzing-overlay">
                <div className="analyzing-indicator">
                  <div className="spinner"></div>
                  <h3>Analyzing Your Resume</h3>
                  <p>This may take a moment. We're evaluating your resume for ATS compatibility and preparing personalized questions.</p>
                </div>
              </div>
            ) : analysisResult ? (
              <>
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analysis')}
                  >
                    ATS Analysis
                  </button>
                  <button 
                    className={`tab ${activeTab === 'interview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('interview')}
                    disabled={!analysisResult.questions?.length}
                  >
                    Practice Interview
                    {analysisResult.questions?.length > 0 && (
                      <span className="badge">{analysisResult.questions.length} questions</span>
                    )}
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'analysis' ? (
                    <div className="analysis-tab">
                      <ResumeScoreBanner scores={analysisResult.scores} />
                      <ATSFeedback 
                        scores={analysisResult.scores} 
                        jobDescription={jobDescription}
                      />
                    </div>
                  ) : (
                    <AIInterviewer 
                      sessionId={sessionId}
                      initialQuestion={analysisResult.currentQuestion}
                      questions={analysisResult.questions}
                      onComplete={() => setActiveTab('analysis')}
                    />
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;