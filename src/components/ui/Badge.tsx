import React from 'react';
import { BadgeProps } from '../../types';
import { theme } from '../../data/theme';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.secondaryForeground
        };
      case 'success':
        return {
          backgroundColor: `${theme.colors.success}20`,
          color: theme.colors.success
        };
      case 'destructive':
        return {
          backgroundColor: `${theme.colors.destructive}20`,
          color: theme.colors.destructive
        };
      default:
        return {
          backgroundColor: `${theme.colors.primary}20`,
          color: theme.colors.primary
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    border: `1px solid transparent`,
    ...getVariantStyles()
  };

  return (
    <span style={baseStyles}>
      {children}
    </span>
  );
};