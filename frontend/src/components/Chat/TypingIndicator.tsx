import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
  label: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ label }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
      <span className="typing-label">{label}</span>
    </div>
  );
};

export default TypingIndicator;
