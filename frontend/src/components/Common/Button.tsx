import React from 'react';
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
    <button
      className={`nez-button nez-button--${variant} ${active ? 'nez-button--active' : ''}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;