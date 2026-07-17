import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Mic, Image as ImageIcon, Send } from 'lucide-react';
import './ChatInput.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (value.trim().length === 0) return;
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <motion.div
        className={`chat-input-bar ${focused ? 'chat-input-bar--focused' : ''}`}
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(212,175,55,0.5), 0 8px 30px rgba(212,175,55,0.12)'
            : '0 2px 10px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button
          className="chat-input-icon-btn"
          type="button"
          title="Attach file"
          whileHover={{ scale: 1.08, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
        >
          <Paperclip size={17} />
        </motion.button>

        <motion.button
          className="chat-input-icon-btn"
          type="button"
          title="Attach image"
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.94 }}
        >
          <ImageIcon size={17} />
        </motion.button>

        <input
          className="chat-input-field"
          type="text"
          placeholder="Message Nez AI..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
        />

        <motion.button
          className="chat-input-icon-btn"
          type="button"
          title="Voice input"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <Mic size={17} />
        </motion.button>

        <motion.button
          className="chat-input-send-btn"
          type="button"
          title="Send message"
          onClick={handleSend}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          <Send size={16} />
        </motion.button>
      </motion.div>
      <p className="chat-input-hint">Nez AI runs fully local. Nothing leaves your device.</p>
    </div>
  );
};

export default ChatInput;