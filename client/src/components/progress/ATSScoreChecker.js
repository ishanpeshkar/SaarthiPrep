import React, { useState, useEffect } from 'react';
import { FiUpload, FiAward } from 'react-icons/fi';
import './ProgressComponents.css';

const ATSScoreChecker = ({ onScoreUpdate }) => {
  const [score, setScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState({
    keywords: [],
    suggestions: [],
    matchPercentage: 0
  });

  // Simulate ATS score analysis (in a real app, this would be an API call)
  const analyzeResume = (file) => {
    return new Promise((resolve) => {
      setIsAnalyzing(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // This is a mock analysis - in a real app, you would parse the resume
        // and analyze content against job descriptions
        const mockScore = Math.floor(Math.random() * 40) + 60; // Score between 60-100
        const mockAnalysis = {
          keywords: ['React', 'Node.js', 'MongoDB', 'REST API', 'Problem Solving'],
          suggestions: [
            'Add more technical skills',
            'Include metrics in work experience',
            'Add relevant certifications'
          ],
          matchPercentage: mockScore
        };
        
        setScore(mockScore);
        setAnalysis(mockAnalysis);
        onScoreUpdate?.(mockScore);
        setIsAnalyzing(false);
        resolve(mockScore);
      }, 2000);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      analyzeResume(file);
    }
  };

  return (
    <div className="ats-score-checker progress-card">
      <h3>Resume ATS Score</h3>
      
      {!score ? (
        <div className="upload-container">
          <div className="upload-area">
            <FiUpload className="upload-icon" />
            <p>Upload your resume to check ATS compatibility</p>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="resume-upload" className="upload-button">
              Choose File
            </label>
          </div>
        </div>
      ) : (
        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{score}</span>
            <span className="score-label">ATS Score</span>
          </div>
          
          <div className="analysis-results">
            <h4>Analysis Results</h4>
            <div className="keywords-section">
              <h5>Strong Keywords:</h5>
              <div className="keywords-list">
                {analysis.keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag">{kw}</span>
                ))}
              </div>
            </div>
            
            <div className="suggestions-section">
              <h5>Suggestions for Improvement:</h5>
              <ul>
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button 
            className="reanalyze-button"
            onClick={() => setScore(null)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Re-upload Resume'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ATSScoreChecker;
