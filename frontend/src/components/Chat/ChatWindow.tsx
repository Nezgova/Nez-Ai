import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import Message from './Message';
import type { Message as MessageType } from '../Message/Message';

const dummyMessages: MessageType[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome to Nez AI.\nYour private local AI assistant.',
  },
  {
    id: '2',
    role: 'user',
    content: 'Hello!',
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Everything is working correctly.\nThe frontend is ready.\nNext step is connecting Ollama.',
  },
];

const ChatWindow: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="chat-window">
      <div className="chat-window-inner">
        {dummyMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;