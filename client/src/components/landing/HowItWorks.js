import React from 'react';

const steps = [
  { title: "Sign Up & Set Goals", description: "Create your account and tell us your career aspirations and current skills." },
  { title: "Get Your Custom Roadmap", description: "Our AI generates a personalized preparation plan just for you." },
  { title: "Practice & Learn", description: "Engage with mock interviews, the question bank, and skill modules." },
  { title: "Track & Improve", description: "Review your performance analytics and refine your skills based on feedback." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section" style={{backgroundColor: '#F3F4F6'}}>
      <div className="container">
        <h2 className="section-title">How SaarthiPrep Works</h2>
        <div className="timeline">
          {steps.map((step, index) => (
            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <h3>{index + 1}. {step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;