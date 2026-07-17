import React from 'react';
import './Header.css';
import Button from '../Common/Button';

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M19.4 13a7.9 7.9 0 000-2l1.8-1.4-2-3.4-2.1.7a7.9 7.9 0 00-1.7-1l-.3-2.2h-4l-.3 2.2a7.9 7.9 0 00-1.7 1l-2.1-.7-2 3.4L4.6 11a7.9 7.9 0 000 2l-1.8 1.4 2 3.4 2.1-.7a7.9 7.9 0 001.7 1l.3 2.2h4l.3-2.2a7.9 7.9 0 001.7-1l2.1.7 2-3.4L19.4 13z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header-titles">
        <h1 className="app-header-title">Nez AI</h1>
        <p className="app-header-subtitle">Private Local AI Assistant</p>
      </div>

      <div className="app-header-actions">
        <Button variant="ghost" title="Settings">
          <SettingsIcon />
          <span>Settings</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;