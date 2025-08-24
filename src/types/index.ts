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
  department: string;
  role: string;
  permissions: string[];
  status: 'Active' | 'Inactive';
  joinDate: string;
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
  | 'dashboard' 
  | 'workitems' 
  | 'contacts' 
  | 'workflows' 
  | 'analytics' 
  | 'settings';

export type SettingsTab = 
  | 'general' 
  | 'fields' 
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

// Department types
export interface Department {
  name: string;
  members: number;
  head: string;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
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
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'destructive';
}

export interface TableProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export interface TableCellProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableHeadProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}