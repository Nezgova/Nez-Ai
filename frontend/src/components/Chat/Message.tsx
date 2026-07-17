import React from 'react';
import './Message.css';
import type { Message as MessageType } from '../Message/Message';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`}>
      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
        <span className="message-role">{isUser ? 'You' : 'Nez AI'}</span>
        <p className="message-content">{message.content}</p>
      </div>
    </div>
  );
};

export default Message;