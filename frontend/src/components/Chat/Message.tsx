import React from 'react';
import { motion } from 'framer-motion';
import './Message.css';
import MessageAttachment from '../Message/MessageAttachment';
import TypingIndicator from './TypingIndicator';
import type { Message as MessageType } from '../Message/Message';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
        <span className="message-role">{isUser ? 'You' : 'Nez AI'}</span>

        {message.attachment && message.attachment.type === 'image' && (
          <MessageAttachment attachment={message.attachment} />
        )}

        <div className="message-body">
          {message.isTyping ? (
            <TypingIndicator label={message.content} />
          ) : (
            <p className="message-content">{message.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;