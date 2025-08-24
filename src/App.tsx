import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Proper theme configuration matching Griv AI Platform
const theme = {
  colors: {
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    primary: 'rgb(234, 88, 12)', // Orange theme
    primaryForeground: '#ffffff',
    secondary: '#f8fafc',
    border: '#e2e8f0',
    success: '#22c55e',
    destructive: '#ef4444',
    mutedForeground: '#64748b',
    warning: '#f59e0b',
    info: '#3b82f6'
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
};

// ShadCN-style Table components
const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div style={{
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    overflow: 'hidden'
  }}>
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.875rem'
    }} className={className}>
      {children}
    </table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead style={{
    backgroundColor: theme.colors.secondary
  }}>
    {children}
  </thead>
);

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody>{children}</tbody>
);

const TableRow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <tr
    style={{
      borderBottom: `1px solid ${theme.colors.border}`,
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.backgroundColor = theme.colors.secondary;
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
    }}
  >
    {children}
  </tr>
);

const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th style={{
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.colors.foreground,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }} className={className}>
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td style={{
    padding: '0.75rem 1rem',
    color: theme.colors.foreground
  }} className={className}>
    {children}
  </td>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = ({ 
  children, 
  variant = 'default' 
}) => {
  const variants = {
    default: { backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground },
    success: { backgroundColor: theme.colors.success, color: theme.colors.primaryForeground },
    warning: { backgroundColor: theme.colors.warning, color: theme.colors.primaryForeground },
    destructive: { backgroundColor: theme.colors.destructive, color: theme.colors.primaryForeground },
    secondary: { backgroundColor: theme.colors.secondary, color: theme.colors.foreground }
  };

  return (
    <span style={{
      ...variants[variant],
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '9999px',
      display: 'inline-flex',
      alignItems: 'center',
      textTransform: 'capitalize'
    }}>
      {children}
    </span>
  );
};

// ShadCN-style SVG Icon component
const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ 
  name, 
  size = 16, 
  color = 'currentColor'
}) => {
  const icons: { [key: string]: React.ReactNode } = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    workitems: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    contacts: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    workflows: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6"/>
        <path d="M12 16v6"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="6" r="2"/>
        <circle cx="12" cy="18" r="2"/>
        <path d="M5 12h14"/>
      </svg>
    ),
    ai: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/>
        <rect x="2" y="14" width="4" height="6" rx="2"/>
        <rect x="6" y="4" width="4" height="16" rx="2"/>
        <rect x="10" y="2" width="4" height="20" rx="2"/>
        <rect x="14" y="4" width="4" height="16" rx="2"/>
        <rect x="18" y="6" width="4" height="14" rx="2"/>
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
      </svg>
    ),
    plus: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    edit: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    delete: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    ),
    menu: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    chevronDown: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    search: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    ),
    x: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    filter: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
      </svg>
    ),
    team: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    bell: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    save: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17,21 17,13 7,13 7,21"/>
        <polyline points="7,3 7,8 15,8"/>
      </svg>
    ),
    fields: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <line x1="7" y1="7" x2="17" y2="7"/>
        <line x1="7" y1="11" x2="17" y2="11"/>
      </svg>
    )
  };

  return (
    <span style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color: color
    }}>
      {icons[name] ? (
        <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icons[name]}
        </div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )}
    </span>
  );
};

// Enhanced Modal component with ShadCN-style design
const Modal: React.FC<{
  show: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ show, onClose, title, children, size = 'md' }) => {
  if (!show) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.lg,
          maxWidth: sizes[size],
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {typeof title === 'string' ? (
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: theme.colors.foreground
            }}>
              {title}
            </h2>
          ) : title}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Button component with proper styling
const Button: React.FC<{
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}> = ({ 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  children, 
  type = 'button',
  style 
}) => {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.primaryForeground,
      border: 'none'
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.foreground,
      border: `1px solid ${theme.colors.border}`
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
      color: theme.colors.primaryForeground,
      border: 'none'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.foreground,
      border: 'none'
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.625rem 1rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '8px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== 'ghost') {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
        }
      }}
    >
      {children}
    </button>
  );
};

// Input component with proper styling
const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}> = ({ type = 'text', placeholder, value, onChange, disabled = false, required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        fontSize: '0.875rem',
        backgroundColor: disabled ? theme.colors.secondary : theme.colors.card,
        color: theme.colors.foreground,
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
        minWidth: 0
      }}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border;
      }}
    />
  );
};

// Sample data for Griv AI Platform
const workitemTypes = [
  { id: 1, name: 'Lead', icon: '🎯', color: '#3b82f6' },
  { id: 2, name: 'Task', icon: '📝', color: '#f59e0b' },
  { id: 3, name: 'Grievance', icon: '🚨', color: '#ef4444' },
  { id: 4, name: 'Follow-up', icon: '🔄', color: '#10b981' }
];

const contactTypes = [
  { id: 1, name: 'Customer', icon: '👤', color: '#3b82f6' },
  { id: 2, name: 'Voter', icon: '🗳️', color: '#8b5cf6' },
  { id: 3, name: 'Influencer', icon: '⭐', color: '#f59e0b' },
  { id: 4, name: 'Partner', icon: '🤝', color: '#10b981' }
];

const workitems = [
  {
    id: 1,
    type: 'Lead',
    title: 'New customer inquiry from website',
    description: 'Potential customer interested in our premium package',
    status: 'Open',
    priority: 'High',
    assignee: 'Rahul Sharma',
    department: 'Sales',
    dueDate: '2024-09-15',
    tags: ['hot-lead', 'website'],
    createdAt: '2024-09-10'
  },
  {
    id: 2,
    type: 'Task',
    title: 'Quarterly report preparation',
    description: 'Compile Q3 performance metrics and analysis',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Priya Patel',
    department: 'Operations',
    dueDate: '2024-09-20',
    tags: ['report', 'quarterly'],
    createdAt: '2024-09-08'
  },
  {
    id: 3,
    type: 'Grievance',
    title: 'Service complaint - delayed response',
    description: 'Customer complaint about delayed support response',
    status: 'Open',
    priority: 'High',
    assignee: 'Amit Kumar',
    department: 'Support',
    dueDate: '2024-09-12',
    tags: ['complaint', 'urgent'],
    createdAt: '2024-09-09'
  }
];

const contacts = [
  {
    id: 1,
    type: 'Customer',
    name: 'Rajesh Gupta',
    phone: '+91 9876543210',
    email: 'rajesh@email.com',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    lastContact: '2024-09-10',
    tags: ['premium', 'loyal'],
    source: 'Website'
  },
  {
    id: 2,
    type: 'Voter',
    name: 'Sunita Devi',
    phone: '+91 9876543211',
    email: 'sunita@email.com',
    location: 'Delhi, India',
    status: 'Active',
    lastContact: '2024-09-08',
    tags: ['active-voter', 'local'],
    source: 'Field Survey'
  }
];

const employees = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@griv.ai',
    phone: '+91 9876543210',
    department: 'Sales',
    role: 'Sales Manager',
    permissions: ['READ', 'WRITE'],
    status: 'Active',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@griv.ai',
    phone: '+91 9876543211',
    department: 'Operations',
    role: 'Operations Lead',
    permissions: ['READ', 'WRITE', 'DELETE'],
    status: 'Active',
    joinDate: '2024-02-20'
  }
];

