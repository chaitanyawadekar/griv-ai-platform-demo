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
        <path d="M12 1v6m0 6v6"/>
        <path d="M1 12h6m6 0h6"/>
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
        transition: 'border-color 0.2s'
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
                      setShowSettings(true);
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

  // Workitems Screen
  const WorkitemsScreen = () => {
    const filteredWorkitems = workitems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
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
              Workitems
            </h1>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: 0,
              fontSize: '0.875rem'
            }}>
              Manage leads, tasks, grievances, and follow-ups
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

        {/* Workitems List */}
        <div style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
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
              {filteredWorkitems.length} Workitems Found
            </h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {filteredWorkitems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: theme.colors.mutedForeground
              }}>
                <Icon name="workitems" size={48} color={theme.colors.mutedForeground} />
                <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem' }}>
                  No workitems found matching your criteria
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredWorkitems.map((item) => {
                  const type = workitemTypes.find(t => t.name === item.type);
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: theme.colors.secondary,
                        borderRadius: '8px',
                        border: `1px solid ${theme.colors.border}`,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = theme.shadow.md;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          {type && (
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              backgroundColor: `${type.color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{ fontSize: '1.25rem' }}>{type.icon}</span>
                            </div>
                          )}
                          <div>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: '0 0 0.25rem 0'
                            }}>
                              {item.title}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '12px',
                            backgroundColor: item.priority === 'High' ? theme.colors.destructive : 
                                           item.priority === 'Medium' ? theme.colors.warning : theme.colors.success,
                            color: theme.colors.primaryForeground,
                            fontWeight: '500'
                          }}>
                            {item.priority}
                          </span>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '12px',
                            backgroundColor: item.status === 'Open' ? theme.colors.info : 
                                           item.status === 'In Progress' ? theme.colors.warning : theme.colors.success,
                            color: theme.colors.primaryForeground,
                            fontWeight: '500'
                          }}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: theme.colors.mutedForeground
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="user" size={16} />
                          <span>{item.assignee}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="building" size={16} />
                          <span>{item.department}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="calendar" size={16} />
                          <span>Due: {item.dueDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="clock" size={16} />
                          <span>Created: {item.createdAt}</span>
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div style={{
                          marginTop: '1rem',
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                                backgroundColor: theme.colors.border,
                                color: theme.colors.mutedForeground
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
          border: `1px solid ${theme.colors.border}`,
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
          <div style={{ padding: '1.5rem' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredContacts.map((contact) => {
                  const type = contactTypes.find(t => t.name === contact.type);
                  return (
                    <div
                      key={contact.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: theme.colors.secondary,
                        borderRadius: '8px',
                        border: `1px solid ${theme.colors.border}`,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = theme.shadow.md;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          {type && (
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              backgroundColor: `${type.color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                            </div>
                          )}
                          <div>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: theme.colors.foreground,
                              margin: '0 0 0.25rem 0'
                            }}>
                              {contact.name}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: theme.colors.mutedForeground,
                              margin: 0
                            }}>
                              {contact.type}
                            </p>
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          borderRadius: '12px',
                          backgroundColor: contact.status === 'Active' ? theme.colors.success : theme.colors.border,
                          color: contact.status === 'Active' ? theme.colors.primaryForeground : theme.colors.mutedForeground,
                          fontWeight: '500'
                        }}>
                          {contact.status}
                        </span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: theme.colors.mutedForeground
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="phone" size={16} />
                          <span>{contact.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="email" size={16} />
                          <span>{contact.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="location" size={16} />
                          <span>{contact.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon name="clock" size={16} />
                          <span>Last contact: {contact.lastContact}</span>
                        </div>
                      </div>
                      {contact.tags && contact.tags.length > 0 && (
                        <div style={{
                          marginTop: '1rem',
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          {contact.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                                backgroundColor: theme.colors.border,
                                color: theme.colors.mutedForeground
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
        <div style={{ display: 'flex', gap: '2rem', minHeight: '500px' }}>
          {/* Settings Navigation */}
          <div style={{
            minWidth: '200px',
            borderRight: `1px solid ${theme.colors.border}`,
            paddingRight: '1rem'
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
          <div style={{ flex: 1 }}>
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
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
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
                          fontSize: '0.875rem'
                        }}
                      >
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                        <option>America/New_York (EST)</option>
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
                          fontSize: '0.875rem'
                        }}
                      >
                        <option>English</option>
                        <option>हिंदी (Hindi)</option>
                        <option>বাংলা (Bengali)</option>
                        <option>తెలుగు (Telugu)</option>
                      </select>
                    </div>
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
      <SettingsModal />
      <AIChatModal />
      <AddEmployeeModal />
      <EditEmployeeModal />

      {/* Floating AI Assistant */}
      <FloatingAIButton />
    </div>
  );
};

export default App;