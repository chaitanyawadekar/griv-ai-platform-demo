import React from 'react';
import { ButtonProps } from '../../types';
import { theme } from '../../data/theme';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  style,
  type = 'button',
  disabled = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.border}`,
          '&:hover': {
            backgroundColor: theme.colors.secondary
          }
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.foreground,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.colors.secondary
          }
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.secondaryForeground,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.colors.muted
          }
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
          border: 'none',
          '&:hover': {
            backgroundColor: '#1d4ed8'
          }
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          height: '2rem'
        };
      case 'lg':
        return {
          padding: '0.875rem 1.5rem',
          fontSize: '1rem',
          height: '2.75rem'
        };
      default:
        return {
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          height: '2.25rem'
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={baseStyles}
      disabled={disabled}
    >
      {children}
    </button>
  );
};