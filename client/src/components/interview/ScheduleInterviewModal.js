// client/src/components/interview/ScheduleInterviewModal.js
import React, { useState } from 'react';
import './ScheduleInterviewModal.css';

const ScheduleInterviewModal = ({ isOpen, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    duration: 30,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.date) {
      alert('Please fill out all fields.');
      return;
    }
    onSchedule(formData);
    onClose(); // Close modal after scheduling
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Schedule Interview</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company</label>
            <input type="text" name="company" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" name="role" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date and Time</label>
            <input type="datetime-local" name="date" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <select name="duration" value={formData.duration} onChange={handleChange}>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;