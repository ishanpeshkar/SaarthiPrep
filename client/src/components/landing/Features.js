import React from 'react';

const featureList = [
  { icon: "🎯", title: "Personalized Roadmaps", description: "Custom learning paths based on your career goals and skill level." },
  { icon: "🤖", title: "AI Mock Interview", description: "Realistic voice-enabled mock interviews with instant, detailed feedback." },
  { icon: "📚", title: "Question Bank", description: "Access a vast library of questions from top companies with real-time trends." },
  { icon: "🎭", title: "Soft Skills Training", description: "Dedicated modules for behavioral rounds to improve your communication." },
  { icon: "📊", title: "Performance Analytics", description: "Track your progress, identify weak areas, and get skill improvement suggestions." },
  { icon: "🤝", title: "Peer Practice Mode", description: "Practice with peers, give and receive feedback, and learn together." },
];

const Features = () => {
  return (
    <section id="features" className="section">
      <div className="container">
        <h2 className="section-title">Everything You Need to Succeed</h2>
        <div className="features-grid">
          {featureList.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;