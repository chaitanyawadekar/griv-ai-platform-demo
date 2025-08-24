import React from 'react';
import { InputProps } from '../../types';
import { theme } from '../../data/theme';

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  style,
  disabled = false,
  required = false
}) => {
  const baseStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '0.5rem',
    backgroundColor: theme.colors.input,
    color: theme.colors.foreground,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    ...style
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      style={baseStyles}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border;
      }}
    />
  );
};