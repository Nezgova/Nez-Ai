import React, { useMemo, useState } from 'react';
import { MessageSquarePlus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import './Sidebar.css';
import type { Conversation } from '../../types/Conversation';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onNewChat: () => void;
  onOpenConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const groupFor = (updatedAt: string) => {
  const daysAgo = Math.floor((startOfDay(new Date()) - startOfDay(new Date(updatedAt))) / 86_400_000);
  if (daysAgo <= 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo <= 7) return 'Last 7 Days';
  return 'Older';
};

const formatUpdatedAt = (updatedAt: string) => new Intl.DateTimeFormat([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(updatedAt));

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversationId, onNewChat, onOpenConversation, onRenameConversation, onDeleteConversation }) => {
  const [menuId, setMenuId] = useState<string | null>(null);

  const groups = useMemo(() => {
    const result = new Map<string, Conversation[]>();
    [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).forEach((conversation) => {
      const group = groupFor(conversation.updatedAt);
      result.set(group, [...(result.get(group) ?? []), conversation]);
    });
    return result;
  }, [conversations]);

  const rename = (conversation: Conversation) => {
    const title = window.prompt('Rename conversation', conversation.title)?.trim();
    if (title) onRenameConversation(conversation.id, title.slice(0, 80));
    setMenuId(null);
  };

  const remove = (conversation: Conversation) => {
    if (window.confirm(`Delete “${conversation.title}”? This permanently removes all messages in this conversation.`)) {
      onDeleteConversation(conversation.id);
    }
    setMenuId(null);
  };

  return <aside className="sidebar">
    <div className="sidebar-brand">
      <div className="sidebar-logo"><img src="/brand/nez-ai-logo.png" alt="Nez AI logo" /></div>
      <div className="sidebar-brand-text"><span className="sidebar-title">Nez AI</span><span className="sidebar-subtitle">Local AI Assistant</span></div>
    </div>
    <button className="new-chat-button" type="button" onClick={onNewChat}><MessageSquarePlus size={17} /> New Chat</button>
    <div className="conversation-list">
      {(['Today', 'Yesterday', 'Last 7 Days', 'Older'] as const).map((group) => {
        const items = groups.get(group);
        if (!items?.length) return null;
        return <section className="conversation-group" key={group}>
          <h2>{group}</h2>
          {items.map((conversation) => <div className={`conversation-item ${conversation.id === activeConversationId ? 'conversation-item--active' : ''}`} key={conversation.id}>
            <button className="conversation-open" type="button" onClick={() => onOpenConversation(conversation.id)}>
              <span className="conversation-title">{conversation.title}</span><span className="conversation-updated">{formatUpdatedAt(conversation.updatedAt)}</span>
            </button>
            <button className="conversation-menu-button" type="button" aria-label={`Actions for ${conversation.title}`} onClick={() => setMenuId(menuId === conversation.id ? null : conversation.id)}><MoreHorizontal size={17} /></button>
            {menuId === conversation.id && <div className="conversation-menu">
              <button type="button" onClick={() => rename(conversation)}><Pencil size={14} /> Rename</button>
              <button type="button" className="conversation-menu-delete" onClick={() => remove(conversation)}><Trash2 size={14} /> Delete Conversation</button>
            </div>}
          </div>)}
        </section>;
      })}
    </div>
  </aside>;
};

export default Sidebar;
