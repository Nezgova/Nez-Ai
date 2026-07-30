import React, { useState } from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Input/ChatInput';
import type{ Message } from '../components/Message/Message';
import { sendMessageToAssistant } from '../services/api';
import type { Attachment } from '../types/Attachment';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const handleSend = async () => {
    const trimmed = inputValue.trim();

    if (trimmed.length === 0) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    // Show the user's message immediately
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input
    setInputValue('');

    const attachmentToSend = attachment;
    setAttachment(null);

    try {
      const reply = await sendMessageToAssistant(trimmed, attachmentToSend);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '❌ Unable to connect to the backend.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }
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
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} attachment={attachment} setAttachment={setAttachment} />
      </div>
    </div>
  );
};

export default Home;