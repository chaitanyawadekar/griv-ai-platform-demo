// Multi-tenant types
export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  logo?: string;
  subdomain?: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  settings: {
    theme?: 'light' | 'dark' | 'auto';
    timezone: string;
    currency: string;
    language: string;
  };
  subscription?: {
    planName: string;
    expiryDate: string;
    userLimit: number;
    storageLimit: number; // in GB
  };
  permissions: string[];
  createdAt: string;
  lastAccessed?: string;
}

export interface UserTenant {
  tenant: Tenant;
  role: 'owner' | 'admin' | 'manager' | 'user' | 'viewer';
  permissions: string[];
  joinedAt: string;
  lastAccessed?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  tenants: UserTenant[];
  currentTenantId?: string;
  preferences: {
    defaultTenant?: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

// Core application types
export interface Theme {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    border: string;
    input: string;
    ring: string;
    success: string;
    warning: string;
    destructive: string;
    info: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Workitem related types
export interface WorkitemType {
  id: string;
  name: string;
  color: string;
  icon: string;
  fields: string[];
}

export interface Workitem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  department: string;
  dueDate: string;
  tags: string[];
  location?: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  // Type-specific fields stored as flexible object
  typeFields?: Record<string, any>;
}

// Contact related types
export interface ContactType {
  id: string;
  name: string;
  color: string;
  fields: string[];
}

export interface Contact {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  location: string;
  status: 'Active' | 'Inactive';
  lastContact: string;
  tags?: string[];
}

// Field Configuration types
export interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
  appliesTo: 'workitem' | 'contact';
  workitemTypes?: string[];
  contactTypes?: string[];
}

// Employee types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  accessLevel: 'read' | 'write' | 'admin';
  permissions: {
    workitems: 'read' | 'write' | 'admin';
    contacts: 'read' | 'write' | 'admin';
    workflows: 'read' | 'write' | 'admin';
    settings: 'read' | 'write' | 'admin';
    team: 'read' | 'write' | 'admin';
  };
  status: 'Active' | 'Inactive';
  joinDate: string;
  lastActive?: string;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string; // Employee ID
  memberCount: number;
  color: string;
  createdAt: string;
}

// SOP related types
export interface SOPCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | string[];
}

export interface SOPStep {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'approval';
  mandatory: boolean;
  estimatedDuration: number; // in minutes
  assigneeType: 'role' | 'specific' | 'creator' | 'auto';
  assignee?: string;
  prerequisites?: string[];
  checklist?: string[];
  automationConfig?: {
    action: string;
    parameters: Record<string, any>;
  };
}

export interface SOP {
  id: string;
  name: string;
  description: string;
  appliesTo: 'workitem' | 'contact';
  conditions: SOPCondition[];
  steps: SOPStep[];
  status: 'active' | 'draft' | 'archived';
  version: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags?: string[];
}

// Navigation types
export type Screen = 
  | 'overview' 
  | 'workitems' 
  | 'contacts' 
  | 'analytics' 
  | 'settings';

export type SettingsTab = 
  | 'general' 
  | 'fields' 
  | 'workflows'
  | 'sops' 
  | 'team' 
  | 'integrations' 
  | 'notifications' 
  | 'security' 
  | 'billing';

// Modal state types
export interface ModalState {
  showCreateWorkitem: boolean;
  showCreateContact: boolean;
  showFieldConfig: boolean;
  showAddEmployee: boolean;
  showEditEmployee: boolean;
  showCreateSOP: boolean;
  showEditSOP: boolean;
  showManageSOPSteps: boolean;
  showConditionBuilder: boolean;
}


// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'warning';
  style?: React.CSSProperties;
}

export interface TableProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
}

export interface TableCellProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableHeadProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

// Dashboard Widget Types
export type WidgetType = 
  | 'metric_card' 
  | 'chart' 
  | 'table' 
  | 'progress_bar' 
  | 'activity_feed' 
  | 'quick_actions';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut';

// Widget Condition System - Comprehensive filtering
export type WidgetConditionOperator = 
  // Basic comparison
  | 'equals' | 'not_equals'
  // Text operations
  | 'contains' | 'not_contains' | 'starts_with' | 'ends_with'
  // Numeric/Date operations  
  | 'greater_than' | 'greater_than_or_equal' | 'less_than' | 'less_than_or_equal'
  // Array operations
  | 'in' | 'not_in' | 'includes_any' | 'includes_all'
  // Special operations
  | 'is_empty' | 'is_not_empty' | 'is_null' | 'is_not_null'
  // Date specific
  | 'is_today' | 'is_yesterday' | 'is_this_week' | 'is_this_month' | 'is_this_year'
  | 'last_n_days' | 'next_n_days' | 'between_dates'
  // Advanced text
  | 'matches_regex' | 'word_count_equals' | 'char_count_greater_than';

export interface WidgetCondition {
  id: string;
  field: string;
  operator: WidgetConditionOperator;
  value: string | number | string[] | boolean | null;
  // For date range operations
  secondValue?: string | number;
  // For advanced operations
  caseSensitive?: boolean;
  // For grouping conditions
  logicalOperator?: 'AND' | 'OR';
  // For nested conditions
  isGroup?: boolean;
  conditions?: WidgetCondition[];
}

export interface WidgetDataSource {
  type: 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom';
  // Advanced condition system
  conditions?: WidgetCondition[];
  conditionLogic?: 'AND' | 'OR' | 'CUSTOM'; // CUSTOM allows mixed AND/OR
  // Grouping and aggregation
  groupBy?: string;
  aggregation?: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  // Time-based filtering
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';
  customTimeRange?: {
    start: string;
    end: string;
  };
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Limiting results
  limit?: number;
  // For performance
  cacheEnabled?: boolean;
  cacheDuration?: number; // minutes
}

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position: { x: number; y: number; w: number; h: number };
  dataSource: WidgetDataSource;
  config: {
    chartType?: ChartType;
    showTrend?: boolean;
    color?: string;
    icon?: string;
    refreshInterval?: number; // minutes
    customQuery?: string;
    
    // Widget type-specific fields
    displayFormat?: 'number' | 'currency' | 'percentage' | 'duration';
    progressTarget?: number;
    progressType?: 'percentage' | 'count' | 'value';
    activityType?: 'recent' | 'updates' | 'alerts' | 'assignments';
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  relatedData?: {
    source: string;
    metric: string;
    value: string | number;
    change?: string;
  };
  createdAt: string;
}