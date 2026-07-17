import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, FileText, Bug, GitBranch } from 'lucide-react';
import './ChatWindow.css';
import Message from './Message';
import type { Message as MessageType } from '../Message/Message';

interface ExamplePrompt {
  icon: React.ReactNode;
  label: string;
}

const examplePrompts: ExamplePrompt[] = [
  { icon: <Code2 size={17} />, label: 'Explain this code' },
  { icon: <FileText size={17} />, label: 'Summarize this PDF' },
  { icon: <GitBranch size={17} />, label: 'Analyze this repository' },
  { icon: <Bug size={17} />, label: 'Help me debug' },
];

interface ChatWindowProps {
  messages: MessageType[];
  onExampleClick: (prompt: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onExampleClick }) => {
  if (messages.length === 0) {
    return (
      <div className="chat-window">
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="empty-state-logo"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles size={30} />
          </motion.div>
          <h2 className="empty-state-title">Welcome to Nez AI</h2>
          <p className="empty-state-subtitle">
            Your private, local AI assistant. Fully offline. Fully yours.
          </p>

          <div className="empty-state-grid">
            {examplePrompts.map((prompt, index) => (
              <motion.button
                key={prompt.label}
                className="empty-state-card"
                type="button"
                onClick={() => onExampleClick(prompt.label)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="empty-state-card-icon">{prompt.icon}</span>
                <span>{prompt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-inner">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;