import React, { useState } from 'react';
import './App.css';

// Import types
import { Screen, SOP, SOPCondition, Employee, Workitem, Contact } from './types';

// Import data
import { theme } from './data/theme';
import { sops, employees, sampleWorkitems, sampleContacts } from './data/sampleData';

// Import UI components
import { Button, Icon, Modal } from './components/ui';

// Import screen components
import { SettingsScreen } from './components/screens/SettingsScreen';

const App: React.FC = () => {
  // Navigation state
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Data state
  const [sopsState, setSopsState] = useState<SOP[]>(sops);
  const [employeesState] = useState<Employee[]>(employees);
  const [workitems] = useState<Workitem[]>(sampleWorkitems);
  const [contacts] = useState<Contact[]>(sampleContacts);

  // Modal states
  const [showCreateSOP, setShowCreateSOP] = useState(false);
  const [showEditSOP, setShowEditSOP] = useState(false);
  const [showManageSOPSteps, setShowManageSOPSteps] = useState(false);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showCreateWorkitem, setShowCreateWorkitem] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);

  // Selection states
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // SOP Form states
  const [sopFormData, setSopFormData] = useState({
    name: '',
    description: '',
    appliesTo: 'workitem' as 'workitem' | 'contact',
    status: 'draft' as 'active' | 'draft' | 'archived',
    version: '1.0.0',
    tags: '',
    conditions: [] as SOPCondition[]
  });

  // Field options for condition dropdowns
  const getFieldOptions = (appliesTo: 'workitem' | 'contact') => {
    if (appliesTo === 'workitem') {
      return [
        { value: 'type', label: 'Type', valueType: 'select', options: ['Lead', 'Task', 'Issue', 'Request', 'Incident'] },
        { value: 'priority', label: 'Priority', valueType: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        { value: 'status', label: 'Status', valueType: 'select', options: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'] },
        { value: 'department', label: 'Department', valueType: 'select', options: ['Sales', 'Support', 'Marketing', 'Engineering', 'HR', 'Finance'] },
        { value: 'assignee', label: 'Assignee', valueType: 'select', options: employees.map(emp => emp.name) },
        { value: 'title', label: 'Title', valueType: 'text' },
        { value: 'description', label: 'Description', valueType: 'text' },
        { value: 'location', label: 'Location', valueType: 'text' },
        { value: 'tags', label: 'Tags', valueType: 'text' },
        { value: 'dueDate', label: 'Due Date', valueType: 'date' },
        { value: 'createdAt', label: 'Created Date', valueType: 'date' }
      ];
    } else {
      return [
        { value: 'type', label: 'Type', valueType: 'select', options: ['Customer', 'Vendor', 'Partner', 'Lead', 'Prospect'] },
        { value: 'status', label: 'Status', valueType: 'select', options: ['Active', 'Inactive'] },
        { value: 'name', label: 'Name', valueType: 'text' },
        { value: 'email', label: 'Email', valueType: 'text' },
        { value: 'phone', label: 'Phone', valueType: 'text' },
        { value: 'location', label: 'Location', valueType: 'text' },
        { value: 'tags', label: 'Tags', valueType: 'text' },
        { value: 'lastContact', label: 'Last Contact', valueType: 'date' }
      ];
    }
  };

  const navigationItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: 'dashboard' },
    { id: 'workitems' as Screen, label: 'Workitems', icon: 'workitems' },
    { id: 'contacts' as Screen, label: 'Contacts', icon: 'contacts' },
    { id: 'workflows' as Screen, label: 'Workflows', icon: 'workflows' },
    { id: 'analytics' as Screen, label: 'Analytics', icon: 'analytics' }
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'settings':
        return (
          <SettingsScreen
            sops={sopsState}
            setSops={setSopsState}
            employees={employeesState}
            setShowCreateSOP={setShowCreateSOP}
            setShowEditSOP={setShowEditSOP}
            setShowManageSOPSteps={setShowManageSOPSteps}
            setShowConditionBuilder={setShowConditionBuilder}
            setSelectedSOP={setSelectedSOP}
            setShowAddEmployee={setShowAddEmployee}
            setShowEditEmployee={setShowEditEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        );
      case 'dashboard':
      default:
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
                  Welcome to your Griv AI Platform dashboard
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => setShowCreateWorkitem(true)}>
                  <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                  Create Workitem
                </Button>
                <Button onClick={() => setShowCreateContact(true)} variant="outline">
                  <Icon name="plus" size={16} />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Recent Workitems
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {workitems.length} active workitems
                </p>
              </div>

              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Contacts
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {contacts.length} total contacts
                </p>
              </div>

              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Active SOPs
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {sopsState.filter(sop => sop.status === 'active').length} active procedures
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: theme.colors.card,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.warning} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1.25rem',
            color: 'white'
          }}>
            G
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: 0,
            color: theme.colors.foreground
          }}>
            Griv AI Platform
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                border: 'none',
                backgroundColor: activeScreen === item.id ? theme.colors.secondary : 'transparent',
                color: theme.colors.foreground,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
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
              A
            </div>
            <Icon name="chevronDown" size={16} color={theme.colors.mutedForeground} />
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
              boxShadow: theme.shadow.md,
              minWidth: '180px',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem' }}>
                <button
                  onClick={() => {
                    setActiveScreen('settings');
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.foreground,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="settings" size={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    console.log('Logout');
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.foreground,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="logout" size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {renderScreen()}

      {/* Modals */}
      <Modal
        show={showCreateSOP}
        onClose={() => setShowCreateSOP(false)}
        title="Create New SOP"
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              SOP Name *
            </label>
            <input
              type="text"
              placeholder="Enter SOP name"
              value={sopFormData.name}
              onChange={(e) => setSopFormData({ ...sopFormData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
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
              placeholder="Enter SOP description"
              value={sopFormData.description}
              onChange={(e) => setSopFormData({ ...sopFormData, description: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
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
              Applies To *
            </label>
            <select
              value={sopFormData.appliesTo}
              onChange={(e) => setSopFormData({ ...sopFormData, appliesTo: e.target.value as 'workitem' | 'contact' })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="workitem">Workitem</option>
              <option value="contact">Contact</option>
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
              value={sopFormData.status}
              onChange={(e) => setSopFormData({ ...sopFormData, status: e.target.value as 'active' | 'draft' | 'archived' })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
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
              Version
            </label>
            <input
              type="text"
              placeholder="1.0.0"
              value={sopFormData.version}
              onChange={(e) => setSopFormData({ ...sopFormData, version: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
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
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., priority, customer-service, escalation"
              value={sopFormData.tags}
              onChange={(e) => setSopFormData({ ...sopFormData, tags: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Conditions Section */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground
              }}>
                Trigger Conditions ({sopFormData.conditions.length})
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newCondition: SOPCondition = {
                    field: '',
                    operator: 'equals',
                    value: ''
                  };
                  setSopFormData({
                    ...sopFormData,
                    conditions: [...sopFormData.conditions, newCondition]
                  });
                }}
              >
                <Icon name="plus" size={14} />
                Add Condition
              </Button>
            </div>

            <div style={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {sopFormData.conditions.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: theme.colors.mutedForeground,
                  fontSize: '0.875rem'
                }}>
                  No conditions set. This SOP will need to be triggered manually.
                  <br />
                  <span style={{ fontSize: '0.75rem' }}>
                    Add conditions to automatically trigger this SOP when criteria are met.
                  </span>
                </div>
              ) : (
                <div style={{ padding: '1rem' }}>
                  {sopFormData.conditions.map((condition, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 1fr auto',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: index < sopFormData.conditions.length - 1 ? '0.75rem' : '0',
                        padding: '0.75rem',
                        backgroundColor: theme.colors.background,
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      {/* Field */}
                      <select
                        value={condition.field}
                        onChange={(e) => {
                          const updatedConditions = [...sopFormData.conditions];
                          updatedConditions[index] = { ...condition, field: e.target.value, value: '' };
                          setSopFormData({ ...sopFormData, conditions: updatedConditions });
                        }}
                        style={{
                          padding: '0.375rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '4px',
                          backgroundColor: theme.colors.background,
                          color: theme.colors.foreground,
                          fontSize: '0.75rem'
                        }}
                      >
                        <option value="">Select field...</option>
                        {getFieldOptions(sopFormData.appliesTo).map((field) => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>

                      {/* Operator */}
                      <select
                        value={condition.operator}
                        onChange={(e) => {
                          const updatedConditions = [...sopFormData.conditions];
                          updatedConditions[index] = { 
                            ...condition, 
                            operator: e.target.value as SOPCondition['operator']
                          };
                          setSopFormData({ ...sopFormData, conditions: updatedConditions });
                        }}
                        style={{
                          padding: '0.375rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '4px',
                          backgroundColor: theme.colors.background,
                          color: theme.colors.foreground,
                          fontSize: '0.75rem'
                        }}
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">not equals</option>
                        <option value="contains">contains</option>
                        <option value="not_contains">not contains</option>
                        <option value="greater_than">greater than</option>
                        <option value="less_than">less than</option>
                        <option value="in">in</option>
                        <option value="not_in">not in</option>
                      </select>

                      {/* Value */}
                      {(() => {
                        const fieldOption = getFieldOptions(sopFormData.appliesTo).find(f => f.value === condition.field);
                        const isArrayOperator = condition.operator === 'in' || condition.operator === 'not_in';
                        
                        if (fieldOption?.valueType === 'select' && fieldOption.options && !isArrayOperator) {
                          return (
                            <select
                              value={Array.isArray(condition.value) ? '' : condition.value}
                              onChange={(e) => {
                                const updatedConditions = [...sopFormData.conditions];
                                updatedConditions[index] = { ...condition, value: e.target.value };
                                setSopFormData({ ...sopFormData, conditions: updatedConditions });
                              }}
                              style={{
                                padding: '0.375rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem'
                              }}
                            >
                              <option value="">Select value...</option>
                              {fieldOption.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          );
                        } else if (fieldOption?.valueType === 'date') {
                          return (
                            <input
                              type="date"
                              value={Array.isArray(condition.value) ? '' : condition.value}
                              onChange={(e) => {
                                const updatedConditions = [...sopFormData.conditions];
                                const value = isArrayOperator
                                  ? e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                  : e.target.value;
                                updatedConditions[index] = { ...condition, value };
                                setSopFormData({ ...sopFormData, conditions: updatedConditions });
                              }}
                              style={{
                                padding: '0.375rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem'
                              }}
                            />
                          );
                        } else {
                          return (
                            <input
                              type="text"
                              placeholder={isArrayOperator ? "Value1, Value2, Value3" : fieldOption?.valueType === 'select' ? "Value1, Value2, Value3" : "Value"}
                              value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                              onChange={(e) => {
                                const updatedConditions = [...sopFormData.conditions];
                                const value = isArrayOperator
                                  ? e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                  : e.target.value;
                                updatedConditions[index] = { ...condition, value };
                                setSopFormData({ ...sopFormData, conditions: updatedConditions });
                              }}
                              style={{
                                padding: '0.375rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem'
                              }}
                            />
                          );
                        }
                      })()}

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSopFormData({
                            ...sopFormData,
                            conditions: sopFormData.conditions.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        <Icon name="trash" size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {sopFormData.conditions.length > 0 && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: theme.colors.secondary,
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: theme.colors.mutedForeground
              }}>
                <strong>Logic:</strong> All conditions must be met (AND logic). 
                For "in" and "not in" operators, separate values with commas.
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: theme.colors.secondary,
            padding: '1rem',
            borderRadius: '6px'
          }}>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: theme.colors.foreground
            }}>
              Next Steps
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: theme.colors.mutedForeground
            }}>
              After creating the SOP, you'll be able to:
              • Add conditions to trigger this SOP
              • Define workflow steps
              • Set up automation rules
              • Configure approvals
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            paddingTop: '1rem',
            borderTop: `1px solid ${theme.colors.border}`
          }}>
            <Button
              variant="outline"
              onClick={() => setShowCreateSOP(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!sopFormData.name.trim()) {
                  alert('Please enter a SOP name');
                  return;
                }
                const newSOP: SOP = {
                  id: `sop-${Date.now()}`,
                  name: sopFormData.name,
                  description: sopFormData.description,
                  appliesTo: sopFormData.appliesTo,
                  conditions: sopFormData.conditions,
                  steps: [],
                  status: sopFormData.status,
                  version: sopFormData.version,
                  createdBy: 'Admin',
                  createdAt: new Date().toISOString(),
                  lastModified: new Date().toISOString(),
                  tags: sopFormData.tags ? sopFormData.tags.split(',').map(t => t.trim()) : []
                };
                setSopsState([...sopsState, newSOP]);
                setSopFormData({
                  name: '',
                  description: '',
                  appliesTo: 'workitem',
                  status: 'draft',
                  version: '1.0.0',
                  tags: '',
                  conditions: []
                });
                setShowCreateSOP(false);
              }}
            >
              Create SOP
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showEditSOP}
        onClose={() => setShowEditSOP(false)}
        title="Edit SOP"
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {selectedSOP && (
            <>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  SOP Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter SOP name"
                  defaultValue={selectedSOP.name}
                  onChange={(e) => setSelectedSOP({ ...selectedSOP, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
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
                  placeholder="Enter SOP description"
                  defaultValue={selectedSOP.description}
                  onChange={(e) => setSelectedSOP({ ...selectedSOP, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
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
                  Applies To *
                </label>
                <select
                  defaultValue={selectedSOP.appliesTo}
                  onChange={(e) => setSelectedSOP({ ...selectedSOP, appliesTo: e.target.value as 'workitem' | 'contact' })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="workitem">Workitem</option>
                  <option value="contact">Contact</option>
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
                  defaultValue={selectedSOP.status}
                  onChange={(e) => setSelectedSOP({ ...selectedSOP, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
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
                  Version
                </label>
                <input
                  type="text"
                  placeholder="1.0.0"
                  defaultValue={selectedSOP.version}
                  onChange={(e) => setSelectedSOP({ ...selectedSOP, version: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
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
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., priority, customer-service, escalation"
                  defaultValue={selectedSOP.tags?.join(', ')}
                  onChange={(e) => setSelectedSOP({ 
                    ...selectedSOP, 
                    tags: e.target.value ? e.target.value.split(',').map(t => t.trim()) : [] 
                  })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Conditions Section for Edit */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.foreground
                  }}>
                    Trigger Conditions ({selectedSOP.conditions.length})
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newCondition: SOPCondition = {
                        field: '',
                        operator: 'equals',
                        value: ''
                      };
                      setSelectedSOP({
                        ...selectedSOP,
                        conditions: [...selectedSOP.conditions, newCondition]
                      });
                    }}
                  >
                    <Icon name="plus" size={14} />
                    Add Condition
                  </Button>
                </div>

                <div style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {selectedSOP.conditions.length === 0 ? (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: theme.colors.mutedForeground,
                      fontSize: '0.875rem'
                    }}>
                      No conditions set. This SOP will need to be triggered manually.
                    </div>
                  ) : (
                    <div style={{ padding: '1rem' }}>
                      {selectedSOP.conditions.map((condition, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 120px 1fr auto',
                            gap: '0.5rem',
                            alignItems: 'center',
                            marginBottom: index < selectedSOP.conditions.length - 1 ? '0.75rem' : '0',
                            padding: '0.75rem',
                            backgroundColor: theme.colors.background,
                            borderRadius: '4px',
                            border: `1px solid ${theme.colors.border}`
                          }}
                        >
                          <select
                            value={condition.field}
                            onChange={(e) => {
                              const updatedConditions = [...selectedSOP.conditions];
                              updatedConditions[index] = { ...condition, field: e.target.value, value: '' };
                              setSelectedSOP({ ...selectedSOP, conditions: updatedConditions });
                            }}
                            style={{
                              padding: '0.375rem',
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '4px',
                              backgroundColor: theme.colors.background,
                              color: theme.colors.foreground,
                              fontSize: '0.75rem'
                            }}
                          >
                            <option value="">Select field...</option>
                            {getFieldOptions(selectedSOP.appliesTo).map((field) => (
                              <option key={field.value} value={field.value}>
                                {field.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={condition.operator}
                            onChange={(e) => {
                              const updatedConditions = [...selectedSOP.conditions];
                              updatedConditions[index] = { 
                                ...condition, 
                                operator: e.target.value as SOPCondition['operator']
                              };
                              setSelectedSOP({ ...selectedSOP, conditions: updatedConditions });
                            }}
                            style={{
                              padding: '0.375rem',
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '4px',
                              backgroundColor: theme.colors.background,
                              color: theme.colors.foreground,
                              fontSize: '0.75rem'
                            }}
                          >
                            <option value="equals">equals</option>
                            <option value="not_equals">not equals</option>
                            <option value="contains">contains</option>
                            <option value="not_contains">not contains</option>
                            <option value="greater_than">greater than</option>
                            <option value="less_than">less than</option>
                            <option value="in">in</option>
                            <option value="not_in">not in</option>
                          </select>

                          {(() => {
                            const fieldOption = getFieldOptions(selectedSOP.appliesTo).find(f => f.value === condition.field);
                            const isArrayOperator = condition.operator === 'in' || condition.operator === 'not_in';
                            
                            if (fieldOption?.valueType === 'select' && fieldOption.options && !isArrayOperator) {
                              return (
                                <select
                                  value={Array.isArray(condition.value) ? '' : condition.value}
                                  onChange={(e) => {
                                    const updatedConditions = [...selectedSOP.conditions];
                                    updatedConditions[index] = { ...condition, value: e.target.value };
                                    setSelectedSOP({ ...selectedSOP, conditions: updatedConditions });
                                  }}
                                  style={{
                                    padding: '0.375rem',
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.foreground,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <option value="">Select value...</option>
                                  {fieldOption.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              );
                            } else if (fieldOption?.valueType === 'date') {
                              return (
                                <input
                                  type="date"
                                  value={Array.isArray(condition.value) ? '' : condition.value}
                                  onChange={(e) => {
                                    const updatedConditions = [...selectedSOP.conditions];
                                    const value = isArrayOperator
                                      ? e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                      : e.target.value;
                                    updatedConditions[index] = { ...condition, value };
                                    setSelectedSOP({ ...selectedSOP, conditions: updatedConditions });
                                  }}
                                  style={{
                                    padding: '0.375rem',
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.foreground,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              );
                            } else {
                              return (
                                <input
                                  type="text"
                                  placeholder={isArrayOperator ? "Value1, Value2, Value3" : fieldOption?.valueType === 'select' ? "Value1, Value2, Value3" : "Value"}
                                  value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                                  onChange={(e) => {
                                    const updatedConditions = [...selectedSOP.conditions];
                                    const value = isArrayOperator
                                      ? e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                      : e.target.value;
                                    updatedConditions[index] = { ...condition, value };
                                    setSelectedSOP({ ...selectedSOP, conditions: updatedConditions });
                                  }}
                                  style={{
                                    padding: '0.375rem',
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.foreground,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              );
                            }
                          })()}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSOP({
                                ...selectedSOP,
                                conditions: selectedSOP.conditions.filter((_, i) => i !== index)
                              });
                            }}
                          >
                            <Icon name="trash" size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                backgroundColor: theme.colors.secondary,
                padding: '1rem',
                borderRadius: '6px'
              }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  SOP Information
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: theme.colors.mutedForeground
                }}>
                  • {selectedSOP.steps.length} steps configured<br/>
                  • {selectedSOP.conditions.length} conditions set<br/>
                  • Created: {new Date(selectedSOP.createdAt).toLocaleDateString()}<br/>
                  • Last modified: {new Date(selectedSOP.lastModified).toLocaleDateString()}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: `1px solid ${theme.colors.border}`
              }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSOP(null);
                    setShowEditSOP(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedSOP && selectedSOP.name.trim()) {
                      setSopsState(sopsState.map(sop => 
                        sop.id === selectedSOP.id 
                          ? { ...selectedSOP, lastModified: new Date().toISOString() }
                          : sop
                      ));
                      setSelectedSOP(null);
                      setShowEditSOP(false);
                    } else {
                      alert('Please enter a SOP name');
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        show={showManageSOPSteps}
        onClose={() => setShowManageSOPSteps(false)}
        title={`Manage Steps - ${selectedSOP?.name || ''}`}
        size="xl"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {selectedSOP && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  Workflow Steps ({selectedSOP.steps.length})
                </h4>
                <Button
                  onClick={() => {
                    const newStep = {
                      id: `step-${Date.now()}`,
                      name: 'New Step',
                      description: 'Step description',
                      type: 'manual' as const,
                      mandatory: false,
                      estimatedDuration: 30,
                      assigneeType: 'auto' as const
                    };
                    setSelectedSOP({
                      ...selectedSOP,
                      steps: [...selectedSOP.steps, newStep]
                    });
                  }}
                >
                  <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                  Add Step
                </Button>
              </div>

              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '1rem'
              }}>
                {selectedSOP.steps.length === 0 ? (
                  <p style={{
                    textAlign: 'center',
                    color: theme.colors.mutedForeground,
                    margin: '2rem 0'
                  }}>
                    No steps configured. Click "Add Step" to create your first workflow step.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {selectedSOP.steps.map((step, index) => (
                      <div
                        key={step.id}
                        style={{
                          padding: '1rem',
                          backgroundColor: theme.colors.secondary,
                          borderRadius: '6px',
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.primaryForeground,
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                {index + 1}
                              </span>
                              <input
                                type="text"
                                value={step.name}
                                onChange={(e) => {
                                  const updatedSteps = [...selectedSOP.steps];
                                  updatedSteps[index] = { ...step, name: e.target.value };
                                  setSelectedSOP({ ...selectedSOP, steps: updatedSteps });
                                }}
                                style={{
                                  flex: 1,
                                  padding: '0.25rem 0.5rem',
                                  border: `1px solid ${theme.colors.border}`,
                                  borderRadius: '4px',
                                  backgroundColor: theme.colors.background,
                                  color: theme.colors.foreground,
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}
                              />
                            </div>
                            <textarea
                              value={step.description}
                              onChange={(e) => {
                                const updatedSteps = [...selectedSOP.steps];
                                updatedSteps[index] = { ...step, description: e.target.value };
                                setSelectedSOP({ ...selectedSOP, steps: updatedSteps });
                              }}
                              rows={2}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem',
                                resize: 'vertical'
                              }}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSOP({
                                ...selectedSOP,
                                steps: selectedSOP.steps.filter(s => s.id !== step.id)
                              });
                            }}
                          >
                            <Icon name="trash" size={14} />
                          </Button>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '0.5rem',
                          fontSize: '0.75rem'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>
                              Type
                            </label>
                            <select
                              value={step.type}
                              onChange={(e) => {
                                const updatedSteps = [...selectedSOP.steps];
                                updatedSteps[index] = { ...step, type: e.target.value as 'manual' | 'automated' | 'approval' };
                                setSelectedSOP({ ...selectedSOP, steps: updatedSteps });
                              }}
                              style={{
                                width: '100%',
                                padding: '0.25rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem'
                              }}
                            >
                              <option value="manual">Manual</option>
                              <option value="automated">Automated</option>
                              <option value="approval">Approval</option>
                            </select>
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>
                              Duration (min)
                            </label>
                            <input
                              type="number"
                              value={step.estimatedDuration}
                              onChange={(e) => {
                                const updatedSteps = [...selectedSOP.steps];
                                updatedSteps[index] = { ...step, estimatedDuration: parseInt(e.target.value) || 0 };
                                setSelectedSOP({ ...selectedSOP, steps: updatedSteps });
                              }}
                              style={{
                                width: '100%',
                                padding: '0.25rem',
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.colors.background,
                                color: theme.colors.foreground,
                                fontSize: '0.75rem'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontWeight: '500',
                              marginBottom: '0.25rem'
                            }}>
                              <input
                                type="checkbox"
                                checked={step.mandatory}
                                onChange={(e) => {
                                  const updatedSteps = [...selectedSOP.steps];
                                  updatedSteps[index] = { ...step, mandatory: e.target.checked };
                                  setSelectedSOP({ ...selectedSOP, steps: updatedSteps });
                                }}
                              />
                              Mandatory
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: `1px solid ${theme.colors.border}`
              }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowManageSOPSteps(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedSOP) {
                      setSopsState(sopsState.map(sop => 
                        sop.id === selectedSOP.id 
                          ? { ...selectedSOP, lastModified: new Date().toISOString() }
                          : sop
                      ));
                      setShowManageSOPSteps(false);
                    }
                  }}
                >
                  Save Steps
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        show={showCreateWorkitem}
        onClose={() => setShowCreateWorkitem(false)}
        title="Create New Workitem"
        size="lg"
      >
        <div>
          <p>Workitem creation form would go here...</p>
        </div>
      </Modal>

      <Modal
        show={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        title="Add New Contact"
        size="lg"
      >
        <div>
          <p>Contact creation form would go here...</p>
        </div>
      </Modal>
    </div>
  );
};

export default App;