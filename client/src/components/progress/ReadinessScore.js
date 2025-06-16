import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import './ProgressComponents.css';

const ReadinessScore = ({ score }) => {
  const chartScore = typeof score === 'number' ? score : 0;
  const data = [{ name: 'Readiness', value: chartScore }];

  return (
    <div className="progress-card">
      <h3>Overall Readiness Score</h3>
      <div className="chart-wrapper" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0} barSize={30}>
            <RadialBar background clockWise dataKey='value' cornerRadius={15} fill="var(--primary-color)" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="readiness-score-label">
          <span>{chartScore}%</span>
          <p>Ready</p>
        </div>
      </div>
      <p className="card-footer-note">This score is a weighted average of your quiz, interview, and resume performance.</p>
    </div>
  );
};

export default ReadinessScore;