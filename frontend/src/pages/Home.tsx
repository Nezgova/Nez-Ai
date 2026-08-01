import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Input/ChatInput';
import type { Message } from '../components/Message/Message';
import { sendMessageToAssistant } from '../services/api';
import type { Attachment } from '../types/Attachment';
import type { ChatSettings } from '../types/ChatSettings';
import type { Conversation } from '../types/Conversation';
import { createConversation, fileToDataUrl, loadConversations, restoreMessageFiles, saveConversations, titleFromMessage } from '../services/conversationStorage';

const SETTINGS_KEY = 'nezai.chatSettings';
const defaultSettings: ChatSettings = { think: false, stream: false };

const Home: React.FC = () => {
  const [initialState] = useState(() => {
    const stored = loadConversations().map((conversation) => ({ ...conversation, messages: restoreMessageFiles(conversation.messages) }));
    const newConversation = createConversation();
    return { conversations: [...stored, newConversation], activeConversationId: newConversation.id };
  });
  const [conversations, setConversations] = useState<Conversation[]>(initialState.conversations);
  const [activeConversationId, setActiveConversationId] = useState(initialState.activeConversationId);
  const [showIntro, setShowIntro] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>(() => {
    try { return { ...defaultSettings, ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? '{}') }; } catch { return defaultSettings; }
  });

  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0], [activeConversationId, conversations]);
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    if (!activeConversationId && activeConversation) setActiveConversationId(activeConversation.id);
  }, [activeConversation, activeConversationId]);
  useEffect(() => { saveConversations(conversations); }, [conversations]);
  useEffect(() => { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(chatSettings)); }, [chatSettings]);
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.items ?? []).find((item) => item.type.startsWith('image/'))?.getAsFile();
      if (!file) return;
      event.preventDefault();
      setAttachment({ type: 'image', file, previewUrl: URL.createObjectURL(file) });
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => setShowIntro(false), 1_800);
    return () => window.clearTimeout(timeout);
  }, []);

  const updateConversation = (id: string, update: (conversation: Conversation) => Conversation) => {
    setConversations((current) => current.map((conversation) => conversation.id === id ? update(conversation) : conversation));
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if ((!trimmed && !attachment) || !activeConversation) return;
    const currentAttachment = attachment;
    const imageDataUrl = currentAttachment?.type === 'image' ? await fileToDataUrl(currentAttachment.file) : undefined;
    const userMessage: Message = {
      id: crypto.randomUUID(), role: 'user', content: trimmed || (currentAttachment?.type === 'pdf' ? 'PDF attached' : 'Image attached'),
      attachment: currentAttachment ? { type: currentAttachment.type, previewUrl: currentAttachment.previewUrl ?? '', dataUrl: currentAttachment.type === 'image' ? imageDataUrl : undefined, fileName: currentAttachment.file.name, size: currentAttachment.file.size, file: currentAttachment.file } : undefined,
    };
    const assistantTyping: Message = { id: crypto.randomUUID(), role: 'assistant', content: currentAttachment?.type === 'pdf' ? 'Processing PDF...' : currentAttachment ? 'Analyzing image...' : 'Thinking...', isTyping: true };
    const conversationId = activeConversation.id;
    const history = [...activeConversation.messages.filter((message) => !message.isTyping), userMessage];
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title: conversation.messages.filter((message) => message.role === 'user').length === 0 ? titleFromMessage(userMessage.content) : conversation.title,
      updatedAt: new Date().toISOString(), messages: [...conversation.messages, userMessage, assistantTyping],
    }));
    setInputValue(''); setAttachment(null);
    try {
      const reply = await sendMessageToAssistant(conversationId, history, currentAttachment?.type === 'pdf' ? currentAttachment.file : null, chatSettings);
      updateConversation(conversationId, (conversation) => ({ ...conversation, updatedAt: new Date().toISOString(), messages: conversation.messages.map((message) => message.id === assistantTyping.id ? { ...message, content: reply, isTyping: false } : message) }));
    } catch {
      updateConversation(conversationId, (conversation) => ({ ...conversation, updatedAt: new Date().toISOString(), messages: conversation.messages.map((message) => message.id === assistantTyping.id ? { ...message, content: '❌ Unable to connect to the backend.', isTyping: false } : message) }));
    }
  };

  const handleNewChat = () => {
    const conversation = createConversation();
    setConversations((current) => [...current, conversation]);
    setActiveConversationId(conversation.id); setInputValue(''); setAttachment(null);
  };
  const handleDeleteConversation = (id: string) => {
    const fallback = createConversation();
    setConversations((current) => {
      const remaining = current.filter((conversation) => conversation.id !== id);
      return id === activeConversationId ? [...remaining, fallback] : remaining;
    });
    if (id === activeConversationId) setActiveConversationId(fallback.id);
  };
  const attachImage = (file: File) => (file.type.startsWith('image/') || file.type === 'application/pdf') && setAttachment({ type: file.type === 'application/pdf' ? 'pdf' : 'image', file, previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined });
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); event.stopPropagation(); setDragActive(false); const file = event.dataTransfer.files?.[0]; if (file) attachImage(file); };

  return <div className="home-layout">
    {showIntro && <div className="app-intro" role="status" aria-label="Starting Nez AI" onClick={() => setShowIntro(false)}>
      <div className="app-intro-content"><div className="app-intro-logo"><img src="/brand/nez-ai-logo.png" alt="" /></div><p>Nez AI</p><span>Private. Local. Ready.</span></div>
    </div>}
    <div className="ambient-bg" />
    <Sidebar conversations={conversations} activeConversationId={activeConversation?.id ?? ''} onNewChat={handleNewChat} onOpenConversation={(id) => { setActiveConversationId(id); setInputValue(''); setAttachment(null); }} onRenameConversation={(id, title) => updateConversation(id, (conversation) => ({ ...conversation, title, updatedAt: new Date().toISOString() }))} onDeleteConversation={handleDeleteConversation} />
    <div className="home-main"><Header settings={chatSettings} onSettingsChange={setChatSettings} />
      <div className={`chat-area ${dragActive ? 'chat-area--drag-active' : ''}`} onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }} onDragOver={(event) => { event.preventDefault(); setDragActive(true); }} onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }} onDrop={handleDrop}>
        <ChatWindow messages={messages} onExampleClick={setInputValue} isDragActive={dragActive} />
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} attachment={attachment} setAttachment={setAttachment} />
        {dragActive && <div className="chat-drop-overlay"><div className="chat-drop-message">Drop image to attach</div></div>}
      </div>
    </div>
  </div>;
};

export default Home;
