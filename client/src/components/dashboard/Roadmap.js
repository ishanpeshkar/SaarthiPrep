// client/src/components/dashboard/Roadmap.js
import React from 'react';
import './DashboardCard.css';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const Roadmap = ({ steps }) => {
return (
    <div className="dashboard-card full-width">
    <h3>Your Personalized Roadmap</h3>
    <ul className="roadmap-list">
        {steps.map((step) => (
        <li key={step.id} className={`roadmap-step ${step.status}`}>
            {step.status === 'completed' ? <FiCheckCircle className="icon completed" /> : <FiCircle className="icon pending" />}
            <span>{step.title}</span>
        </li>
        ))}
    </ul>
    </div>
);
};

export default Roadmap;