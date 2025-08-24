import { WorkitemType, ContactType, Workitem, Contact, Field, Employee, SOP, Department } from '../types';

// Workitem Types
export const workitemTypes: WorkitemType[] = [
  { id: '1', name: 'Lead', color: '#3b82f6', icon: 'star', fields: ['name', 'phone', 'email', 'source'] },
  { id: '2', name: 'Complaint', color: '#ef4444', icon: 'alert', fields: ['name', 'phone', 'issue', 'priority'] },
  { id: '3', name: 'Request', color: '#10b981', icon: 'help', fields: ['name', 'phone', 'request_type', 'description'] },
  { id: '4', name: 'Inquiry', color: '#f59e0b', icon: 'info', fields: ['name', 'phone', 'subject', 'details'] }
];

// Contact Types
export const contactTypes: ContactType[] = [
  { id: '1', name: 'Citizen', color: '#3b82f6', fields: ['name', 'phone', 'email', 'address'] },
  { id: '2', name: 'Business', color: '#10b981', fields: ['company_name', 'contact_person', 'phone', 'email'] },
  { id: '3', name: 'Vendor', color: '#f59e0b', fields: ['company_name', 'service_type', 'contact_person', 'phone'] },
  { id: '4', name: 'Partner', color: '#8b5cf6', fields: ['organization', 'representative', 'phone', 'email'] }
];

// Sample Workitems
export const sampleWorkitems: Workitem[] = [
  {
    id: '1',
    type: 'Lead',
    title: 'New Business Inquiry - Tech Solutions',
    description: 'Interested in digital transformation services for their manufacturing unit',
    status: 'Open',
    priority: 'High',
    assignee: 'John Smith',
    department: 'Sales',
    dueDate: '2024-02-15',
    tags: ['enterprise', 'manufacturing'],
    location: 'Mumbai',
    contact: 'Rajesh Kumar',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    typeFields: {
      name: 'Rajesh Kumar',
      phone: '+91-98765-43210',
      email: 'rajesh.kumar@email.com',
      source: 'Website Form',
      company: 'Manufacturing Corp',
      budget: '$50,000 - $100,000',
      timeline: 'Q2 2024'
    }
  },
  {
    id: '2',
    type: 'Complaint',
    title: 'Service Quality Issues',
    description: 'Customer reporting delayed response times and poor service quality',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Sarah Johnson',
    department: 'Support',
    dueDate: '2024-02-10',
    tags: ['urgent', 'quality'],
    location: 'Delhi',
    contact: 'Priya Sharma',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
    typeFields: {
      name: 'Priya Sharma',
      phone: '+91-87654-32109',
      issue: 'Delayed Response Times',
      category: 'Service Quality',
      severity: 'High',
      affectedServices: ['Customer Support', 'Technical Help'],
      reportedBy: 'Direct Customer Call'
    }
  },
  {
    id: '3',
    type: 'Request',
    title: 'Feature Enhancement Request',
    description: 'Request for adding mobile app functionality to existing platform',
    status: 'Closed',
    priority: 'Medium',
    assignee: 'Mike Davis',
    department: 'Product',
    dueDate: '2024-02-20',
    tags: ['enhancement', 'mobile'],
    location: 'Bangalore',
    contact: 'Amit Patel',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
    typeFields: {
      name: 'Amit Patel',
      phone: '+91-76543-21098',
      request_type: 'Feature Enhancement',
      platform: 'Mobile App',
      justification: 'Improve user accessibility',
      expectedBenefit: 'Increased user engagement by 30%',
      requestedBy: 'Product Team'
    }
  },
  {
    id: '4',
    type: 'Inquiry',
    title: 'Product Information Request',
    description: 'Customer inquiring about enterprise pricing and features',
    status: 'Open',
    priority: 'Low',
    assignee: 'Maria Garcia',
    department: 'Sales',
    dueDate: '2024-02-25',
    tags: ['pricing', 'enterprise'],
    location: 'Chennai',
    contact: 'Suresh Reddy',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-23',
    typeFields: {
      name: 'Suresh Reddy',
      phone: '+91-99887-76543',
      subject: 'Enterprise Pricing',
      details: 'Looking for bulk licensing options for 500+ users',
      industry: 'Financial Services',
      currentSolution: 'Legacy System',
      timeframe: '6 months'
    }
  }
];

// Sample Contacts
export const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    type: 'Citizen',
    phone: '+91-98765-43210',
    email: 'rajesh.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    lastContact: '2 days ago',
    tags: ['enterprise', 'priority']
  },
  {
    id: '2',
    name: 'Priya Sharma',
    type: 'Business',
    phone: '+91-87654-32109',
    email: 'priya@techcorp.com',
    location: 'Delhi, NCR',
    status: 'Active',
    lastContact: '1 day ago',
    tags: ['business', 'tech']
  },
  {
    id: '3',
    name: 'Amit Patel',
    type: 'Vendor',
    phone: '+91-76543-21098',
    email: 'amit.patel@vendor.com',
    location: 'Bangalore, Karnataka',
    status: 'Inactive',
    lastContact: '1 week ago',
    tags: ['vendor', 'services']
  }
];

