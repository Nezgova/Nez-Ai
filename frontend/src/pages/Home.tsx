import React, { useState } from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Input/ChatInput';
import type{ Message } from '../components/Message/Message';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Nez AI is ready.\nConnect a local model to start chatting.',
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputValue('');
  };

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="home-layout">
      <div className="ambient-bg" />
      <Sidebar />
      <div className="home-main">
        <Header />
        <ChatWindow messages={messages} onExampleClick={handleExampleClick} />
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} />
      </div>
    </div>
  );
};

export default Home;