import React, { useState } from 'react';
import { SettingsTab, SOP, Employee, Department } from '../../types';
import { Icon, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui';
import { SOPConfiguration } from '../settings/SOPConfiguration';
import { GeneralSettings } from '../settings/GeneralSettings';
import { FieldConfiguration } from '../settings/FieldConfiguration';
import { theme } from '../../data/theme';

interface SettingsScreenProps {
  sops: SOP[];
  setSops: React.Dispatch<React.SetStateAction<SOP[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  setShowCreateSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowManageSOPSteps: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBuilder: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSOP: React.Dispatch<React.SetStateAction<SOP | null>>;
  setShowAddEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  setShowAddDepartment: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditDepartment: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<Department | null>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  sops,
  setSops,
  employees,
  setEmployees,
  departments,
  setDepartments,
  setShowCreateSOP,
  setShowEditSOP,
  setShowManageSOPSteps,
  setShowConditionBuilder,
  setSelectedSOP,
  setShowAddEmployee,
  setShowEditEmployee,
  setSelectedEmployee,
  setShowAddDepartment,
  setShowEditDepartment,
  setSelectedDepartment
}) => {
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [selectedSOPType, setSelectedSOPType] = useState<'workitem' | 'contact'>('workitem');
  const [teamView, setTeamView] = useState<'employees' | 'departments'>('employees');

  const settingsTabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: 'settings' },
    { id: 'fields' as SettingsTab, label: 'Field Configuration', icon: 'fields' },
    { id: 'workflows' as SettingsTab, label: 'Workflows', icon: 'workflows' },
    { id: 'sops' as SettingsTab, label: 'SOPs', icon: 'checklist' },
    { id: 'team' as SettingsTab, label: 'Team Management', icon: 'team' },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: 'integration' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'bell' },
    { id: 'security' as SettingsTab, label: 'Security', icon: 'shield' },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: 'star' }
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
            <GeneralSettings />
          )}

          {settingsTab === 'fields' && (
            <FieldConfiguration />
          )}

          {settingsTab === 'workflows' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 0.5rem 0'
                }}>
                  Automated Workflows
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: '0 0 2rem 0'
                }}>
                  Configure automated processes that the platform executes based on triggers and conditions
                </p>
              </div>

              {/* Workflow Templates */}
              <div style={{
                backgroundColor: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '1.25rem',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    Workflow Templates
                  </h4>
                  <Button size="sm">
                    <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                    Create Workflow
                  </Button>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <Icon name="workflows" size={48} color={theme.colors.mutedForeground} />
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: '1rem 0 0.5rem 0'
                  }}>
                    No Workflows Created
                  </h4>
                  <p style={{
                    color: theme.colors.mutedForeground,
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.5'
                  }}>
                    Create automated workflows to handle routine tasks like status updates, notifications, 
                    assignments, and integrations.
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    {[
                      { name: 'Auto-Assignment', desc: 'Automatically assign workitems based on criteria' },
                      { name: 'Status Updates', desc: 'Update workitem status based on conditions' },
                      { name: 'Notifications', desc: 'Send alerts when specific events occur' },
                      { name: 'Escalation', desc: 'Escalate overdue or critical items' }
                    ].map((template, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        backgroundColor: theme.colors.background,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.primary;
                        e.currentTarget.style.backgroundColor = theme.colors.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = theme.colors.border;
                        e.currentTarget.style.backgroundColor = theme.colors.background;
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: theme.colors.foreground,
                          marginBottom: '0.5rem'
                        }}>
                          {template.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground,
                          lineHeight: '1.3'
                        }}>
                          {template.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'sops' && (
            <SOPConfiguration
              sops={sops}
              setSops={setSops}
              selectedSOPType={selectedSOPType}
              setSelectedSOPType={setSelectedSOPType}
              setShowCreateSOP={setShowCreateSOP}
              setShowEditSOP={setShowEditSOP}
              setShowManageSOPSteps={setShowManageSOPSteps}
              setSelectedSOP={setSelectedSOP}
            />
          )}

          {settingsTab === 'team' && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Team Management Header */}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 0.5rem 0'
                }}>
                  Team Management
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Manage employees, departments, roles, and access permissions across your organization
                </p>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Icon name="team" size={24} color={theme.colors.primary} />
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Total Employees
                    </h4>
                  </div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {employees.filter(emp => emp.status === 'Active').length}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground,
                    margin: '0.25rem 0 0 0'
                  }}>
                    {employees.filter(emp => emp.status === 'Inactive').length} inactive
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Icon name="building" size={24} color={theme.colors.success} />
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Departments
                    </h4>
                  </div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {departments.length}
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: theme.colors.secondary,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Icon name="shield" size={24} color={theme.colors.warning} />
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      Admin Users
                    </h4>
                  </div>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {employees.filter(emp => emp.accessLevel === 'admin').length}
                  </p>
                </div>
              </div>

              {/* Section Tabs */}
              <div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <Button
                    variant={teamView === 'employees' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTeamView('employees')}
                    style={teamView === 'employees' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground
                    } : {}}
                  >
                    Employees
                  </Button>
                  <Button
                    variant={teamView === 'departments' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTeamView('departments')}
                    style={teamView === 'departments' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground
                    } : {}}
                  >
                    Departments
                  </Button>
                </div>

                {/* Dynamic Section Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: theme.colors.foreground,
                      margin: 0
                    }}>
                      {teamView === 'employees' ? `Team Members (${employees.length})` : `Departments (${departments.length})`}
                    </h4>
                    <p style={{
                      color: theme.colors.mutedForeground,
                      margin: '0.25rem 0 0 0',
                      fontSize: '0.875rem'
                    }}>
                      {teamView === 'employees' ? 'Manage employee access levels and permissions' : 'Manage organizational departments and structure'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {teamView === 'employees' ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddDepartment(true)}
                        >
                          <Icon name="building" size={16} />
                          Add Department
                        </Button>
                        <Button onClick={() => setShowAddEmployee(true)}>
                          <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                          Add Employee
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setShowAddDepartment(true)}>
                        <Icon name="building" size={16} color={theme.colors.primaryForeground} />
                        Add Department
                      </Button>
                    )}
                  </div>
                </div>

                {/* Dynamic Table Content */}
                <div style={{
                  backgroundColor: theme.colors.card,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.border}`,
                  overflow: 'hidden'
                }}>
                  {teamView === 'employees' ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Access Level</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => {
                          const department = departments.find(d => d.name === employee.department);
                          return (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem'
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: employee.accessLevel === 'admin' ? theme.colors.primary : 
                                                   employee.accessLevel === 'write' ? theme.colors.warning :
                                                   theme.colors.secondary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: employee.accessLevel === 'read' ? theme.colors.foreground : theme.colors.primaryForeground,
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                  }}>
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{
                                      fontWeight: '500',
                                      fontSize: '0.875rem'
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: department?.color || theme.colors.mutedForeground
                                  }}></div>
                                  {employee.department}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '0.875rem' }}>
                                  {employee.role}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  employee.accessLevel === 'admin' ? 'destructive' :
                                  employee.accessLevel === 'write' ? 'success' :
                                  'secondary'
                                }>
                                  {employee.accessLevel.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div style={{
                                  display: 'flex',
                                  gap: '0.25rem',
                                  flexWrap: 'wrap'
                                }}>
                                  {Object.entries(employee.permissions).slice(0, 3).map(([key, value]) => (
                                    <span
                                      key={key}
                                      style={{
                                        fontSize: '0.75rem',
                                        padding: '0.125rem 0.375rem',
                                        backgroundColor: theme.colors.secondary,
                                        borderRadius: '4px',
                                        color: theme.colors.foreground
                                      }}
                                    >
                                      {key}:{value}
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to remove ${employee.name}?`)) {
                                        setEmployees(employees.filter(e => e.id !== employee.id));
                                      }
                                    }}
                                  >
                                    <Icon name="trash" size={14} color={theme.colors.destructive} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Head</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((department) => {
                          const memberCount = employees.filter(emp => emp.department === department.name).length;
                          const deptHead = employees.find(emp => emp.department === department.name && emp.accessLevel === 'admin');
                          return (
                            <TableRow key={department.id}>
                              <TableCell>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem'
                                }}>
                                  <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: department.color
                                  }}></div>
                                  <div>
                                    <div style={{
                                      fontWeight: '500',
                                      fontSize: '0.875rem'
                                    }}>
                                      {department.name}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '0.875rem', color: theme.colors.mutedForeground }}>
                                  {department.description || 'No description'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '0.875rem' }}>
                                  {deptHead?.name || 'Not assigned'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '0.875rem' }}>
                                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '0.875rem' }}>
                                  {new Date(department.createdAt).toLocaleDateString()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDepartment(department);
                                      setShowEditDepartment(true);
                                    }}
                                  >
                                    <Icon name="edit" size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
                                        setDepartments(departments.filter(d => d.id !== department.id));
                                      }
                                    }}
                                  >
                                    <Icon name="trash" size={14} color={theme.colors.destructive} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
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
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Connect third-party services and APIs
              </p>
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
                Notifications
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Configure notification preferences and delivery settings
              </p>
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
                Security
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Manage security settings, access controls, and authentication
              </p>
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
                Billing
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                View billing information, manage subscriptions, and payment methods
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};