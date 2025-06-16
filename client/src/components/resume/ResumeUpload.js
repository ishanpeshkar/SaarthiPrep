import React, { useState, useRef } from 'react';
import './ResumeComponents.css';
import { FiUploadCloud, FiFileText, FiX, FiCopy } from 'react-icons/fi';

const ResumeUpload = ({ onFileSelect, onJobDescriptionChange, jobDescription, isLoading }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleFileClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handlePasteClick = (e) => {
    e.stopPropagation();
    setShowPasteModal(true);
  };

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    if (pastedText.trim()) {
      onJobDescriptionChange(pastedText);
      setPastedText('');
      setShowPasteModal(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  const handleClearJobDescription = (e) => {
    e.stopPropagation();
    onJobDescriptionChange('');
  };

  return (
    <div className="resume-upload-container">
      <div 
        className={`resume-upload-box ${isDraggingOver ? 'dragging-over' : ''} ${isLoading ? 'loading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Analyzing your resume...</p>
          </div>
        ) : (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileInputChange}
              accept=".pdf"
            />
            <FiUploadCloud className="upload-icon" />
            <h3>Drag & Drop your Resume here</h3>
            <p>or</p>
            <div className="upload-actions">
              <button 
                className="btn btn-primary"
                onClick={handleFileClick}
              >
                Browse Files
              </button>
              <span className="or-divider">OR</span>
              <button 
                className="btn btn-secondary"
                onClick={handlePasteClick}
              >
                <FiFileText /> Paste Job Description
              </button>
            </div>
            <p className="upload-note">Only PDF files are accepted (Max 5MB)</p>
          </>
        )}
      </div>

      {jobDescription && (
        <div className="job-description-preview">
          <div className="job-description-header">
            <h4>Job Description</h4>
            <button 
              className="btn-icon"
              onClick={handleClearJobDescription}
              title="Clear job description"
            >
              <FiX />
            </button>
          </div>
          <div className="job-description-content">
            {jobDescription.length > 200 
              ? `${jobDescription.substring(0, 200)}...` 
              : jobDescription}
          </div>
        </div>
      )}

      {showPasteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Paste Job Description</h3>
              <button 
                className="btn-icon"
                onClick={() => setShowPasteModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="paste-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={handlePasteFromClipboard}
                >
                  <FiCopy /> Paste from Clipboard
                </button>
              </div>
              <textarea
                className="form-control"
                placeholder="Or type/paste the job description here..."
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPasteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim()}
              >
                Save Job Description
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;