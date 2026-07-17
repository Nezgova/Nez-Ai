import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { checkBackendHealth } from '../../services/api';

interface NavItem {
  key: string;
  label: string;
  disabled: boolean;
}

const navItems: NavItem[] = [
  { key: 'chat', label: 'Chat', disabled: false },
  { key: 'files', label: 'Files', disabled: true },
  { key: 'memory', label: 'Memory', disabled: true },
  { key: 'models', label: 'Models', disabled: true },
  { key: 'settings', label: 'Settings', disabled: true },
];

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5H9l-4 3.5v-3.5H5.5C4.67 17 4 16.33 4 15.5v-10z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const FilesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6.5C4 5.67 4.67 5 5.5 5H10l2 2h6.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13C4.67 19 4 18.33 4 17.5v-11z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const MemoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9 9h6v6H9z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const ModelsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M19.4 13a7.9 7.9 0 000-2l1.8-1.4-2-3.4-2.1.7a7.9 7.9 0 00-1.7-1l-.3-2.2h-4l-.3 2.2a7.9 7.9 0 00-1.7 1l-2.1-.7-2 3.4L4.6 11a7.9 7.9 0 000 2l-1.8 1.4 2 3.4 2.1-.7a7.9 7.9 0 001.7 1l.3 2.2h4l.3-2.2a7.9 7.9 0 001.7-1l2.1.7 2-3.4L19.4 13z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const icons: Record<string, JSX.Element> = {
  chat: <ChatIcon />,
  files: <FilesIcon />,
  memory: <MemoryIcon />,
  models: <ModelsIcon />,
  settings: <SettingsIcon />,
};

const Sidebar: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    checkBackendHealth().then((status) => {
      if (mounted) {
        setConnected(status.connected);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">N</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">Nez AI</span>
          <span className="sidebar-subtitle">Local AI Assistant</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-nav-item ${!item.disabled ? 'sidebar-nav-item--active' : ''} ${
              item.disabled ? 'sidebar-nav-item--disabled' : ''
            }`}
            disabled={item.disabled}
            type="button"
          >
            <span className="sidebar-nav-icon">{icons[item.key]}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className={`status-dot ${connected ? 'status-dot--online' : 'status-dot--offline'}`} />
          <span className="status-label">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;