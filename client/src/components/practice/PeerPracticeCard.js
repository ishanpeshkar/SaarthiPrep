import React from 'react';
import './PracticeComponents.css';

const PeerPracticeCard = () => {
  return (
    <div className="practice-card peer-card">
      <h3>Peer-to-Peer Practice Mode</h3>
      <p>Ready to apply your skills? Connect with a peer for a live mock interview. Give and receive valuable feedback.</p>
      <button className="btn btn-primary">Find a Partner</button>
    </div>
  );
};

export default PeerPracticeCard;