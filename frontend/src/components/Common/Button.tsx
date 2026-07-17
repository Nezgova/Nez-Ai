import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import './Button.css';

type ButtonVariant = 'primary' | 'ghost' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  title,
  disabled = false,
  active = false,
}) => {
  return (
    <motion.button
      className={clsx(
        'nez-button',
        `nez-button--${variant}`,
        active && 'nez-button--active'
      )}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type="button"
      whileHover={disabled ? undefined : { y: -1, scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.button>
  );
};

export default Button;