import React, { useEffect, useState } from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Input/ChatInput';
import type { Message } from '../components/Message/Message';
import { sendMessageToAssistant } from '../services/api';
import type { Attachment } from '../types/Attachment';
import type { ChatSettings } from '../types/ChatSettings';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(() => {
    if (typeof window === 'undefined') {
      return { think: false };
    }

    const stored = window.localStorage.getItem('nezai.chatSettings');
    if (!stored) {
      return { think: false };
    }

    try {
      return JSON.parse(stored) as ChatSettings;
    } catch {
      return { think: false };
    }
  });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();
      if (!file) return;

      event.preventDefault();
      setAttachment({
        type: 'image',
        file,
        previewUrl: URL.createObjectURL(file),
      });
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('nezai.chatSettings', JSON.stringify(chatSettings));
  }, [chatSettings]);

  const attachImage = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setAttachment({
      type: 'image',
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0 && !attachment) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed || 'Image attached',
      attachment:
        attachment?.type === 'image'
          ? {
              type: 'image',
              previewUrl: attachment.previewUrl!,
              fileName: attachment.file.name,
              size: attachment.file.size,
              file: attachment.file,
            }
          : undefined,
    };

    const assistantTyping: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: attachment ? 'Analyzing image...' : 'Thinking...',
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantTyping]);
    setInputValue('');
    setAttachment(null);

    try {
      const conversation = [...messages.filter((message) => !message.isTyping), userMessage];
      const reply = await sendMessageToAssistant(conversation, chatSettings);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantTyping.id
            ? { ...message, content: reply, isTyping: false }
            : message
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantTyping.id
            ? { ...message, content: '❌ Unable to connect to the backend.', isTyping: false }
            : message
        )
      );
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      attachImage(file);
    }
  };

  return (
    <div className="home-layout">
      <div className="ambient-bg" />
      <Sidebar />
      <div className="home-main">
        <Header />
        <div
          className={`chat-area ${dragActive ? 'chat-area--drag-active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ChatWindow messages={messages} onExampleClick={handleExampleClick} isDragActive={dragActive} />
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            attachment={attachment}
            setAttachment={setAttachment}
            settings={chatSettings}
            onSettingsChange={setChatSettings}
          />

          {dragActive && (
            <div className="chat-drop-overlay">
              <div className="chat-drop-message">Drop image to attach</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
