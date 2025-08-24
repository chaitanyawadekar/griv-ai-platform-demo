# Griv AI Platform - UI Components Guide

## 📋 Table of Contents

1. [Component Overview](#component-overview)
2. [ShadCN Components](#shadcn-components)
3. [Icon System](#icon-system)
4. [Modal System](#modal-system)
5. [Form Components](#form-components)
6. [Screen Components](#screen-components)

## Component Overview

The Griv AI Platform uses a comprehensive component library built with ShadCN design principles, featuring:

- **50+ Custom Components** - Professional UI elements
- **30+ SVG Icons** - Scalable vector graphics
- **Type-Safe Props** - Full TypeScript integration
- **Consistent Theming** - Orange brand color palette
- **Responsive Design** - Mobile-first approach

## ShadCN Components

### Table Components

#### Table Structure
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell Content</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Table Component Details

**Table Container**
```typescript
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
```

**TableHeader**
- Background: `theme.colors.secondary` (#f8fafc)
- Text Transform: Uppercase
- Font Weight: 600
- Letter Spacing: 0.05em
- Font Size: 0.75rem

**TableRow**
- Border Bottom: `1px solid ${theme.colors.border}`
- Hover Effect: Background changes to `theme.colors.secondary`
- Clickable rows: Cursor pointer
- Smooth transitions: 0.2s ease

**TableCell**
- Padding: 0.75rem 1rem
- Text Alignment: Left (default)
- Color: `theme.colors.foreground`
- Overflow: Hidden with ellipsis

#### Usage Examples

**Workitems Table**
```typescript
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
    {filteredWorkitems.map((item) => (
      <TableRow key={item.id} onClick={() => handleItemClick(item)}>
        <TableCell>
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
              {type.icon}
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: theme.colors.mutedForeground }}>
                {item.description.substring(0, 50)}...
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{item.type}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
        </TableCell>
        {/* More cells... */}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Badge Components

#### Badge Variants
```typescript
const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' 
}> = ({ children, variant = 'default' }) => {
  const variants = {
    default: { 
      backgroundColor: theme.colors.primary, 
      color: theme.colors.primaryForeground 
    },
    success: { 
      backgroundColor: theme.colors.success, 
      color: theme.colors.primaryForeground 
    },
    warning: { 
      backgroundColor: theme.colors.warning, 
      color: theme.colors.primaryForeground 
    },
    destructive: { 
      backgroundColor: theme.colors.destructive, 
      color: theme.colors.primaryForeground 
    },
    secondary: { 
      backgroundColor: theme.colors.secondary, 
      color: theme.colors.foreground 
    }
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

#### Badge Usage Examples

**Status Badges**
```typescript
// Success status
<Badge variant="success">Completed</Badge>

// Warning status  
<Badge variant="warning">In Progress</Badge>

// Error status
<Badge variant="destructive">Failed</Badge>

// Default status
<Badge variant="default">Open</Badge>

// Secondary status
<Badge variant="secondary">Draft</Badge>
```

**Priority Badges**
```typescript
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'secondary';
  }
};

<Badge variant={getPriorityBadge(item.priority)}>
  {item.priority}
</Badge>
```

### Button Components

#### Button Variants
```typescript
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'default', 
  disabled = false 
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
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.foreground,
      border: 'none'
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
      color: theme.colors.primaryForeground,
      border: 'none'
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    default: { padding: '0.75rem 1.5rem', fontSize: '0.875rem' },
    lg: { padding: '1rem 2rem', fontSize: '1rem' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '8px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== 'ghost') {
          e.currentTarget.style.opacity = '0.9';
        }
        if (!disabled && variant === 'ghost') {
          e.currentTarget.style.backgroundColor = theme.colors.secondary;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
          if (variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }
      }}
    >
      {children}
    </button>
  );
};
```

#### Button Usage Examples

**Primary Actions**
```typescript
<Button onClick={() => setShowCreateWorkitem(true)}>
  <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
  Create Workitem
</Button>
```

**Secondary Actions**
```typescript
<Button variant="secondary" size="sm" onClick={() => handleEdit()}>
  <Icon name="edit" size={14} />
  Edit
</Button>
```

**Ghost Actions**
```typescript
<Button variant="ghost" size="sm" onClick={() => handleDelete()}>
  <Icon name="delete" size={14} color={theme.colors.destructive} />
</Button>
```

## Icon System

### Icon Component
```typescript
const Icon: React.FC<{ 
  name: string; 
  size?: number; 
  color?: string 
}> = ({ name, size = 24, color = 'currentColor' }) => {
  const icons = {
    // Navigation Icons (8)
    dashboard: <DashboardSVG />,
    workitems: <WorkitemsSVG />,
    contacts: <ContactsSVG />,
    workflows: <WorkflowsSVG />,
    settings: <SettingsSVG />,
    user: <UserSVG />,
    logout: <LogoutSVG />,
    ai: <AISVG />,

    // Action Icons (10)
    plus: <PlusSVG />,
    edit: <EditSVG />,
    delete: <DeleteSVG />,
    save: <SaveSVG />,
    search: <SearchSVG />,
    filter: <FilterSVG />,
    download: <DownloadSVG />,
    refresh: <RefreshSVG />,
    sync: <SyncSVG />,
    upload: <UploadSVG />,

    // UI Icons (6)
    'chevron-down': <ChevronDownSVG />,
    'chevron-up': <ChevronUpSVG />,
    'chevron-left': <ChevronLeftSVG />,
    'chevron-right': <ChevronRightSVG />,
    check: <CheckSVG />,
    x: <XSVG />,

    // Communication Icons (6)
    phone: <PhoneSVG />,
    email: <EmailSVG />,
    message: <MessageSVG />,
    video: <VideoSVG />,
    voice: <VoiceSVG />,
    bell: <BellSVG />,

    // Data Icons (8)
    calendar: <CalendarSVG />,
    clock: <ClockSVG />,
    building: <BuildingSVG />,
    team: <TeamSVG />,
    fields: <FieldsSVG />,
    table: <TableSVG />,
    star: <StarSVG />,
    shield: <ShieldSVG />
  };

  const IconSVG = icons[name];
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      color, 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {IconSVG}
    </div>
  );
};
```

### Icon Categories

#### Navigation Icons
- **dashboard** - Grid layout for dashboard screen
- **workitems** - Document with lines for workitem management
- **contacts** - Multiple user silhouettes for contact management
- **workflows** - Connected nodes for workflow builder
- **settings** - Gear icon for settings screen
- **user** - Single user silhouette for profile
- **logout** - Arrow pointing to door for logout
- **ai** - Brain/circuit icon for AI assistant

#### Action Icons
- **plus** - Circle with plus for create actions
- **edit** - Pencil icon for edit actions
- **delete** - Trash can for delete actions
- **save** - Disk icon for save actions
- **search** - Magnifying glass for search
- **filter** - Funnel icon for filtering
- **download** - Arrow pointing down for downloads
- **refresh** - Circular arrows for refresh
- **sync** - Two-way arrows for synchronization
- **upload** - Arrow pointing up for uploads

#### Communication Icons
- **phone** - Phone handset for calls
- **email** - Envelope for email
- **message** - Chat bubble for messaging
- **video** - Camera for video calls
- **voice** - Microphone for voice
- **bell** - Bell for notifications

## Modal System

### Modal Component
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        backgroundColor: theme.colors.card,
        borderRadius: '12px',
        ...sizeClasses[size],
        width: '100%',
        maxHeight: 'calc(100vh - 2rem)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadow.lg,
        animation: 'modalSlideIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
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
              color: theme.colors.mutedForeground,
              padding: '0.25rem',
              borderRadius: '4px'
            }}
          >
            <Icon name="x" size={20} />
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

### Modal Types and Examples

#### Create Workitem Modal
```typescript
const CreateWorkitemModal = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lead',
    priority: 'Medium',
    assignee: '',
    department: '',
    dueDate: ''
  });

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
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter workitem title"
              required
            />
          </div>
          <div>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Lead">Lead</option>
              <option value="Task">Task</option>
              <option value="Grievance">Grievance</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
        </div>
        
        <div>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter workitem description..."
            rows={4}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowCreateWorkitem(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateWorkitem}>
            <Icon name="save" size={16} color={theme.colors.primaryForeground} />
            Create Workitem
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

#### Manage Fields Modal
```typescript
const ManageFieldsModal = () => {
  const currentType = selectedFieldType === 'workitem' 
    ? workitemTypes.find(t => t.id === selectedWorkitemType?.id)
    : contactTypes.find(t => t.id === selectedContactType?.id);

  const sampleFields = currentType?.name === 'Lead' ? [
    {
      id: 'lead_score',
      name: 'Lead Score',
      fieldKey: 'lead_score',
      description: 'Numerical score indicating lead quality (0-100)',
      type: 'number',
      required: true,
      defaultValue: '50',
      validation: { minValue: '0', maxValue: '100' }
    },
    {
      id: 'lead_source',
      name: 'Lead Source',
      fieldKey: 'lead_source', 
      description: 'Channel through which lead was acquired',
      type: 'select',
      required: true,
      defaultValue: '',
      validation: { selectOptions: 'Website\nSocial Media\nReferral\nCold Outreach\nAdvertising\nEvents' }
    }
  ] : currentType?.name === 'Customer' ? [
    {
      id: 'annual_revenue',
      name: 'Annual Revenue',
      fieldKey: 'annual_revenue',
      description: 'Customer yearly revenue in USD',
      type: 'currency',
      required: false,
      defaultValue: '0',
      validation: { minValue: '0' }
    },
    {
      id: 'industry',
      name: 'Industry',
      fieldKey: 'industry',
      description: 'Customer business industry',
      type: 'select',
      required: true,
      defaultValue: '',
      validation: { selectOptions: 'Technology\nHealthcare\nFinance\nManufacturing\nRetail\nEducation\nOther' }
    }
  ] : [];

  return (
    <Modal
      show={showManageFields}
      onClose={() => setShowManageFields(false)}
      title={`Manage Fields - ${currentType?.name} ${selectedFieldType === 'workitem' ? 'Workitems' : 'Contacts'}`}
      size="xl"
    >
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4>Custom Fields for {currentType?.name}</h4>
            <p style={{ color: theme.colors.mutedForeground, margin: '0.25rem 0 0 0' }}>
              Configure custom fields that will appear when creating or editing {currentType?.name.toLowerCase()} {selectedFieldType === 'workitem' ? 'workitems' : 'contacts'}
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
            backgroundColor: theme.colors.secondary,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <Icon name="fields" size={48} color={theme.colors.mutedForeground} />
            <h5>No Custom Fields</h5>
            <p style={{ color: theme.colors.mutedForeground }}>
              Start by adding custom fields for {currentType?.name} {selectedFieldType === 'workitem' ? 'workitems' : 'contacts'}
            </p>
          </div>
        ) : (
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
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                          {field.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: theme.colors.mutedForeground }}>
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
                      {field.required ? 'Required' : 'Optional'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: '0.875rem' }}>
                      {field.defaultValue || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                        <Icon name="edit" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                        <Icon name="delete" size={14} color={theme.colors.destructive} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Modal>
  );
};
```

## Form Components

### Input Component
```typescript
const Input: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text', 
  required = false, 
  disabled = false,
  className = ''
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={className}
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
```

### Form Field Pattern
```typescript
const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}> = ({ label, required = false, children, error }) => {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <label style={{
        fontSize: '0.875rem',
        fontWeight: '500',
        color: theme.colors.foreground
      }}>
        {label}
        {required && (
          <span style={{ color: theme.colors.destructive, marginLeft: '0.25rem' }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <span style={{
          fontSize: '0.75rem',
          color: theme.colors.destructive
        }}>
          {error}
        </span>
      )}
    </div>
  );
};
```

## Screen Components

### Screen Layout Pattern
```typescript
const ScreenLayout: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, actions, children }) => {
  return (
    <div style={{
      padding: '2rem',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: theme.colors.background
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: theme.colors.foreground,
            margin: 0
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: '1rem',
              color: theme.colors.mutedForeground,
              margin: '0.5rem 0 0 0'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
};
```

### Screen Usage Examples

**Workitems Screen Structure**
```typescript
const WorkitemsScreen = () => {
  return (
    <ScreenLayout
      title="Workitems"
      subtitle={`Manage leads, tasks, grievances, and follow-ups (${filteredWorkitems.length} total)`}
      actions={
        <Button onClick={() => setShowCreateWorkitem(true)}>
          <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
          Create Workitem
        </Button>
      }
    >
      {/* Filter Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 200px 200px',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search workitems..."
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Lead">Lead</option>
          <option value="Task">Task</option>
          <option value="Grievance">Grievance</option>
          <option value="Follow-up">Follow-up</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      
      {/* Data Table */}
      {filteredWorkitems.length === 0 ? (
        <EmptyState
          icon="workitems"
          title="No workitems found"
          description="Try adjusting your search criteria or create a new workitem."
        />
      ) : (
        <WorkitemsTable items={filteredWorkitems} />
      )}
    </ScreenLayout>
  );
};
```

---

*This UI Components Guide provides comprehensive documentation for all visual elements and interaction patterns used in the Griv AI Platform demo application.*