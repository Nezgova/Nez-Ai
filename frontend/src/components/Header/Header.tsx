import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Settings, Circle, Cpu } from 'lucide-react';
import './Header.css';
import type { ChatSettings } from '../../types/ChatSettings';

interface HeaderProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

const Header: React.FC<HeaderProps> = ({ settings, onSettingsChange }) => {
  const [time, setTime] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const toggleSetting = (key: keyof ChatSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <>
      <header className="app-header">
      <div className="app-header-titles">
        <h1 className="app-header-title">Nez AI</h1>
        <p className="app-header-subtitle">Private Local AI Assistant</p>
      </div>

      <div className="app-header-actions">
        <div className="header-pill">
          <Cpu size={14} />
          <span>Qwen 3.5</span>
        </div>

        <div className="header-pill">
          <Circle size={7} fill="#4ADE80" color="#4ADE80" className="header-pill-dot" />
          <span>Connected</span>
        </div>

        <div className="header-pill header-pill--clock">
          <span>{formattedTime}</span>
        </div>

        <motion.button
          className="header-settings-btn"
          whileHover={{ rotate: 60, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          title="Settings"
          type="button"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={17} />
        </motion.button>
      </div>
      </header>
      {settingsOpen && createPortal(
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="settings-panel" role="dialog" aria-modal="true" aria-label="Chat settings" onClick={(event) => event.stopPropagation()}>
            <div className="settings-panel-heading"><div><p className="settings-eyebrow">Nez AI</p><h2>Chat settings</h2><p>Saved locally and used for future requests.</p></div><button type="button" className="settings-x" aria-label="Close settings" onClick={() => setSettingsOpen(false)}>×</button></div>
            <button className="settings-option" type="button" aria-pressed={settings.think} onClick={() => toggleSetting('think')}>
              <span><strong>Thinking</strong><small>Allow Ollama to use its reasoning mode.</small></span><span className={`settings-switch ${settings.think ? 'settings-switch--on' : ''}`}><span /></span>
            </button>
            <button className="settings-option" type="button" aria-pressed={settings.stream} onClick={() => toggleSetting('stream')}>
              <span><strong>Streaming</strong><small>Sends <code>stream=true</code>. Streaming display arrives later.</small></span><span className={`settings-switch ${settings.stream ? 'settings-switch--on' : ''}`}><span /></span>
            </button>
            <button className="settings-close" type="button" onClick={() => setSettingsOpen(false)}>Done</button>
          </section>
        </div>, document.body
      )}
    </>
  );
};

export default Header;