const departments = [
  { id: 1, name: 'Sales', head: 'Rahul Sharma', members: 5 },
  { id: 2, name: 'Operations', head: 'Priya Patel', members: 3 },
  { id: 3, name: 'Support', head: 'Amit Kumar', members: 4 },
  { id: 4, name: 'Marketing', head: 'Neha Singh', members: 2 }
];

const App: React.FC = () => {
  // Core state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({ 
    name: 'Demo User', 
    phone: '+91 9876543210',
    organization: 'Demo Organization',
    tokenBalance: 25000
  });
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // Modal states
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkitem, setShowCreateWorkitem] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showAddWorkitemType, setShowAddWorkitemType] = useState(false);
  const [showEditWorkitemType, setShowEditWorkitemType] = useState(false);
  const [showAddContactType, setShowAddContactType] = useState(false);
  const [showEditContactType, setShowEditContactType] = useState(false);
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [showManageFields, setShowManageFields] = useState(false);
  const [showEditField, setShowEditField] = useState(false);
  const [selectedWorkitemType, setSelectedWorkitemType] = useState<any>(null);
  const [selectedContactType, setSelectedContactType] = useState<any>(null);
  const [selectedFieldType, setSelectedFieldType] = useState<'workitem' | 'contact'>('workitem');
  const [selectedField, setSelectedField] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // Settings state
  const [settingsTab, setSettingsTab] = useState('general');
  
  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Authentication
  const handleLogin = (phone: string) => {
    if (phone) {
      setIsAuthenticated(true);
      setActiveScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen('dashboard');
    setShowUserMenu(false);
  };

  // Login Screen
  const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin(phoneNumber);
    };

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(234, 88, 12) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: theme.shadow.lg,
          border: `1px solid ${theme.colors.border}`
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              🤖
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Griv AI Platform
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              AI-Powered Omni-Channel Operations
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: theme.colors.foreground
              }}>
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" style={{ width: '100%' }}>
              <Icon name="phone" size={16} color={theme.colors.primaryForeground} />
              Continue with Phone
            </Button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: theme.colors.mutedForeground,
            textAlign: 'center'
          }}>
            Demo Mode: Use any phone number to login
          </div>
        </div>
      </div>
    );
  };

  // Header Component
  const Header = () => {
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
          setShowUserMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <header style={{
        backgroundColor: theme.colors.card,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: theme.shadow.sm
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="ai" size={32} color={theme.colors.primary} />
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: theme.colors.primary,
                margin: 0,
                lineHeight: 1
              }}>
                Griv AI
              </h1>
              <p style={{
                fontSize: '0.75rem',
                color: theme.colors.mutedForeground,
                margin: 0,
                lineHeight: 1
              }}>
                {currentUser.organization}
              </p>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            { id: 'workitems', label: 'Workitems', icon: 'workitems' },
            { id: 'contacts', label: 'Contacts', icon: 'contacts' },
            { id: 'workflows', label: 'Workflows', icon: 'workflows' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                border: 'none',
                backgroundColor: activeScreen === item.id ? theme.colors.primary : 'transparent',
                color: activeScreen === item.id ? theme.colors.primaryForeground : theme.colors.mutedForeground,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  e.currentTarget.style.color = theme.colors.foreground;
                }
              }}
              onMouseLeave={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.mutedForeground;
                }
              }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: theme.colors.foreground
          }}>
            <Icon name="star" size={16} color={theme.colors.warning} />
            {currentUser.tokenBalance.toLocaleString()} tokens
          </div>

          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.primaryForeground,
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <Icon name="chevronDown" size={16} />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                boxShadow: theme.shadow.lg,
                minWidth: '200px',
                zIndex: 1000
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderBottom: `1px solid ${theme.colors.border}`
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: theme.colors.foreground
                  }}>
                    {currentUser.name}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground
                  }}>
                    {currentUser.phone}
                  </p>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  <button
                    onClick={() => {
                      console.log('Profile clicked');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.colors.foreground,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon name="user" size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveScreen('settings');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.colors.foreground,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon name="settings" size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: theme.colors.destructive,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon name="logout" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };

  // Dashboard Screen
  const DashboardScreen = () => {
    const stats = [
      {
        title: 'Total Workitems',
        value: workitems.length.toString(),
        change: '+12%',
        trend: 'up',
        icon: 'workitems',
        color: theme.colors.primary
      },
      {
        title: 'Active Contacts',
        value: contacts.length.toString(),
        change: '+8%',
        trend: 'up',
        icon: 'contacts',
        color: theme.colors.success
      },
      {
        title: 'Open Tasks',
        value: workitems.filter(w => w.status === 'Open').length.toString(),
        change: '-5%',
        trend: 'down',
        icon: 'clock',
        color: theme.colors.warning
      },
      {
        title: 'Token Usage',
        value: `${Math.round((1 - currentUser.tokenBalance / 25000) * 100)}%`,
        change: '+15%',
        trend: 'up',
        icon: 'star',
        color: theme.colors.info
      }
    ];

    return (
      <div style={{
        padding: '2rem',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Dashboard
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Real-time analytics and platform overview
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: theme.shadow.sm
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name={stat.icon} size={24} color={stat.color} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  color: stat.trend === 'up' ? theme.colors.success : theme.colors.destructive
                }}>
                  <Icon 
                    name={stat.trend === 'up' ? 'chevronUp' : 'chevronDown'} 
                    size={16} 
                    color={stat.trend === 'up' ? theme.colors.success : theme.colors.destructive}
                  />
                  {stat.change}
                </div>
              </div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: theme.colors.foreground,
                margin: '0 0 0.25rem 0'
              }}>
                {stat.value}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: theme.shadow.sm
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Icon name="workitems" size={20} color={theme.colors.primary} />
              Recent Workitems
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {workitems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: theme.colors.secondary,
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      {item.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        backgroundColor: item.priority === 'High' ? theme.colors.destructive : theme.colors.warning,
                        color: theme.colors.primaryForeground,
                        fontWeight: '500'
                      }}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground,
                    margin: '0 0 0.5rem 0'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground
                  }}>
                    <span>Assigned to: {item.assignee}</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: theme.shadow.sm
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 1rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Icon name="analytics" size={20} color={theme.colors.primary} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                onClick={() => setShowCreateWorkitem(true)}
                variant="secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon name="plus" size={16} />
                Create Workitem
              </Button>
              <Button
                onClick={() => setShowCreateContact(true)}
                variant="secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon name="plus" size={16} />
                Add Contact
              </Button>
              <Button
                onClick={() => setShowAIChat(true)}
                variant="secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon name="ai" size={16} />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Workitems Screen with ShadCN-style Table
  const WorkitemsScreen = () => {
    const filteredWorkitems = workitems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'Open': return 'secondary';
        case 'In Progress': return 'warning';
        case 'Completed': return 'success';
        case 'Closed': return 'default';
        default: return 'secondary';
      }
    };

    const getPriorityBadge = (priority: string) => {
      switch (priority) {
        case 'High': return 'destructive';
        case 'Medium': return 'warning';
        case 'Low': return 'success';
        default: return 'secondary';
      }
    };

    return (
      <div style={{
        padding: '2rem',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Workitems
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Manage leads, tasks, grievances, and follow-ups ({filteredWorkitems.length} total)
            </p>
          </div>
          <Button onClick={() => setShowCreateWorkitem(true)}>
            <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
            Create Workitem
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: theme.shadow.sm
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Search
              </label>
              <Input
                placeholder="Search workitems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem',
                  minWidth: '120px'
                }}
              >
                <option value="all">All Types</option>
                {workitemTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem',
                  minWidth: '120px'
                }}
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* ShadCN-style Data Table */}
        {filteredWorkitems.length === 0 ? (
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: theme.shadow.sm
          }}>
            <Icon name="workitems" size={48} color={theme.colors.mutedForeground} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '1rem 0 0.5rem 0'
            }}>
              No workitems found
            </h3>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Try adjusting your search criteria or create a new workitem.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workitem</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkitems.map((item) => {
                const type = workitemTypes.find(t => t.name === item.type);
                return (
                  <TableRow key={item.id} onClick={() => console.log('View workitem:', item.id)}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {type && (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: `${type.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                          }}>
                            {type.icon}
                          </div>
                        )}
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: theme.colors.foreground,
                            marginBottom: '0.25rem'
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: theme.colors.mutedForeground
                          }}>
                            {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(item.status) as any}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadge(item.priority) as any}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon name="user" size={14} />
                        {item.assignee}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon name="calendar" size={14} />
                        {item.dueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon name="building" size={14} />
                        {item.department}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  // Contacts Screen
  const ContactsScreen = () => {
    const filteredContacts = contacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm);
      
      const matchesType = filterType === 'all' || contact.type === filterType;
      
      return matchesSearch && matchesType;
    });

    return (
      <div style={{
        padding: '2rem',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Contacts
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Manage customers, voters, influencers, and partners
            </p>
          </div>
          <Button onClick={() => setShowCreateContact(true)}>
            <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
            Add Contact
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: theme.shadow.sm
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Search
              </label>
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Types</option>
                {contactTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div style={{
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: theme.shadow.sm
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.secondary
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: 0
            }}>
              {filteredContacts.length} Contacts Found
            </h3>
          </div>
          {filteredContacts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: theme.colors.mutedForeground
            }}>
              <Icon name="contacts" size={48} color={theme.colors.mutedForeground} />
              <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem' }}>
                No contacts found matching your criteria
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  const type = contactTypes.find(t => t.name === contact.type);
                  return (
                    <TableRow 
                      key={contact.id} 
                      onClick={() => {}}
                    >
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          {type && (
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: `${type.color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Icon name="user" size={14} color={type.color} />
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: theme.colors.foreground,
                              lineHeight: '1.25'
                            }}>
                              {contact.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground,
                              lineHeight: '1.25'
                            }}>
                              {contact.type}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {contact.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}>
                          <Icon name="phone" size={14} color={theme.colors.mutedForeground} />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}>
                          <Icon name="email" size={14} color={theme.colors.mutedForeground} />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}>
                          <Icon name="location" size={14} color={theme.colors.mutedForeground} />
                          {contact.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={contact.status === 'Active' ? 'success' : 'secondary'}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: theme.colors.mutedForeground
                        }}>
                          <Icon name="clock" size={14} color={theme.colors.mutedForeground} />
                          {contact.lastContact}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.tags && contact.tags.length > 0 ? (
                          <div style={{
                            display: 'flex',
                            gap: '0.25rem',
                            flexWrap: 'wrap',
                            maxWidth: '150px'
                          }}>
                            {contact.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.125rem 0.375rem',
                                  fontSize: '0.625rem',
                                  borderRadius: '4px',
                                  backgroundColor: theme.colors.border,
                                  color: theme.colors.mutedForeground,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                            {contact.tags.length > 2 && (
                              <span style={{
                                fontSize: '0.625rem',
                                color: theme.colors.mutedForeground
                              }}>
                                +{contact.tags.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{
                            fontSize: '0.75rem',
                            color: theme.colors.mutedForeground
                          }}>
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    );
  };

  // Workflows Screen
  const WorkflowsScreen = () => {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: theme.colors.background,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Workflows
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Visual automation builder and workflow management
            </p>
          </div>
          <Button onClick={() => {}}>
            <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
            Create Workflow
          </Button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Workflow Builder Card */}
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: theme.shadow.sm
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: `${theme.colors.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Icon name="workflows" size={32} color={theme.colors.primary} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Visual Workflow Builder
            </h3>
            <p style={{
              color: theme.colors.mutedForeground,
              fontSize: '0.875rem',
              margin: '0 0 1.5rem 0'
            }}>
              Create multi-step automation workflows with conditional logic and triggers
            </p>
            <Button variant="secondary" style={{ width: '100%' }}>
              Launch Builder
            </Button>
          </div>

          {/* Template Library Card */}
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: theme.shadow.sm
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: `${theme.colors.success}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Icon name="star" size={32} color={theme.colors.success} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Template Library
            </h3>
            <p style={{
              color: theme.colors.mutedForeground,
              fontSize: '0.875rem',
              margin: '0 0 1.5rem 0'
            }}>
              Pre-built workflow templates for common automation scenarios
            </p>
            <Button variant="secondary" style={{ width: '100%' }}>
              Browse Templates
            </Button>
          </div>

          {/* Analytics Card */}
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: theme.shadow.sm
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: `${theme.colors.info}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Icon name="analytics" size={32} color={theme.colors.info} />
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Workflow Analytics
            </h3>
            <p style={{
              color: theme.colors.mutedForeground,
              fontSize: '0.875rem',
              margin: '0 0 1.5rem 0'
            }}>
              Performance metrics and execution analytics for your workflows
            </p>
            <Button variant="secondary" style={{ width: '100%' }}>
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Create Workitem Modal
  const CreateWorkitemModal = () => {
    const [formData, setFormData] = useState({
      type: 'Lead',
      title: '',
      description: '',
      priority: 'Medium',
      assignee: '',
      department: 'Sales',
      dueDate: '',
      tags: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Creating workitem:', formData);
      setShowCreateWorkitem(false);
      setFormData({
        type: 'Lead',
        title: '',
        description: '',
        priority: 'Medium',
        assignee: '',
        department: 'Sales',
        dueDate: '',
        tags: ''
      });
    };

    return (
      <Modal
        show={showCreateWorkitem}
        onClose={() => setShowCreateWorkitem(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="plus" size={20} color={theme.colors.primary} />
            Create New Workitem
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                  required
                >
                  {workitemTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Title *
              </label>
              <Input
                placeholder="Enter workitem title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Description
              </label>
              <textarea
                placeholder="Enter detailed description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Assignee
                </label>
                <Input
                  placeholder="Enter assignee name"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Tags
                </label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateWorkitem(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Create Workitem
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Create Contact Modal
  const CreateContactModal = () => {
    const [formData, setFormData] = useState({
      type: 'Customer',
      name: '',
      phone: '',
      email: '',
      location: '',
      source: 'Manual',
      tags: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Creating contact:', formData);
      setShowCreateContact(false);
      setFormData({
        type: 'Customer',
        name: '',
        phone: '',
        email: '',
        location: '',
        source: 'Manual',
        tags: ''
      });
    };

    return (
      <Modal
        show={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="plus" size={20} color={theme.colors.primary} />
            Add New Contact
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Contact Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
                required
              >
                {contactTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Full Name *
              </label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Location
                </label>
                <Input
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="Manual">Manual Entry</option>
                  <option value="Website">Website</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Referral">Referral</option>
                  <option value="Field Survey">Field Survey</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Tags
              </label>
              <Input
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateContact(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Add Contact
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Settings Modal (comprehensive)
  const SettingsModal = () => {
    const settingsTabs = [
      { id: 'general', label: 'General', icon: 'settings' },
      { id: 'fields', label: 'Field Configuration', icon: 'fields' },
      { id: 'team', label: 'Team Management', icon: 'team' },
      { id: 'integrations', label: 'Integrations', icon: 'integration' },
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'security', label: 'Security', icon: 'shield' },
      { id: 'billing', label: 'Billing', icon: 'star' }
    ];

    return (
      <Modal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="settings" size={20} color={theme.colors.primary} />
            Settings
          </div>
        }
        size="xl"
      >
        <div style={{ display: 'flex', gap: '2rem', height: '600px', overflow: 'hidden' }}>
          {/* Settings Navigation */}
          <div style={{
            minWidth: '200px',
            maxWidth: '200px',
            borderRight: `1px solid ${theme.colors.border}`,
            paddingRight: '1rem',
            overflowY: 'auto'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: settingsTab === tab.id ? theme.colors.primary : 'transparent',
                    color: settingsTab === tab.id ? theme.colors.primaryForeground : theme.colors.foreground,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (settingsTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (settingsTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            paddingRight: '0.5rem',
            maxHeight: '100%'
          }}>
            {settingsTab === 'general' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  General Settings
                </h3>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Organization Name
                    </label>
                    <Input
                      value="Demo Organization"
                      onChange={() => {}}
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Organization Type
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                        minWidth: 0
                      }}
                    >
                      <option>Government</option>
                      <option>NGO</option>
                      <option>Private Company</option>
                      <option>Educational Institution</option>
                      <option>Healthcare</option>
                      <option>Non-Profit</option>
                      <option>Consulting</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', 
                    gap: '1rem' 
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Contact Email
                      </label>
                      <Input
                        type="email"
                        value="contact@demo.org"
                        onChange={() => {}}
                        placeholder="Enter contact email"
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Contact Phone Number
                      </label>
                      <Input
                        type="tel"
                        value="+91-9876543210"
                        onChange={() => {}}
                        placeholder="Enter contact phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      GST Details <span style={{ color: theme.colors.mutedForeground, fontWeight: '400' }}>(Optional)</span>
                    </label>
                    <Input
                      value=""
                      onChange={() => {}}
                      placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Timezone
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: theme.colors.card,
                          color: theme.colors.foreground,
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          minWidth: 0
                        }}
                      >
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                        <option>America/New_York (EST)</option>
                      </select>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Language
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: theme.colors.card,
                          color: theme.colors.foreground,
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          minWidth: 0
                        }}
                      >
                        <option>English</option>
                        <option>हिंदी (Hindi)</option>
                        <option>বাংলা (Bengali)</option>
                        <option>తెলుগు (Telugu)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: `1px solid ${theme.colors.border}`
                  }}>
                    <Button variant="secondary">
                      Cancel
                    </Button>
                    <Button>
                      <Icon name="save" size={16} color={theme.colors.primaryForeground} />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'fields' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Field Configuration
                </h3>

                {/* Workitem Types Section */}
                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Workitem Types ({workitemTypes.length})
                    </h4>
                    <Button size="sm" onClick={() => setShowAddWorkitemType(true)}>
                      <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                      Add Type
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {workitemTypes.map((type) => (
                      <div
                        key={type.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: `${type.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon name="workitems" size={16} color={type.color} />
                          </div>
                          <div>
                            <h5 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: 0
                            }}>
                              {type.name}
                            </h5>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {type.name === 'Lead' ? 'Sales leads and opportunities' :
                               type.name === 'Task' ? 'Internal tasks and assignments' :
                               type.name === 'Grievance' ? 'Customer complaints and issues' :
                               'Follow-up activities and reminders'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="secondary" size="sm" onClick={() => {
                            setSelectedWorkitemType(type);
                            setSelectedFieldType('workitem');
                            setShowManageFields(true);
                          }}>
                            <Icon name="fields" size={14} />
                            Manage Fields
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedWorkitemType(type);
                            setShowEditWorkitemType(true);
                          }}>
                            <Icon name="edit" size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            console.log('Delete workitem type:', type.name);
                          }}>
                            <Icon name="delete" size={14} color={theme.colors.destructive} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Types Section */}
                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Contact Types ({contactTypes.length})
                    </h4>
                    <Button size="sm" onClick={() => setShowAddContactType(true)}>
                      <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                      Add Type
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {contactTypes.map((type) => (
                      <div
                        key={type.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: `${type.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon name="contacts" size={16} color={type.color} />
                          </div>
                          <div>
                            <h5 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: 0
                            }}>
                              {type.name}
                            </h5>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {type.name === 'Customer' ? 'Business customers and clients' :
                               type.name === 'Voter' ? 'Electoral constituency members' :
                               type.name === 'Influencer' ? 'Key stakeholders and leaders' :
                               'Business partners and vendors'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="secondary" size="sm" onClick={() => {
                            setSelectedContactType(type);
                            setSelectedFieldType('contact');
                            setShowManageFields(true);
                          }}>
                            <Icon name="fields" size={14} />
                            Manage Fields
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedContactType(type);
                            setShowEditContactType(true);
                          }}>
                            <Icon name="edit" size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            console.log('Delete contact type:', type.name);
                          }}>
                            <Icon name="delete" size={14} color={theme.colors.destructive} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'team' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    Team Management
                  </h3>
                  <Button onClick={() => setShowAddEmployee(true)}>
                    <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                    Add Employee
                  </Button>
                </div>

                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: '0 0 0.75rem 0'
                  }}>
                    Employees ({employees.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div>
                          <h5 style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: theme.colors.foreground,
                            margin: '0 0 0.25rem 0'
                          }}>
                            {employee.name}
                          </h5>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.colors.mutedForeground,
                            margin: 0
                          }}>
                            {employee.role} • {employee.department}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEditEmployee(true);
                            }}
                          >
                            <Icon name="edit" size={14} />
                          </Button>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '12px',
                            backgroundColor: employee.status === 'Active' ? theme.colors.success : theme.colors.border,
                            color: employee.status === 'Active' ? theme.colors.primaryForeground : theme.colors.mutedForeground,
                            fontWeight: '500'
                          }}>
                            {employee.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: '0 0 0.75rem 0'
                  }}>
                    Departments ({departments.length})
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`,
                          textAlign: 'center'
                        }}
                      >
                        <h5 style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: theme.colors.foreground,
                          margin: '0 0 0.25rem 0'
                        }}>
                          {dept.name}
                        </h5>
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground,
                          margin: 0
                        }}>
                          {dept.members} members • Head: {dept.head}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'integrations' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Integrations
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {[
                    { name: 'WhatsApp Business', icon: 'message', status: 'Connected', color: theme.colors.success },
                    { name: 'SMS Gateway', icon: 'phone', status: 'Connected', color: theme.colors.success },
                    { name: 'Email Service', icon: 'email', status: 'Pending', color: theme.colors.warning },
                    { name: 'Voice Calls', icon: 'phone', status: 'Disconnected', color: theme.colors.destructive }
                  ].map((integration, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '1rem',
                        backgroundColor: theme.colors.secondary,
                        borderRadius: '8px',
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <Icon name={integration.icon} size={20} color={theme.colors.primary} />
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: theme.colors.foreground,
                          margin: 0
                        }}>
                          {integration.name}
                        </h4>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: '12px',
                          backgroundColor: integration.color,
                          color: theme.colors.primaryForeground,
                          fontWeight: '500'
                        }}>
                          {integration.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Notification Preferences
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { label: 'New workitem assignments', checked: true },
                    { label: 'Contact status updates', checked: true },
                    { label: 'Workflow completions', checked: false },
                    { label: 'System maintenance alerts', checked: true },
                    { label: 'Daily summary reports', checked: false }
                  ].map((item, index) => (
                    <label
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: theme.colors.secondary,
                        borderRadius: '8px',
                        border: `1px solid ${theme.colors.border}`,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        style={{ margin: 0 }}
                      />
                      <span style={{
                        fontSize: '0.875rem',
                        color: theme.colors.foreground
                      }}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {settingsTab === 'security' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Security Settings
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Two-Factor Authentication
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme.colors.mutedForeground,
                      margin: '0 0 1rem 0'
                    }}>
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="secondary">
                      <Icon name="shield" size={16} />
                      Enable 2FA
                    </Button>
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Data Export
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme.colors.mutedForeground,
                      margin: '0 0 1rem 0'
                    }}>
                      Download a copy of your data
                    </p>
                    <Button variant="secondary">
                      <Icon name="download" size={16} />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'billing' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Billing & Usage
                </h3>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: '0 0 1rem 0'
                  }}>
                    Token Usage
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.colors.mutedForeground,
                        margin: '0 0 0.25rem 0'
                      }}>
                        Remaining Tokens
                      </p>
                      <p style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: theme.colors.primary,
                        margin: 0
                      }}>
                        {currentUser.tokenBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.colors.mutedForeground,
                        margin: '0 0 0.25rem 0'
                      }}>
                        Plan
                      </p>
                      <p style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: theme.colors.foreground,
                        margin: 0
                      }}>
                        Professional
                      </p>
                    </div>
                  </div>
                  <Button style={{ marginTop: '1rem' }}>
                    <Icon name="star" size={16} color={theme.colors.primaryForeground} />
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  // Settings Screen (converted from modal)
  const SettingsScreen = () => {
    const settingsTabs = [
      { id: 'general', label: 'General', icon: 'settings' },
      { id: 'fields', label: 'Field Configuration', icon: 'fields' },
      { id: 'team', label: 'Team Management', icon: 'team' },
      { id: 'integrations', label: 'Integrations', icon: 'integration' },
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'security', label: 'Security', icon: 'shield' },
      { id: 'billing', label: 'Billing', icon: 'star' }
    ];

    return (
      <div style={{
        padding: '2rem',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: theme.colors.background
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.colors.foreground,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Icon name="settings" size={32} color={theme.colors.primary} />
            Settings
          </h1>
          <p style={{
            fontSize: '1rem',
            color: theme.colors.mutedForeground,
            margin: '0.5rem 0 0 0'
          }}>
            Manage your organization settings and preferences
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
          {/* Settings Navigation */}
          <div style={{
            minWidth: '240px',
            maxWidth: '240px',
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '1.5rem',
            height: 'fit-content'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem',
                    border: 'none',
                    backgroundColor: settingsTab === tab.id ? theme.colors.primary : 'transparent',
                    color: settingsTab === tab.id ? theme.colors.primaryForeground : theme.colors.foreground,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (settingsTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (settingsTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon name={tab.icon} size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div style={{ 
            flex: 1,
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '2rem'
          }}>
            {settingsTab === 'general' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  General Settings
                </h3>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Organization Name
                    </label>
                    <Input
                      value="Demo Organization"
                      onChange={() => {}}
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Organization Type
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                        minWidth: 0
                      }}
                    >
                      <option>Government</option>
                      <option>NGO</option>
                      <option>Private Company</option>
                      <option>Educational Institution</option>
                      <option>Healthcare</option>
                      <option>Non-Profit</option>
                      <option>Consulting</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', 
                    gap: '1rem' 
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Time Zone
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: theme.colors.card,
                          color: theme.colors.foreground,
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          minWidth: 0
                        }}
                      >
                        <option>Asia/Kolkata (GMT+5:30)</option>
                        <option>America/New_York (GMT-5:00)</option>
                        <option>Europe/London (GMT+0:00)</option>
                        <option>Asia/Dubai (GMT+4:00)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Language
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: theme.colors.card,
                          color: theme.colors.foreground,
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          minWidth: 0
                        }}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Bengali</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                        <option>Marathi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Currency
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                        minWidth: 0
                      }}
                    >
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'fields' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Field Configuration
                </h3>

                {/* Workitem Types Section */}
                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Workitem Types ({workitemTypes.length})
                    </h4>
                    <Button size="sm" onClick={() => setShowAddWorkitemType(true)}>
                      <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                      Add Type
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {workitemTypes.map((type) => (
                      <div
                        key={type.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: `${type.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon name="workitems" size={16} color={type.color} />
                          </div>
                          <div>
                            <h5 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: 0
                            }}>
                              {type.name}
                            </h5>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {type.name === 'Lead' ? 'Sales leads and opportunities' :
                               type.name === 'Task' ? 'Internal tasks and assignments' :
                               type.name === 'Grievance' ? 'Customer complaints and issues' :
                               'Follow-up activities and reminders'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="secondary" size="sm" onClick={() => {
                            setSelectedWorkitemType(type);
                            setSelectedFieldType('workitem');
                            setShowManageFields(true);
                          }}>
                            <Icon name="fields" size={14} />
                            Manage Fields
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedWorkitemType(type);
                            setShowEditWorkitemType(true);
                          }}>
                            <Icon name="edit" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Types Section */}
                <div style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Contact Types ({contactTypes.length})
                    </h4>
                    <Button size="sm" onClick={() => setShowAddContactType(true)}>
                      <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                      Add Type
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {contactTypes.map((type) => (
                      <div
                        key={type.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          backgroundColor: theme.colors.card,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: `${type.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Icon name="contacts" size={16} color={type.color} />
                          </div>
                          <div>
                            <h5 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: 0
                            }}>
                              {type.name}
                            </h5>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {type.name === 'Customer' ? 'Service customers and clients' :
                               type.name === 'Voter' ? 'Citizens and constituents' :
                               type.name === 'Influencer' ? 'Key stakeholders and leaders' :
                               'Business partners and vendors'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="secondary" size="sm" onClick={() => {
                            setSelectedContactType(type);
                            setSelectedFieldType('contact');
                            setShowManageFields(true);
                          }}>
                            <Icon name="fields" size={14} />
                            Manage Fields
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedContactType(type);
                            setShowEditContactType(true);
                          }}>
                            <Icon name="edit" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'team' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    Team Management
                  </h3>
                  <Button onClick={() => setShowAddEmployee(true)}>
                    <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                    Add Employee
                  </Button>
                </div>

                {/* Employee Table */}
                <div style={{
                  backgroundColor: theme.colors.card,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: theme.shadow.sm
                }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: theme.colors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: theme.colors.primaryForeground,
                                fontSize: '0.875rem',
                                fontWeight: '600'
                              }}>
                                {employee.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  color: theme.colors.foreground
                                }}>
                                  {employee.name}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: theme.colors.mutedForeground
                                }}>
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {employee.department}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span style={{ fontSize: '0.875rem' }}>
                              {employee.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {employee.permissions.map((permission) => (
                                <span
                                  key={permission}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '0.125rem 0.25rem',
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.secondary,
                                    color: theme.colors.foreground,
                                    border: `1px solid ${theme.colors.border}`
                                  }}
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={employee.status === 'Active' ? 'success' : 'secondary'}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedEmployee(employee);
                                setShowEditEmployee(true);
                              }}>
                                <Icon name="edit" size={14} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => {
                                console.log('Remove employee:', employee.name);
                              }}>
                                <Icon name="delete" size={14} color={theme.colors.destructive} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {settingsTab === 'integrations' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Integrations
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  Connect third-party services and APIs
                </p>
                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {[
                    { name: 'WhatsApp Business', icon: 'integration', status: 'Connected', color: theme.colors.success },
                    { name: 'SMS Gateway', icon: 'integration', status: 'Connected', color: theme.colors.success },
                    { name: 'Email Service', icon: 'integration', status: 'Disconnected', color: theme.colors.destructive },
                    { name: 'Voice Calls', icon: 'integration', status: 'Pending Setup', color: theme.colors.mutedForeground }
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      style={{
                        padding: '1rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon name={integration.icon} size={20} color={theme.colors.primary} />
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: theme.colors.foreground
                          }}>
                            {integration.name}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: integration.color,
                          fontWeight: '500'
                        }}
                      >
                        {integration.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Notification Preferences
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { label: 'New workitem assignments', checked: true },
                    { label: 'Contact status updates', checked: true },
                    { label: 'Workflow completions', checked: false },
                    { label: 'System maintenance alerts', checked: true },
                    { label: 'Daily summary reports', checked: false }
                  ].map((item, index) => (
                    <label
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.secondary,
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: theme.colors.primary
                        }}
                      />
                      <span style={{
                        fontSize: '0.875rem',
                        color: theme.colors.foreground
                      }}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {settingsTab === 'security' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Security Settings
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Authentication
                    </h4>
                    <Button>Change Password</Button>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Two-Factor Authentication
                    </h4>
                    <Button variant="secondary">Enable 2FA</Button>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Data Export
                    </h4>
                    <Button variant="secondary">Export All Data</Button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'billing' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Billing & Usage
                </h3>
                <div style={{
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.secondary
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: theme.colors.foreground,
                        margin: 0
                      }}>
                        Current Plan
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.colors.mutedForeground,
                        margin: '0.25rem 0 0 0'
                      }}>
                        Professional
                      </p>
                    </div>
                  </div>
                  <Button style={{ marginTop: '1rem' }}>
                    <Icon name="star" size={16} color={theme.colors.primaryForeground} />
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // AI Chat Modal
  const AIChatModal = () => {
    const [messages, setMessages] = useState([
      {
        id: 1,
        type: 'ai',
        content: 'Hello! I\'m your AI assistant. How can I help you with your workitems and contacts today?',
        timestamp: new Date()
      }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputMessage.trim()) {
        const newMessage = {
          id: Date.now(),
          type: 'user',
          content: inputMessage,
          timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
        setInputMessage('');

        // Simulate AI response
        setTimeout(() => {
          const aiResponse = {
            id: Date.now() + 1,
            type: 'ai',
            content: 'I understand your request. Let me analyze your data and provide insights...',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      }
    };

    return (
      <Modal
        show={showAIChat}
        onClose={() => setShowAIChat(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="ai" size={20} color={theme.colors.primary} />
            AI Assistant
            <span style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '12px',
              backgroundColor: theme.colors.success,
              color: theme.colors.primaryForeground,
              fontWeight: '500',
              marginLeft: 'auto'
            }}>
              Online
            </span>
          </div>
        }
        size="lg"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '500px'
        }}>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: message.type === 'user' ? theme.colors.primary : theme.colors.secondary,
                  color: message.type === 'user' ? theme.colors.primaryForeground : theme.colors.foreground,
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: '1rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <Input
              placeholder="Ask me anything about your workitems, contacts, or workflows..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button type="submit" disabled={!inputMessage.trim()}>
              <Icon name="chevronRight" size={16} color={theme.colors.primaryForeground} />
            </Button>
          </form>

          {/* Token Usage */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: theme.colors.mutedForeground,
            textAlign: 'center'
          }}>
            Tokens remaining: {currentUser.tokenBalance.toLocaleString()} • Each message uses ~10-50 tokens
          </div>
        </div>
      </Modal>
    );
  };

  // Add Workitem Type Modal
  const AddWorkitemTypeModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      color: '#3b82f6'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Adding workitem type:', formData);
      setShowAddWorkitemType(false);
      setFormData({ name: '', description: '', color: '#3b82f6' });
    };

    if (!showAddWorkitemType) return null;

    return (
      <Modal
        show={showAddWorkitemType}
        onClose={() => setShowAddWorkitemType(false)}
        title="Add Workitem Type"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter type name"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter type description"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowAddWorkitemType(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
              Add Type
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Edit Workitem Type Modal
  const EditWorkitemTypeModal = () => {
    const [formData, setFormData] = useState(selectedWorkitemType || {});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Updating workitem type:', formData);
      setShowEditWorkitemType(false);
    };

    if (!showEditWorkitemType || !selectedWorkitemType) return null;

    return (
      <Modal
        show={showEditWorkitemType}
        onClose={() => setShowEditWorkitemType(false)}
        title="Edit Workitem Type"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type Name
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter type name"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Color
              </label>
              <input
                type="color"
                value={formData.color || '#3b82f6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowEditWorkitemType(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Add Contact Type Modal
  const AddContactTypeModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      color: '#3b82f6'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Adding contact type:', formData);
      setShowAddContactType(false);
      setFormData({ name: '', description: '', color: '#3b82f6' });
    };

    if (!showAddContactType) return null;

    return (
      <Modal
        show={showAddContactType}
        onClose={() => setShowAddContactType(false)}
        title="Add Contact Type"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter type name"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter type description"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowAddContactType(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
              Add Type
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Edit Contact Type Modal
  const EditContactTypeModal = () => {
    const [formData, setFormData] = useState(selectedContactType || {});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Updating contact type:', formData);
      setShowEditContactType(false);
    };

    if (!showEditContactType || !selectedContactType) return null;

    return (
      <Modal
        show={showEditContactType}
        onClose={() => setShowEditContactType(false)}
        title="Edit Contact Type"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Type Name
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter type name"
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Color
              </label>
              <input
                type="color"
                value={formData.color || '#3b82f6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  backgroundColor: theme.colors.card,
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowEditContactType(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Manage Fields Modal
  const ManageFieldsModal = () => {
    const currentType = selectedFieldType === 'workitem' ? selectedWorkitemType : selectedContactType;
    
    // Sample fields data for demonstration
    const sampleFields = selectedFieldType === 'workitem' && selectedWorkitemType?.name === 'Lead' ? [
      {
        id: 1,
        name: 'Lead Score',
        fieldKey: 'lead_score',
        description: 'Numerical score for lead quality assessment (0-100)',
        type: 'number',
        required: true,
        defaultValue: '0',
        validation: { minValue: '0', maxValue: '100' }
      },
      {
        id: 2,
        name: 'Lead Source',
        fieldKey: 'lead_source',
        description: 'How this lead was acquired',
        type: 'select',
        required: false,
        defaultValue: 'Website',
        validation: { selectOptions: 'Website\nReferral\nCold Call\nSocial Media\nEmail Campaign' }
      }
    ] : selectedFieldType === 'contact' && selectedContactType?.name === 'Customer' ? [
      {
        id: 3,
        name: 'Annual Revenue',
        fieldKey: 'annual_revenue',
        description: 'Expected or actual annual revenue from customer',
        type: 'currency',
        required: false,
        defaultValue: '',
        validation: { minValue: '0' }
      },
      {
        id: 4,
        name: 'Industry',
        fieldKey: 'industry',
        description: 'Customer business industry',
        type: 'select',
        required: true,
        defaultValue: '',
        validation: { selectOptions: 'Technology\nHealthcare\nFinance\nManufacturing\nRetail\nEducation\nOther' }
      }
    ] : [];

    if (!showManageFields || !currentType) return null;

    return (
      <Modal
        show={showManageFields}
        onClose={() => setShowManageFields(false)}
        title={`Manage Fields - ${currentType.name} ${selectedFieldType === 'workitem' ? 'Workitems' : 'Contacts'}`}
        size="xl"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Custom Fields for {currentType.name} {selectedFieldType === 'workitem' ? 'Workitems' : 'Contacts'}
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: theme.colors.mutedForeground,
                margin: '0.25rem 0 0 0'
              }}>
                Configure custom fields that will appear when creating or editing {currentType.name.toLowerCase()} {selectedFieldType === 'workitem' ? 'workitems' : 'contacts'}
              </p>
            </div>
            <Button onClick={() => setShowAddCustomField(true)}>
              <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
              Add Field
            </Button>
          </div>

          {sampleFields.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: theme.colors.mutedForeground,
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <Icon name="fields" size={48} color={theme.colors.mutedForeground} />
              <h5 style={{ 
                margin: '1rem 0 0.5rem 0', 
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground
              }}>
                No Custom Fields
              </h5>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                Start by adding custom fields for {currentType.name} {selectedFieldType === 'workitem' ? 'workitems' : 'contacts'}
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: theme.colors.card,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: theme.shadow.sm
            }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: field.required ? theme.colors.destructive : theme.colors.mutedForeground
                          }}></div>
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: theme.colors.foreground
                            }}>
                              {field.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: theme.colors.mutedForeground
                            }}>
                              {field.fieldKey}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '0.875rem', maxWidth: '200px' }}>
                          {field.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          field.type === 'number' ? 'secondary' :
                          field.type === 'currency' ? 'success' :
                          field.type === 'select' ? 'warning' :
                          'default'
                        }>
                          {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '0.75rem', color: theme.colors.mutedForeground }}>
                          {field.type === 'number' || field.type === 'currency' ? (
                            <>
                              {'minValue' in field.validation && field.validation.minValue && `Min: ${field.validation.minValue}`}
                              {'maxValue' in field.validation && field.validation.maxValue && `, Max: ${field.validation.maxValue}`}
                              <br/>
                              {field.required ? 'Required' : 'Optional'}
                            </>
                          ) : field.type === 'select' ? (
                            <>
                              Options: {field.validation?.selectOptions?.split('\n').slice(0, 2).join(', ')}
                              {field.validation?.selectOptions && field.validation.selectOptions.split('\n').length > 2 && '...'}
                              <br/>
                              {field.required ? 'Required' : 'Optional'}
                            </>
                          ) : (
                            field.required ? 'Required' : 'Optional'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontSize: '0.875rem' }}>
                          {field.defaultValue || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedField(field);
                            setShowEditField(true);
                          }}>
                            <Icon name="edit" size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            console.log('Delete field:', field.name);
                          }}>
                            <Icon name="delete" size={14} color={theme.colors.destructive} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Edit Field Modal
  const EditFieldModal = () => {
    const [formData, setFormData] = useState(selectedField || {
      name: '',
      fieldKey: '',
      description: '',
      type: 'text',
      required: false,
      defaultValue: '',
      validation: {
        minLength: '',
        maxLength: '',
        minValue: '',
        maxValue: '',
        pattern: '',
        selectOptions: ''
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Updating field:', formData);
      setShowEditField(false);
    };

    if (!showEditField || !selectedField) return null;

    return (
      <Modal
        show={showEditField}
        onClose={() => setShowEditField(false)}
        title="Edit Field"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Information */}
            <div style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Basic Information
              </h4>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Name
                    </label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Lead Score"
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Key
                    </label>
                    <Input
                      value={formData.fieldKey || ''}
                      onChange={(e) => setFormData({ ...formData, fieldKey: e.target.value })}
                      placeholder="e.g., lead_score"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.foreground,
                    marginBottom: '0.5rem'
                  }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this field is used for..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: theme.colors.card,
                      color: theme.colors.foreground,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Type
                    </label>
                    <select
                      value={formData.type || 'text'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Text Area</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="date">Date</option>
                      <option value="datetime">Date & Time</option>
                      <option value="currency">Currency</option>
                      <option value="percentage">Percentage</option>
                      <option value="url">URL</option>
                      <option value="select">Dropdown</option>
                      <option value="multiselect">Multi-Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio Buttons</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      cursor: 'pointer',
                      padding: '0.75rem 0'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.required || false}
                        onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                        style={{ margin: 0 }}
                      />
                      Required Field
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Default Value and Validation - simplified for space */}
            <div style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Default Value & Validation
              </h4>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.foreground,
                    marginBottom: '0.5rem'
                  }}>
                    Default Value
                  </label>
                  <Input
                    value={formData.defaultValue || ''}
                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                    placeholder="Enter default value"
                  />
                </div>

                {(formData.type === 'select' || formData.type === 'multiselect' || formData.type === 'radio') && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Options (one per line)
                    </label>
                    <textarea
                      value={formData.validation?.selectOptions || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation, selectOptions: e.target.value }
                      })}
                      placeholder="Low&#10;Medium&#10;High&#10;Critical"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '120px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {(formData.type === 'number' || formData.type === 'currency' || formData.type === 'percentage') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Minimum Value
                      </label>
                      <Input
                        type="number"
                        value={formData.validation?.minValue || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, minValue: e.target.value }
                        })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Maximum Value
                      </label>
                      <Input
                        type="number"
                        value={formData.validation?.maxValue || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, maxValue: e.target.value }
                        })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowEditField(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Add Custom Field Modal
  const AddCustomFieldModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      fieldKey: '',
      description: '',
      type: 'text',
      required: false,
      appliedTo: 'workitem',
      defaultValue: '',
      validation: {
        minLength: '',
        maxLength: '',
        minValue: '',
        maxValue: '',
        pattern: '',
        selectOptions: ''
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Adding custom field:', formData);
      setShowAddCustomField(false);
      setFormData({
        name: '',
        fieldKey: '',
        description: '',
        type: 'text',
        required: false,
        appliedTo: 'workitem',
        defaultValue: '',
        validation: {
          minLength: '',
          maxLength: '',
          minValue: '',
          maxValue: '',
          pattern: '',
          selectOptions: ''
        }
      });
    };

    const generateFieldKey = (name: string) => {
      return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    };

    if (!showAddCustomField) return null;

    return (
      <Modal
        show={showAddCustomField}
        onClose={() => setShowAddCustomField(false)}
        title="Add Custom Field"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Information */}
            <div style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Basic Information
              </h4>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name,
                          fieldKey: generateFieldKey(name)
                        });
                      }}
                      placeholder="e.g., Lead Score"
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Key
                    </label>
                    <Input
                      value={formData.fieldKey}
                      onChange={(e) => setFormData({ ...formData, fieldKey: e.target.value })}
                      placeholder="e.g., lead_score"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.foreground,
                    marginBottom: '0.5rem'
                  }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this field is used for..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: theme.colors.card,
                      color: theme.colors.foreground,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Field Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Text Area</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="date">Date</option>
                      <option value="datetime">Date & Time</option>
                      <option value="currency">Currency</option>
                      <option value="percentage">Percentage</option>
                      <option value="url">URL</option>
                      <option value="select">Dropdown</option>
                      <option value="multiselect">Multi-Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio Buttons</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Applied To
                    </label>
                    <select
                      value={formData.appliedTo}
                      onChange={(e) => setFormData({ ...formData, appliedTo: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="workitem">Workitems</option>
                      <option value="contact">Contacts</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.foreground,
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.required}
                      onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                      style={{ margin: 0 }}
                    />
                    Required Field
                  </label>
                </div>
              </div>
            </div>

            {/* Default Value */}
            <div style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Default Value
              </h4>
              
              <div>
                <Input
                  value={formData.defaultValue}
                  onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                  placeholder={
                    formData.type === 'select' || formData.type === 'multiselect' ? 
                    'Enter default option' :
                    formData.type === 'date' ? 'YYYY-MM-DD or "today"' :
                    formData.type === 'number' ? 'Enter default number' :
                    'Enter default value'
                  }
                />
              </div>
            </div>

            {/* Validation Rules */}
            <div style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: '8px',
              padding: '1rem',
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Validation Rules
              </h4>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {(formData.type === 'text' || formData.type === 'textarea') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Minimum Length
                      </label>
                      <Input
                        type="number"
                        value={formData.validation.minLength}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, minLength: e.target.value }
                        })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Maximum Length
                      </label>
                      <Input
                        type="number"
                        value={formData.validation.maxLength}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, maxLength: e.target.value }
                        })}
                        placeholder="255"
                      />
                    </div>
                  </div>
                )}

                {(formData.type === 'number' || formData.type === 'currency' || formData.type === 'percentage') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Minimum Value
                      </label>
                      <Input
                        type="number"
                        value={formData.validation.minValue}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, minValue: e.target.value }
                        })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.foreground,
                        marginBottom: '0.5rem'
                      }}>
                        Maximum Value
                      </label>
                      <Input
                        type="number"
                        value={formData.validation.maxValue}
                        onChange={(e) => setFormData({
                          ...formData,
                          validation: { ...formData.validation, maxValue: e.target.value }
                        })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}

                {(formData.type === 'select' || formData.type === 'multiselect' || formData.type === 'radio') && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Options (one per line)
                    </label>
                    <textarea
                      value={formData.validation.selectOptions}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation, selectOptions: e.target.value }
                      })}
                      placeholder="Low&#10;Medium&#10;High&#10;Critical"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: theme.colors.card,
                        color: theme.colors.foreground,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '120px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                {formData.type === 'text' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '0.5rem'
                    }}>
                      Pattern (Regular Expression)
                    </label>
                    <Input
                      value={formData.validation.pattern}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: { ...formData.validation, pattern: e.target.value }
                      })}
                      placeholder="e.g., ^[A-Z]{2}[0-9]{6}$ for ID format"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <Button type="button" variant="secondary" onClick={() => setShowAddCustomField(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
              Add Field
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Add Employee Modal
  const AddEmployeeModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      department: 'Sales',
      role: '',
      permissions: [] as string[]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Adding employee:', formData);
      setShowAddEmployee(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Sales',
        role: '',
        permissions: []
      });
    };

    return (
      <Modal
        show={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="plus" size={20} color={theme.colors.primary} />
            Add New Employee
          </div>
        }
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Full Name *
              </label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="email@griv.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                  required
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Role *
                </label>
                <Input
                  placeholder="e.g., Sales Manager"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Permissions
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {['READ', 'WRITE', 'DELETE', 'ADMIN'].map((permission) => (
                  <label
                    key={permission}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: theme.colors.secondary,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={permission}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev: any) => ({
                          ...prev,
                          permissions: checked 
                            ? [...prev.permissions, permission]
                            : prev.permissions.filter((p: string) => p !== permission)
                        }));
                      }}
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowAddEmployee(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Add Employee
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Edit Employee Modal
  const EditEmployeeModal = () => {
    const [formData, setFormData] = useState(selectedEmployee || {});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Updating employee:', formData);
      setShowEditEmployee(false);
      setSelectedEmployee(null);
    };

    if (!selectedEmployee) return null;

    return (
      <Modal
        show={showEditEmployee}
        onClose={() => {
          setShowEditEmployee(false);
          setSelectedEmployee(null);
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="edit" size={20} color={theme.colors.primary} />
            Edit Employee
          </div>
        }
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Full Name *
              </label>
              <Input
                placeholder="Enter full name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Status
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Department
                </label>
                <select
                  value={formData.department || 'Sales'}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: theme.colors.card,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Role
                </label>
                <Input
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Permissions
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {['READ', 'WRITE', 'DELETE', 'ADMIN'].map((permission) => (
                  <label
                    key={permission}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: theme.colors.secondary,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      value={permission}
                      defaultChecked={formData.permissions?.includes(permission)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const currentPermissions = formData.permissions || [];
                        setFormData((prev: any) => ({
                          ...prev,
                          permissions: checked 
                            ? [...currentPermissions, permission]
                            : currentPermissions.filter((p: string) => p !== permission)
                        }));
                      }}
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowEditEmployee(false);
                setSelectedEmployee(null);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" size={16} color={theme.colors.primaryForeground} />
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  // Floating AI Assistant Button
  const FloatingAIButton = () => {
    if (showAIChat) return null;

    return (
      <button
        onClick={() => setShowAIChat(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
          border: 'none',
          cursor: 'pointer',
          boxShadow: theme.shadow.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s',
          animation: 'pulse 2s infinite'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Icon name="ai" size={28} color={theme.colors.primaryForeground} />
      </button>
    );
  };

  // Render current screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'workitems':
        return <WorkitemsScreen />;
      case 'contacts':
        return <ContactsScreen />;
      case 'workflows':
        return <WorkflowsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 ${theme.colors.primary}40; }
            50% { box-shadow: 0 0 0 10px ${theme.colors.primary}00; }
          }
        `}
      </style>
      
      <Header />
      {renderScreen()}

      {/* Modals */}
      <CreateWorkitemModal />
      <CreateContactModal />
      <AIChatModal />
      <AddWorkitemTypeModal />
      <EditWorkitemTypeModal />
      <AddContactTypeModal />
      <EditContactTypeModal />
      <AddCustomFieldModal />
      <ManageFieldsModal />
      <EditFieldModal />
      <AddEmployeeModal />
      <EditEmployeeModal />

      {/* Floating AI Assistant */}
      <FloatingAIButton />
    </div>
  );
};

export default App;