// Fields Configuration
export const fields: Field[] = [
  { id: '1', name: 'Full Name', type: 'text', required: true, appliesTo: 'workitem', workitemTypes: ['Lead', 'Complaint', 'Request', 'Inquiry'] },
  { id: '2', name: 'Phone Number', type: 'phone', required: true, appliesTo: 'workitem', workitemTypes: ['Lead', 'Complaint', 'Request', 'Inquiry'] },
  { id: '3', name: 'Email Address', type: 'email', required: false, appliesTo: 'workitem', workitemTypes: ['Lead', 'Request'] },
  { id: '4', name: 'Priority Level', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Critical'], appliesTo: 'workitem', workitemTypes: ['Complaint', 'Request'] },
  { id: '5', name: 'Company Name', type: 'text', required: true, appliesTo: 'contact', contactTypes: ['Business', 'Vendor', 'Partner'] },
  { id: '6', name: 'Contact Person', type: 'text', required: true, appliesTo: 'contact', contactTypes: ['Business', 'Vendor', 'Partner'] },
  { id: '7', name: 'Address', type: 'textarea', required: true, appliesTo: 'contact', contactTypes: ['Citizen', 'Business'] }
];

// Sample Employees
// Sample Departments
export const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Sales',
    description: 'Responsible for lead generation, client acquisition, and revenue growth',
    head: '1',
    memberCount: 3,
    color: '#3b82f6',
    createdAt: '2023-01-01'
  },
  {
    id: 'dept-2', 
    name: 'Support',
    description: 'Customer service, technical support, and issue resolution',
    head: '2',
    memberCount: 4,
    color: '#10b981',
    createdAt: '2023-01-01'
  },
  {
    id: 'dept-3',
    name: 'Product',
    description: 'Product development, feature planning, and roadmap management',
    head: '3',
    memberCount: 2,
    color: '#f59e0b',
    createdAt: '2023-01-01'
  },
  {
    id: 'dept-4',
    name: 'Engineering',
    description: 'Software development, system architecture, and technical implementation',
    head: '4',
    memberCount: 6,
    color: '#8b5cf6',
    createdAt: '2023-01-01'
  },
  {
    id: 'dept-5',
    name: 'Marketing',
    description: 'Brand management, digital marketing, and growth strategies',
    head: '5',
    memberCount: 3,
    color: '#ef4444',
    createdAt: '2023-01-01'
  },
  {
    id: 'dept-6',
    name: 'HR',
    description: 'Human resources, recruitment, and employee relations',
    head: '6',
    memberCount: 2,
    color: '#14b8a6',
    createdAt: '2023-01-01'
  }
];

