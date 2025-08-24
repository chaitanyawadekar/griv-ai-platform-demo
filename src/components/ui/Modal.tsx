import React, { useEffect } from 'react';
import { ModalProps } from '../../types';
import { theme } from '../../data/theme';

export const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { maxWidth: '400px', width: '90%' };
      case 'lg':
        return { maxWidth: '800px', width: '90%' };
      case 'xl':
        return { maxWidth: '1200px', width: '95%' };
      default:
        return { maxWidth: '600px', width: '90%' };
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: '0.75rem',
          boxShadow: theme.shadow.lg,
          ...getSizeStyles(),
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: theme.colors.foreground }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: theme.colors.mutedForeground,
              padding: '0.25rem',
              borderRadius: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};