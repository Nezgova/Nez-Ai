import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Circle, Cpu } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
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
        >
          <Settings size={17} />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;