export const employees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    department: 'Sales',
    role: 'Sales Manager',
    accessLevel: 'admin',
    permissions: {
      workitems: 'admin',
      contacts: 'admin', 
      workflows: 'write',
      settings: 'read',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-01-15',
    lastActive: '2024-08-24'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0102',
    department: 'Support',
    role: 'Support Manager',
    accessLevel: 'admin',
    permissions: {
      workitems: 'admin',
      contacts: 'admin',
      workflows: 'write',
      settings: 'write',
      team: 'write'
    },
    status: 'Active',
    joinDate: '2023-03-20',
    lastActive: '2024-08-24'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    phone: '+1-555-0103',
    department: 'Product',
    role: 'Product Manager',
    accessLevel: 'admin',
    permissions: {
      workitems: 'admin',
      contacts: 'write',
      workflows: 'admin',
      settings: 'write',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-02-10',
    lastActive: '2024-08-23'
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@company.com',
    phone: '+1-555-0104',
    department: 'Engineering',
    role: 'Engineering Manager',
    accessLevel: 'admin',
    permissions: {
      workitems: 'write',
      contacts: 'read',
      workflows: 'admin',
      settings: 'admin',
      team: 'write'
    },
    status: 'Active',
    joinDate: '2023-01-05',
    lastActive: '2024-08-24'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    phone: '+1-555-0105',
    department: 'Marketing',
    role: 'Marketing Director',
    accessLevel: 'admin',
    permissions: {
      workitems: 'write',
      contacts: 'admin',
      workflows: 'write',
      settings: 'read',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-02-28',
    lastActive: '2024-08-22'
  },
  {
    id: '6',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    phone: '+1-555-0106',
    department: 'HR',
    role: 'HR Director',
    accessLevel: 'admin',
    permissions: {
      workitems: 'read',
      contacts: 'write',
      workflows: 'read',
      settings: 'write',
      team: 'admin'
    },
    status: 'Active',
    joinDate: '2023-01-20',
    lastActive: '2024-08-24'
  },
  {
    id: '7',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    phone: '+1-555-0107',
    department: 'Engineering',
    role: 'Senior Developer',
    accessLevel: 'write',
    permissions: {
      workitems: 'write',
      contacts: 'read',
      workflows: 'write',
      settings: 'read',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-03-15',
    lastActive: '2024-08-23'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    phone: '+1-555-0108',
    department: 'Sales',
    role: 'Sales Representative',
    accessLevel: 'write',
    permissions: {
      workitems: 'write',
      contacts: 'write',
      workflows: 'read',
      settings: 'read',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-04-10',
    lastActive: '2024-08-24'
  },
  {
    id: '9',
    name: 'James Brown',
    email: 'james.brown@company.com',
    phone: '+1-555-0109',
    department: 'Support',
    role: 'Support Specialist',
    accessLevel: 'write',
    permissions: {
      workitems: 'write',
      contacts: 'write',
      workflows: 'read',
      settings: 'read',
      team: 'read'
    },
    status: 'Active',
    joinDate: '2023-05-01',
    lastActive: '2024-08-23'
  },
  {
    id: '10',
    name: 'Anna Kumar',
    email: 'anna.kumar@company.com',
    phone: '+1-555-0110',
    department: 'Marketing',
    role: 'Digital Marketing Specialist',
    accessLevel: 'read',
    permissions: {
      workitems: 'read',
      contacts: 'read',
      workflows: 'read',
      settings: 'read',
      team: 'read'
    },
    status: 'Inactive',
    joinDate: '2023-06-15',
    lastActive: '2024-08-15'
  }
];


// Sample SOPs
export const sops: SOP[] = [
  {
    id: 'sop_1',
    name: 'High Priority Lead Processing',
    description: 'Standard procedure for handling high-priority leads from enterprise clients',
    appliesTo: 'workitem',
    conditions: [
      { field: 'type', operator: 'equals', value: 'Lead' },
      { field: 'priority', operator: 'equals', value: 'High' },
      { field: 'tags', operator: 'contains', value: 'enterprise' }
    ],
    steps: [
      {
        id: 'step_1',
        name: 'Initial Contact',
        description: 'Make first contact within 2 hours of lead creation',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 30,
        assigneeType: 'role',
        assignee: 'Sales Manager',
        checklist: [
          'Call the lead using provided phone number',
          'Introduce company and services',
          'Schedule a detailed discussion',
          'Update lead status to "Contacted"'
        ]
      },
      {
        id: 'step_2',
        name: 'Needs Assessment',
        description: 'Conduct detailed needs analysis and requirement gathering',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 60,
        assigneeType: 'role',
        assignee: 'Sales Manager',
        prerequisites: ['step_1'],
        checklist: [
          'Conduct needs assessment call',
          'Document client requirements',
          'Identify decision makers',
          'Assess budget and timeline'
        ]
      },
      {
        id: 'step_3',
        name: 'Proposal Approval',
        description: 'Get proposal approved by senior management',
        type: 'approval',
        mandatory: true,
        estimatedDuration: 120,
        assigneeType: 'role',
        assignee: 'Regional Director',
        prerequisites: ['step_2']
      },
      {
        id: 'step_4',
        name: 'Proposal Delivery',
        description: 'Send detailed proposal to the client',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 45,
        assigneeType: 'role',
        assignee: 'Sales Manager',
        prerequisites: ['step_3'],
        checklist: [
          'Prepare customized proposal document',
          'Email proposal with cover letter',
          'Schedule follow-up call',
          'Set reminder for proposal review'
        ]
      },
      {
        id: 'step_5',
        name: 'Follow-up Automation',
        description: 'Automated follow-up sequence',
        type: 'automated',
        mandatory: false,
        estimatedDuration: 5,
        assigneeType: 'auto',
        prerequisites: ['step_4'],
        automationConfig: {
          action: 'schedule_followup_sequence',
          parameters: {
            sequence: ['3_day_followup', '1_week_followup', '2_week_followup'],
            medium: 'email_and_phone'
          }
        }
      },
      {
        id: 'step_6',
        name: 'Deal Closure',
        description: 'Finalize the deal and transition to onboarding',
        type: 'manual',
        mandatory: false,
        estimatedDuration: 90,
        assigneeType: 'role',
        assignee: 'Sales Manager',
        prerequisites: ['step_4'],
        checklist: [
          'Negotiate final terms',
          'Prepare contract documents',
          'Get client signatures',
          'Initiate onboarding process'
        ]
      }
    ],
    status: 'active',
    version: '1.2',
    createdBy: 'Admin',
    createdAt: '2024-01-01',
    lastModified: '2024-01-15',
    tags: ['sales', 'enterprise', 'high-priority']
  },
  {
    id: 'sop_2',
    name: 'Customer Onboarding Process',
    description: 'Comprehensive onboarding workflow for new customers',
    appliesTo: 'contact',
    conditions: [
      { field: 'type', operator: 'equals', value: 'Business' },
      { field: 'status', operator: 'equals', value: 'Active' }
    ],
    steps: [
      {
        id: 'onboard_1',
        name: 'Welcome Package',
        description: 'Send welcome package and initial setup instructions',
        type: 'automated',
        mandatory: true,
        estimatedDuration: 10,
        assigneeType: 'auto',
        automationConfig: {
          action: 'send_welcome_package',
          parameters: {
            template: 'business_welcome',
            attachments: ['setup_guide', 'contact_directory']
          }
        }
      },
      {
        id: 'onboard_2',
        name: 'Account Setup Call',
        description: 'Conduct account setup and platform walkthrough',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 45,
        assigneeType: 'role',
        assignee: 'Customer Success Manager',
        prerequisites: ['onboard_1'],
        checklist: [
          'Walk through platform features',
          'Configure initial settings',
          'Import customer data',
          'Set up integrations'
        ]
      },
      {
        id: 'onboard_3',
        name: 'Training Session',
        description: 'Provide comprehensive platform training',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 90,
        assigneeType: 'role',
        assignee: 'Training Specialist',
        prerequisites: ['onboard_2'],
        checklist: [
          'Conduct live training session',
          'Provide training materials',
          'Address questions and concerns',
          'Schedule follow-up training if needed'
        ]
      },
      {
        id: 'onboard_4',
        name: '30-Day Check-in',
        description: 'Follow up after 30 days to ensure satisfaction',
        type: 'automated',
        mandatory: false,
        estimatedDuration: 5,
        assigneeType: 'auto',
        prerequisites: ['onboard_3'],
        automationConfig: {
          action: 'schedule_checkin',
          parameters: {
            delay_days: 30,
            type: 'satisfaction_survey',
            follow_up_required: true
          }
        }
      }
    ],
    status: 'active',
    version: '1.0',
    createdBy: 'Customer Success',
    createdAt: '2024-01-10',
    lastModified: '2024-01-20',
    tags: ['onboarding', 'customer-success']
  },
  {
    id: 'sop_3',
    name: 'Critical Issue Resolution',
    description: 'Escalation procedure for critical complaints and issues',
    appliesTo: 'workitem',
    conditions: [
      { field: 'type', operator: 'equals', value: 'Complaint' },
      { field: 'priority', operator: 'equals', value: 'Critical' }
    ],
    steps: [
      {
        id: 'critical_1',
        name: 'Immediate Acknowledgment',
        description: 'Acknowledge receipt within 15 minutes',
        type: 'automated',
        mandatory: true,
        estimatedDuration: 2,
        assigneeType: 'auto',
        automationConfig: {
          action: 'send_acknowledgment',
          parameters: {
            template: 'critical_issue_ack',
            sla_minutes: 15
          }
        }
      },
      {
        id: 'critical_2',
        name: 'Senior Manager Notification',
        description: 'Notify senior management immediately',
        type: 'automated',
        mandatory: true,
        estimatedDuration: 1,
        assigneeType: 'role',
        assignee: 'Support Manager',
        prerequisites: ['critical_1'],
        automationConfig: {
          action: 'escalate_notification',
          parameters: {
            recipients: ['Support Manager', 'Operations Director'],
            urgency: 'high'
          }
        }
      },
      {
        id: 'critical_3',
        name: 'Initial Investigation',
        description: 'Begin immediate investigation and impact assessment',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 30,
        assigneeType: 'role',
        assignee: 'Senior Support Specialist',
        prerequisites: ['critical_2'],
        checklist: [
          'Contact customer directly',
          'Assess impact and severity',
          'Identify root cause',
          'Document initial findings'
        ]
      },
      {
        id: 'critical_4',
        name: 'Resolution Implementation',
        description: 'Implement solution and verify resolution',
        type: 'manual',
        mandatory: true,
        estimatedDuration: 120,
        assigneeType: 'role',
        assignee: 'Technical Lead',
        prerequisites: ['critical_3'],
        checklist: [
          'Implement approved solution',
          'Test resolution thoroughly',
          'Confirm with customer',
          'Document resolution steps'
        ]
      }
    ],
    status: 'active',
    version: '1.1',
    createdBy: 'Support Team',
    createdAt: '2024-01-05',
    lastModified: '2024-01-18',
    tags: ['support', 'critical', 'escalation']
  }
];