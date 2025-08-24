# Griv AI Platform - Technical Documentation

## 📋 Table of Contents

1. [Component Architecture](#component-architecture)
2. [State Management](#state-management)
3. [UI Component Library](#ui-component-library)
4. [API Design Patterns](#api-design-patterns)
5. [Performance Optimizations](#performance-optimizations)
6. [Development Workflow](#development-workflow)

## Component Architecture

### Core Application Structure

```typescript
App.tsx (6,300+ lines)
├── Theme Configuration (lines 1-30)
├── ShadCN Component Library (lines 31-150)
├── Icon System (lines 151-350)
├── Utility Components (lines 351-600)
├── Screen Components (lines 601-5000)
├── Modal Components (lines 5001-6200)
└── Main App Component (lines 6201-6300)
```

### ShadCN Component Implementation

#### Table Component System
```typescript
// Professional data table with full ShadCN compliance
const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
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

// Usage in Workitems Screen
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Workitem</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Status</TableHead>
      {/* ... more columns */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredWorkitems.map((item) => (
      <TableRow key={item.id} onClick={() => handleRowClick(item.id)}>
        <TableCell>{item.title}</TableCell>
        <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
        {/* ... more cells */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Badge Component Variants
```typescript
const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' 
}> = ({ children, variant = 'default' }) => {
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
```

### Screen Component Architecture

#### Screen Rendering System
```typescript
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
```

#### Settings Screen Implementation
```typescript
const SettingsScreen = () => {
  const settingsTabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'fields', label: 'Field Configuration', icon: 'fields' },
    { id: 'team', label: 'Team Management', icon: 'team' },
    // ... more tabs
  ];

  return (
    <div style={{
      padding: '2rem',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: theme.colors.background
    }}>
      {/* Navigation Sidebar */}
      <div style={{
        minWidth: '240px',
        backgroundColor: theme.colors.card,
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              style={{
                backgroundColor: settingsTab === tab.id ? theme.colors.primary : 'transparent',
                color: settingsTab === tab.id ? theme.colors.primaryForeground : theme.colors.foreground,
                // ... more styles
              }}
            >
              <Icon name={tab.icon} size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content Area */}
      <div style={{ flex: 1, backgroundColor: theme.colors.card }}>
        {/* Dynamic content based on settingsTab */}
      </div>
    </div>
  );
};
```

## State Management

### Application State Architecture

```typescript
// Navigation State
const [activeScreen, setActiveScreen] = useState('dashboard');
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Modal Management State
const [showCreateWorkitem, setShowCreateWorkitem] = useState(false);
const [showCreateContact, setShowCreateContact] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [showAIChat, setShowAIChat] = useState(false);

// Field Management State (Advanced)
const [showAddWorkitemType, setShowAddWorkitemType] = useState(false);
const [showEditWorkitemType, setShowEditWorkitemType] = useState(false);
const [showAddContactType, setShowAddContactType] = useState(false);
const [showEditContactType, setShowEditContactType] = useState(false);
const [showManageFields, setShowManageFields] = useState(false);
const [showEditField, setShowEditField] = useState(false);
const [selectedWorkitemType, setSelectedWorkitemType] = useState<any>(null);
const [selectedContactType, setSelectedContactType] = useState<any>(null);
const [selectedFieldType, setSelectedFieldType] = useState<'workitem' | 'contact'>('workitem');
const [selectedField, setSelectedField] = useState<any>(null);

// Employee Management State
const [showAddEmployee, setShowAddEmployee] = useState(false);
const [showEditEmployee, setShowEditEmployee] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

// Settings State
const [settingsTab, setSettingsTab] = useState('general');

// Filter and Search State
const [searchTerm, setSearchTerm] = useState('');
const [filterType, setFilterType] = useState('all');
const [filterStatus, setFilterStatus] = useState('all');
const [filterPriority, setFilterPriority] = useState('all');
```

### Data Models

#### Workitem Data Structure
```typescript
interface Workitem {
  id: number;
  title: string;
  description: string;
  type: 'Lead' | 'Task' | 'Grievance' | 'Follow-up';
  status: 'Open' | 'In Progress' | 'Completed' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  department: string;
  dueDate: string;
  createdAt: string;
  tags?: string[];
}

// Sample workitems data
const workitems: Workitem[] = [
  {
    id: 1,
    title: "New customer inquiry from Tech Corp",
    description: "Potential enterprise client interested in our automation solutions. Requires detailed proposal and technical consultation.",
    type: "Lead",
    status: "Open",
    priority: "High",
    assignee: "Sarah Wilson",
    department: "Sales",
    dueDate: "2024-08-30",
    createdAt: "2024-08-20",
    tags: ["enterprise", "tech", "high-value"]
  },
  // ... more workitems
];
```

#### Contact Data Structure
```typescript
interface Contact {
  id: number;
  name: string;
  type: 'Customer' | 'Voter' | 'Influencer' | 'Partner';
  phone: string;
  email: string;
  location: string;
  status: 'Active' | 'Inactive';
  lastContact: string;
  tags: string[];
  notes?: string;
}
```

#### Employee Data Structure
```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  permissions: ('READ' | 'WRITE' | 'DELETE' | 'ADMIN')[];
  status: 'Active' | 'Inactive';
  joinDate: string;
}
```

### Field Management System

#### Custom Field Configuration
```typescript
interface CustomField {
  id: string;
  name: string;
  fieldKey: string;
  description: string;
  type: 'text' | 'number' | 'currency' | 'select' | 'date' | 'boolean' | 'email';
  required: boolean;
  defaultValue: string;
  validation: {
    minLength?: string;
    maxLength?: string;
    minValue?: string;
    maxValue?: string;
    pattern?: string;
    selectOptions?: string; // newline-separated options
  };
}

// Sample field data for Lead workitems
const leadCustomFields: CustomField[] = [
  {
    id: 'lead_score',
    name: 'Lead Score',
    fieldKey: 'lead_score',
    description: 'Numerical score indicating lead quality',
    type: 'number',
    required: true,
    defaultValue: '50',
    validation: {
      minValue: '0',
      maxValue: '100'
    }
  },
  {
    id: 'lead_source',
    name: 'Lead Source',
    fieldKey: 'lead_source',
    description: 'Channel through which lead was acquired',
    type: 'select',
    required: true,
    defaultValue: '',
    validation: {
      selectOptions: 'Website\nSocial Media\nReferral\nCold Outreach\nAdvertising\nEvents'
    }
  }
];
```

## UI Component Library

### Theme System Implementation

```typescript
const theme = {
  colors: {
    // Base colors
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    
    // Brand colors
    primary: 'rgb(234, 88, 12)', // Orange #EA580C
    primaryForeground: '#ffffff',
    
    // UI colors
    secondary: '#f8fafc',
    border: '#e2e8f0',
    mutedForeground: '#64748b',
    
    // Status colors
    success: '#22c55e',
    warning: '#eab308',
    destructive: '#ef4444',
    info: '#3b82f6'
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};
```

### Icon System

```typescript
// SVG Icon Component with 30+ icons
const Icon: React.FC<{ 
  name: string; 
  size?: number; 
  color?: string 
}> = ({ name, size = 24, color = 'currentColor' }) => {
  const icons = {
    // Navigation icons
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="9"/>
        <rect x="14" y="3" width="7" height="5"/>
        <rect x="14" y="12" width="7" height="9"/>
        <rect x="3" y="16" width="7" height="5"/>
      </svg>
    ),
    workitems: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    // ... 28+ more icons
  };

  const IconSVG = icons[name] || icons.default;
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      color, 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {IconSVG}
    </div>
  );
};
```

### Modal System

```typescript
const Modal: React.FC<{
  show: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ show, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1200px' }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: theme.colors.card,
        borderRadius: '12px',
        ...sizeClasses[size],
        width: '100%',
        margin: '1rem',
        maxHeight: 'calc(100vh - 2rem)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadow.lg
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: theme.colors.mutedForeground
            }}
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};
```

## API Design Patterns

### Modal Management Pattern

```typescript
// Centralized modal state management
const useModalState = () => {
  const [modals, setModals] = useState({
    createWorkitem: false,
    createContact: false,
    manageFields: false,
    editField: false,
    addEmployee: false,
    editEmployee: false
  });

  const openModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  return { modals, openModal, closeModal };
};
```

### Field Management API Pattern

```typescript
// Field management operations
const useFieldManagement = () => {
  const [fields, setFields] = useState<CustomField[]>([]);
  
  const addField = (typeId: string, field: CustomField) => {
    // Add field to specific type
    setFields(prev => [...prev, { ...field, typeId }]);
  };
  
  const updateField = (fieldId: string, updates: Partial<CustomField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };
  
  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  };
  
  const getFieldsByType = (typeId: string) => {
    return fields.filter(field => field.typeId === typeId);
  };
  
  return { fields, addField, updateField, deleteField, getFieldsByType };
};
```

## Performance Optimizations

### Component Memoization

```typescript
// Memoized table row component
const MemoizedTableRow = React.memo<{ item: Workitem }>({  
  ({ item }) => {
    const type = workitemTypes.find(t => t.name === item.type);
    
    return (
      <TableRow onClick={() => console.log('View workitem:', item.id)}>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Workitem details */}
          </div>
        </TableCell>
        {/* More cells */}
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id &&
           prevProps.item.status === nextProps.item.status;
  }
});
```

### Filtering Optimization

```typescript
// Optimized filtering with useMemo
const WorkitemsScreen = () => {
  const filteredWorkitems = useMemo(() => {
    return workitems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [workitems, searchTerm, filterType, filterStatus, filterPriority]);

  // Component render...
};
```

### Lazy Loading Pattern

```typescript
// Lazy loading for large datasets
const usePaginatedData = <T>(data: T[], pageSize: number = 20) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);
  
  const totalPages = Math.ceil(data.length / pageSize);
  
  return {
    data: paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
```

## Development Workflow

### Code Organization

```
App.tsx Structure:
├── Lines 1-30: Theme and constants
├── Lines 31-150: ShadCN component definitions
├── Lines 151-350: Icon system
├── Lines 351-600: Utility components (Input, Button, Modal)
├── Lines 601-1200: Dashboard screen
├── Lines 1201-2000: Workitems screen  
├── Lines 2001-2500: Contacts screen
├── Lines 2501-3000: Workflows screen
├── Lines 3001-4500: Settings screen
├── Lines 4501-6000: All modal components
└── Lines 6001-6300: Main App component
```

### TypeScript Integration

```typescript
// Strong typing for props
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Event handler typing
const handleWorkitemClick = (workitem: Workitem) => {
  console.log('Clicked workitem:', workitem.id);
};

const handleFieldEdit = (field: CustomField) => {
  setSelectedField(field);
  setShowEditField(true);
};
```

### Error Boundaries

```typescript
// Error boundary for modal components
class ModalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Modal error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: theme.colors.destructive 
        }}>
          <h3>Something went wrong.</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Testing Strategies

```typescript
// Component testing utilities
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <div style={{ color: theme.colors.foreground }}>
      {component}
    </div>
  );
};

// Mock data for testing
const mockWorkitem: Workitem = {
  id: 1,
  title: "Test Workitem",
  description: "Test description",
  type: "Lead",
  status: "Open",
  priority: "High",
  assignee: "Test User",
  department: "Sales",
  dueDate: "2024-08-30",
  createdAt: "2024-08-20"
};
```

---

*This technical documentation complements the main README.md and provides deep technical insights into the Griv AI Platform implementation.*