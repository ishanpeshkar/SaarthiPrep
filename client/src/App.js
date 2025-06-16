// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import MainLayout from './components/layout/MainLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InterviewPage from './pages/InterviewPage';
import PracticePage from './pages/PracticePage';
import ResumePage from './pages/ResumePage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ResumeInterviewPage from './pages/ResumeInterviewPage';
import HiringCompaniesPage from './pages/HiringCompaniesPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="resume-interview" element={<ResumeInterviewPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="hiring-companies" element={<HiringCompaniesPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;