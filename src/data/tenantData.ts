import { Tenant, User, UserTenant } from '../types';

// Sample tenants
export const sampleTenants: Tenant[] = [
  {
    id: 'acme-corp',
    name: 'acme-corp',
    displayName: 'Acme Corporation',
    logo: '🏢',
    subdomain: 'acme',
    plan: 'enterprise',
    status: 'active',
    settings: {
      theme: 'light',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en'
    },
    subscription: {
      planName: 'Enterprise Pro',
      expiryDate: '2025-12-31',
      userLimit: 500,
      storageLimit: 1000
    },
    permissions: ['admin', 'create', 'edit', 'delete', 'view', 'export', 'manage_users'],
    createdAt: '2024-01-15T10:00:00Z',
    lastAccessed: '2025-01-30T15:30:00Z'
  },
  {
    id: 'startup-inc',
    name: 'startup-inc',
    displayName: 'StartupInc',
    logo: '🚀',
    subdomain: 'startup',
    plan: 'pro',
    status: 'active',
    settings: {
      theme: 'dark',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      language: 'en'
    },
    subscription: {
      planName: 'Pro Plan',
      expiryDate: '2025-06-15',
      userLimit: 50,
      storageLimit: 100
    },
    permissions: ['create', 'edit', 'delete', 'view', 'export'],
    createdAt: '2024-03-10T14:20:00Z',
    lastAccessed: '2025-01-29T09:45:00Z'
  },
  {
    id: 'consulting-llc',
    name: 'consulting-llc',
    displayName: 'Global Consulting LLC',
    logo: '💼',
    subdomain: 'consulting',
    plan: 'pro',
    status: 'active',
    settings: {
      theme: 'auto',
      timezone: 'Europe/London',
      currency: 'GBP',
      language: 'en'
    },
    subscription: {
      planName: 'Pro Plan',
      expiryDate: '2025-09-20',
      userLimit: 25,
      storageLimit: 50
    },
    permissions: ['create', 'edit', 'view', 'export'],
    createdAt: '2024-05-22T11:15:00Z',
    lastAccessed: '2025-01-28T16:20:00Z'
  },
  {
    id: 'small-biz',
    name: 'small-biz',
    displayName: 'Small Business Co',
    logo: '🏪',
    subdomain: 'smallbiz',
    plan: 'free',
    status: 'trial',
    settings: {
      theme: 'light',
      timezone: 'America/Chicago',
      currency: 'USD',
      language: 'en'
    },
    subscription: {
      planName: 'Free Trial',
      expiryDate: '2025-02-15',
      userLimit: 5,
      storageLimit: 5
    },
    permissions: ['create', 'edit', 'view'],
    createdAt: '2025-01-15T08:30:00Z',
    lastAccessed: '2025-01-30T12:10:00Z'
  }
];

// Sample user with access to multiple tenants
export const currentUser: User = {
  id: 'user-001',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: '👤',
  tenants: [
    {
      tenant: sampleTenants[0], // Acme Corporation
      role: 'admin',
      permissions: ['admin', 'create', 'edit', 'delete', 'view', 'export', 'manage_users'],
      joinedAt: '2024-01-15T10:00:00Z',
      lastAccessed: '2025-01-30T15:30:00Z',
      isDefault: true
    },
    {
      tenant: sampleTenants[1], // StartupInc
      role: 'manager',
      permissions: ['create', 'edit', 'view', 'export'],
      joinedAt: '2024-03-20T09:15:00Z',
      lastAccessed: '2025-01-29T09:45:00Z',
      isDefault: false
    },
    {
      tenant: sampleTenants[2], // Global Consulting LLC
      role: 'user',
      permissions: ['create', 'edit', 'view'],
      joinedAt: '2024-06-01T14:30:00Z',
      lastAccessed: '2025-01-28T16:20:00Z',
      isDefault: false
    },
    {
      tenant: sampleTenants[3], // Small Business Co
      role: 'owner',
      permissions: ['admin', 'create', 'edit', 'delete', 'view', 'export', 'manage_users'],
      joinedAt: '2025-01-15T08:30:00Z',
      lastAccessed: '2025-01-30T12:10:00Z',
      isDefault: false
    }
  ],
  currentTenantId: 'acme-corp', // Default to Acme Corporation
  preferences: {
    defaultTenant: 'acme-corp',
    theme: 'auto',
    notifications: true
  },
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: '2025-01-30T15:30:00Z'
};

// Helper function to get role color
export const getRoleColor = (role: UserTenant['role']): string => {
  switch (role) {
    case 'owner':
      return '#dc2626'; // red
    case 'admin':
      return '#ea580c'; // orange
    case 'manager':
      return '#ca8a04'; // yellow
    case 'user':
      return '#16a34a'; // green
    case 'viewer':
      return '#6b7280'; // gray
    default:
      return '#6b7280';
  }
};

// Helper function to get plan color
export const getPlanColor = (plan: Tenant['plan']): string => {
  switch (plan) {
    case 'enterprise':
      return '#7c3aed'; // purple
    case 'pro':
      return '#2563eb'; // blue
    case 'free':
      return '#16a34a'; // green
    default:
      return '#6b7280';
  }
};

// Helper function to get status color
export const getStatusColor = (status: Tenant['status']): string => {
  switch (status) {
    case 'active':
      return '#16a34a'; // green
    case 'trial':
      return '#ca8a04'; // yellow
    case 'suspended':
      return '#dc2626'; // red
    default:
      return '#6b7280';
  }
};