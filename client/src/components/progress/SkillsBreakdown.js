import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import './ProgressComponents.css';

const SkillsBreakdown = ({ data }) => {
  return (
    <div className="progress-card">
      <h3>Skills Breakdown</h3>
      {data && data.length > 0 ? (
        <div className="chart-wrapper" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Skill Score" dataKey="score" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-state">No skills data available yet.</div>
      )}
    </div>
  );
};

export default SkillsBreakdown;