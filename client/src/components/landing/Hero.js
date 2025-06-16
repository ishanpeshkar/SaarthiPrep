import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="headline">
          Your Smart Interview <span>Preparation Buddy</span>
        </h1>
        <p className="subtext">
          A comprehensive and intelligent platform designed to help you prepare for job interviews efficiently through AI-powered personalization.
        </p>
        <div className="hero-buttons">
          <a href="#features" className="btn btn-primary">Get Started</a>
          <a href="#demo" className="btn btn-secondary">Watch Demo</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;