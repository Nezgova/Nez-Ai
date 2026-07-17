import React, { useState } from 'react';
import './ChatInput.css';

const AttachmentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M8 12.5l6.5-6.5a3 3 0 114.24 4.24l-8.5 8.5a5 5 0 11-7.07-7.07L11 3.83"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 11a7 7 0 0014 0M12 18v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12l16-8-6 8 6 8-16-8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="currentColor"
    />
  </svg>
);

const ChatInput: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-bar">
        <button className="chat-input-icon-btn" type="button" title="Attach file">
          <AttachmentIcon />
        </button>

        <input
          className="chat-input-field"
          type="text"
          placeholder="Message Nez AI..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button className="chat-input-icon-btn" type="button" title="Voice input">
          <MicIcon />
        </button>

        <button className="chat-input-send-btn" type="button" title="Send message">
          <SendIcon />
        </button>
      </div>
      <p className="chat-input-hint">Nez AI runs fully local. Nothing leaves your device.</p>
    </div>
  );
};

export default ChatInput;