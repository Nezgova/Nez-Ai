import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  MessageSquare,
  Folder,
  BrainCircuit,
  Cpu,
  Settings,
  Circle,
} from 'lucide-react';
import './Sidebar.css';
import { checkBackendHealth } from '../../services/api';

interface NavItem {
  key: string;
  label: string;
  disabled: boolean;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { key: 'chat', label: 'Chat', disabled: false, icon: <MessageSquare size={18} /> },
  { key: 'files', label: 'Files', disabled: true, icon: <Folder size={18} /> },
  { key: 'memory', label: 'Memory', disabled: true, icon: <BrainCircuit size={18} /> },
  { key: 'models', label: 'Models', disabled: true, icon: <Cpu size={18} /> },
  { key: 'settings', label: 'Settings', disabled: true, icon: <Settings size={18} /> },
];

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
    <motion.aside
      className="sidebar"
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sidebar-brand">
        <motion.div
          className="sidebar-logo"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          N
        </motion.div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">Nez AI</span>
          <span className="sidebar-subtitle">Local AI Assistant</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <motion.button
            key={item.key}
            className={clsx(
              'sidebar-nav-item',
              !item.disabled && 'sidebar-nav-item--active',
              item.disabled && 'sidebar-nav-item--disabled'
            )}
            disabled={item.disabled}
            type="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.08 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={item.disabled ? undefined : { x: 2 }}
          >
            {!item.disabled && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="sidebar-nav-indicator"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot-wrapper">
            <Circle
              size={8}
              fill={connected ? '#4ADE80' : '#E5484D'}
              color={connected ? '#4ADE80' : '#E5484D'}
              className={connected ? 'status-dot-glow' : ''}
            />
          </span>
          <span className="status-label">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;