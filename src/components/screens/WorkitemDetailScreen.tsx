import React, { useState, useEffect } from 'react';
import { Workitem, WorkitemType, Employee, Contact, SOP, Department } from '../../types';
import { theme } from '../../data/theme';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface WorkitemDetailScreenProps {
  workitem: Workitem | null;
  workitemTypes: WorkitemType[];
  employees: Employee[];
  contacts: Contact[];
  sops: SOP[];
  departments: Department[];
  onBack: () => void;
  onUpdate: (workitem: Workitem) => void;
  onDelete: (workitemId: string) => void;
  onClose: (workitemId: string) => void;
}

interface ActivityLogEntry {
  id: string;
  type: 'status_change' | 'assignment' | 'comment' | 'attachment' | 'sop_trigger';
  timestamp: string;
  user: string;
  description: string;
  oldValue?: string;
  newValue?: string;
}

export const WorkitemDetailScreen: React.FC<WorkitemDetailScreenProps> = ({
  workitem,
  workitemTypes,
  employees,
  contacts,
  sops,
  departments,
  onBack,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Workitem>>({});
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'sops' | 'timeline'>('overview');

  // Sample activity log (in real app, this would come from API)
  const [activityLog] = useState<ActivityLogEntry[]>([
    {
      id: 'act_1',
      type: 'status_change',
      timestamp: '2024-01-22T10:30:00Z',
      user: 'Sarah Johnson',
      description: 'Status changed from Open to In Progress',
      oldValue: 'Open',
      newValue: 'In Progress'
    },
    {
      id: 'act_2', 
      type: 'assignment',
      timestamp: '2024-01-20T14:15:00Z',
      user: 'John Smith',
      description: 'Assigned to Sarah Johnson',
      newValue: 'Sarah Johnson'
    },
    {
      id: 'act_3',
      type: 'comment',
      timestamp: '2024-01-18T09:45:00Z',
      user: 'Mike Davis',
      description: 'Added comment: Customer confirmed the issue affects multiple users'
    },
    {
      id: 'act_4',
      type: 'sop_trigger',
      timestamp: '2024-01-18T09:30:00Z',
      user: 'System',
      description: 'SOP "Critical Issue Resolution" automatically triggered'
    }
  ]);

  useEffect(() => {
    if (workitem) {
      setEditForm(workitem);
    }
  }, [workitem]);

  if (!workitem) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background
      }}>
        <Icon name="workitems" size={64} color={theme.colors.mutedForeground} />
        <h2 style={{ margin: '1rem 0', color: theme.colors.foreground }}>No Workitem Selected</h2>
        <p style={{ color: theme.colors.mutedForeground, marginBottom: '1.5rem' }}>
          Select a workitem to view its details
        </p>
        <Button onClick={onBack}>
          <Icon name="chevron-left" size={16} />
          Back to Workitems
        </Button>
      </div>
    );
  }

  const workitemType = workitemTypes.find(t => t.name === workitem.type);
  const assignedEmployee = employees.find(e => e.name === workitem.assignee);
  const relatedContact = contacts.find(c => c.name === workitem.contact);
  const department = departments.find(d => d.name === workitem.department);
  const applicableSOPs = sops.filter(sop => 
    sop.appliesTo === 'workitem' && 
    sop.status === 'active' &&
    sop.conditions.some(condition => {
      if (condition.field === 'type' && condition.operator === 'equals') {
        return condition.value === workitem.type;
      }
      if (condition.field === 'priority' && condition.operator === 'equals') {
        return condition.value === workitem.priority;
      }
      if (condition.field === 'status' && condition.operator === 'equals') {
        return condition.value === workitem.status;
      }
      return false;
    })
  );

  const handleSave = () => {
    if (editForm.title && editForm.description) {
      onUpdate({ ...workitem, ...editForm, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedWorkitem = { ...workitem, status: newStatus, updatedAt: new Date().toISOString() };
    onUpdate(updatedWorkitem);
  };

  const handleClose = () => {
    const updatedWorkitem = { ...workitem, status: 'Closed', updatedAt: new Date().toISOString() };
    onUpdate(updatedWorkitem);
    onClose(workitem.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return theme.colors.info;
      case 'In Progress': return theme.colors.warning;
      case 'Completed': return theme.colors.success;
      case 'Closed': return theme.colors.mutedForeground;
      default: return theme.colors.secondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return theme.colors.destructive;
      case 'High': return '#f59e0b';
      case 'Medium': return theme.colors.warning;
      case 'Low': return theme.colors.success;
      default: return theme.colors.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'status_change': return 'sync';
      case 'assignment': return 'user';
      case 'comment': return 'message';
      case 'attachment': return 'upload';
      case 'sop_trigger': return 'checklist';
      default: return 'info';
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: theme.colors.background,
      padding: '1.5rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <Button variant="ghost" onClick={onBack}>
          <Icon name="chevron-left" size={20} />
          Back
        </Button>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.25rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: `${workitemType?.color || theme.colors.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon name={workitemType?.icon || 'workitems'} size={20} color={workitemType?.color || theme.colors.primary} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: theme.colors.foreground,
                margin: 0
              }}>
                {workitem.title}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.25rem'
              }}>
                <Badge variant="secondary">{workitem.type}</Badge>
                <span style={{
                  fontSize: '0.875rem',
                  color: theme.colors.mutedForeground
                }}>
                  #{workitem.id}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Badge style={{
            backgroundColor: getStatusColor(workitem.status),
            color: theme.colors.primaryForeground
          }}>
            {workitem.status}
          </Badge>
          <Badge style={{
            backgroundColor: getPriorityColor(workitem.priority),
            color: theme.colors.primaryForeground
          }}>
            {workitem.priority}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Icon name="edit" size={16} />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {workitem.status !== 'Closed' && (
            <Button
              variant="default"
              onClick={handleClose}
            >
              <Icon name="check" size={16} color={theme.colors.primaryForeground} />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        marginBottom: '1.5rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        position: 'relative'
      }}>
        {[
          { key: 'overview', label: 'Overview', icon: 'dashboard' },
          { key: 'activity', label: 'Activity', icon: 'clock' },
          { key: 'sops', label: 'SOPs', icon: 'checklist' },
          { key: 'timeline', label: 'Timeline', icon: 'calendar' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.25rem',
              border: 'none',
              backgroundColor: activeTab === tab.key ? theme.colors.card : 'transparent',
              color: activeTab === tab.key ? theme.colors.primary : theme.colors.mutedForeground,
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.key ? '600' : '500',
              transition: 'all 0.2s',
              position: 'relative',
              borderTop: activeTab === tab.key ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
              borderLeft: activeTab === tab.key ? `1px solid ${theme.colors.border}` : '1px solid transparent',
              borderRight: activeTab === tab.key ? `1px solid ${theme.colors.border}` : '1px solid transparent',
              borderBottom: activeTab === tab.key ? `1px solid ${theme.colors.card}` : 'none',
              marginBottom: '-1px',
              zIndex: activeTab === tab.key ? 2 : 1
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
                e.currentTarget.style.color = theme.colors.foreground;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.mutedForeground;
              }
            }}
          >
            <Icon name={tab.icon} size={16} color={activeTab === tab.key ? theme.colors.primary : 'currentColor'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Content */}
        <div>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Description */}
              <div style={{
                backgroundColor: theme.colors.card,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Description
                </h3>
                {isEditing ? (
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '6px',
                      backgroundColor: theme.colors.background,
                      color: theme.colors.foreground,
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <p style={{
                    color: theme.colors.foreground,
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {workitem.description}
                  </p>
                )}
              </div>

              {/* Applicable SOPs */}
              <div style={{
                backgroundColor: theme.colors.card,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Applicable SOPs ({applicableSOPs.length})
                </h3>
                
                {applicableSOPs.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: theme.colors.mutedForeground
                  }}>
                    <Icon name="checklist" size={48} color={theme.colors.mutedForeground} />
                    <p style={{ margin: '1rem 0 0 0' }}>No SOPs match this workitem's criteria</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {applicableSOPs.map((sop) => (
                      <div key={sop.id} style={{
                        padding: '1rem',
                        backgroundColor: theme.colors.background,
                        borderRadius: '6px',
                        border: `1px solid ${theme.colors.border}`
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: theme.colors.foreground,
                            margin: 0
                          }}>
                            {sop.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Badge variant="success">v{sop.version}</Badge>
                            <Button variant="outline" size="sm">
                              <Icon name="checklist" size={14} />
                              Trigger
                            </Button>
                          </div>
                        </div>
                        <p style={{
                          color: theme.colors.mutedForeground,
                          fontSize: '0.875rem',
                          margin: '0 0 0.75rem 0',
                          lineHeight: '1.4'
                        }}>
                          {sop.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground
                        }}>
                          <span>{sop.steps.length} steps</span>
                          <span>•</span>
                          <span>Est. {sop.steps.reduce((total, step) => total + step.estimatedDuration, 0)} min</span>
                          <span>•</span>
                          <span>{sop.steps.filter(s => s.mandatory).length} mandatory</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div style={{
                backgroundColor: theme.colors.card,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                padding: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    Comments & Notes
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddComment(true)}
                  >
                    <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                    Add Comment
                  </Button>
                </div>
                
                {/* Sample Comments */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    {
                      id: '1',
                      user: 'Sarah Johnson',
                      timestamp: '2024-01-22T10:30:00Z',
                      content: 'Customer confirmed the issue affects multiple users. Escalating priority to Critical.'
                    },
                    {
                      id: '2',
                      user: 'Mike Davis',
                      timestamp: '2024-01-20T14:15:00Z', 
                      content: 'Initial assessment complete. This appears to be related to the recent system update.'
                    }
                  ].map((comment) => (
                    <div key={comment.id} style={{
                      padding: '1rem',
                      backgroundColor: theme.colors.secondary,
                      borderRadius: '6px',
                      borderLeft: `3px solid ${theme.colors.primary}`
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          fontWeight: '500',
                          color: theme.colors.foreground,
                          fontSize: '0.875rem'
                        }}>
                          {comment.user}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground
                        }}>
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <p style={{
                        color: theme.colors.foreground,
                        margin: 0,
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{
              backgroundColor: theme.colors.card,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`,
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Activity Log
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {activityLog.map((activity) => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: theme.colors.background,
                    borderRadius: '6px',
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: theme.colors.primary + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon name={getActivityIcon(activity.type)} size={16} color={theme.colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          color: theme.colors.foreground
                        }}>
                          {activity.user}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground
                        }}>
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        color: theme.colors.foreground,
                        lineHeight: '1.4'
                      }}>
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sops' && (
            <div style={{
              backgroundColor: theme.colors.card,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`,
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                SOP Management
              </h3>
              
              <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                color: theme.colors.mutedForeground
              }}>
                <Icon name="checklist" size={64} color={theme.colors.mutedForeground} />
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '1rem 0 0.5rem 0'
                }}>
                  SOPs moved to Overview
                </h4>
                <p style={{ margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                  Applicable SOPs are now displayed in the Overview tab for better visibility and workflow integration.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('overview')}>
                  <Icon name="dashboard" size={16} />
                  Go to Overview
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div style={{
              backgroundColor: theme.colors.card,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`,
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: '0 0 1rem 0'
              }}>
                Workitem Timeline
              </h3>
              
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '32px',
                  bottom: '32px',
                  width: '2px',
                  backgroundColor: theme.colors.border
                }} />
                
                {/* Timeline Events */}
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {[
                    { date: workitem.createdAt, event: 'Workitem created', type: 'created', user: 'System' },
                    { date: workitem.updatedAt, event: 'Last updated', type: 'updated', user: assignedEmployee?.name || 'Unknown' },
                    { date: workitem.dueDate, event: 'Due date', type: 'due', user: null, future: new Date(workitem.dueDate) > new Date() }
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: item.future ? theme.colors.warning : theme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        position: 'relative'
                      }}>
                        <Icon 
                          name={item.type === 'created' ? 'plus' : item.type === 'updated' ? 'edit' : 'calendar'} 
                          size={16} 
                          color={theme.colors.primaryForeground} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: theme.colors.foreground
                        }}>
                          {item.event}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: theme.colors.mutedForeground,
                          marginTop: '0.25rem'
                        }}>
                          {formatDate(item.date)}
                          {item.user && ` • ${item.user}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>

          {/* Workitem Details */}
          <div style={{
            backgroundColor: theme.colors.card,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`,
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0 0 1rem 0'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Details
              </h4>
              {/* Actions Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'in-progress') handleStatusChange('In Progress');
                    else if (value === 'completed') handleStatusChange('Completed');
                    else if (value === 'open') handleStatusChange('Open');
                    else if (value === 'delete') setShowDeleteConfirm(true);
                    e.target.value = ''; // Reset selection
                  }}
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Actions</option>
                  <option value="in-progress" disabled={workitem.status === 'In Progress'}>
                    Mark In Progress
                  </option>
                  <option value="completed" disabled={workitem.status === 'Completed'}>
                    Mark Completed
                  </option>
                  <option value="open" disabled={workitem.status === 'Open'}>
                    Reopen
                  </option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.875rem' }}>
              {[
                { label: 'Assignee', value: assignedEmployee?.name || 'Unassigned', icon: 'user' },
                { label: 'Department', value: workitem.department, icon: 'building', color: department?.color },
                { label: 'Contact', value: relatedContact?.name || 'None', icon: 'phone' },
                { label: 'Location', value: workitem.location || 'Not specified', icon: 'location' },
                { label: 'Due Date', value: formatDate(workitem.dueDate), icon: 'calendar' },
                { label: 'Created', value: formatDate(workitem.createdAt), icon: 'clock' },
                { label: 'Updated', value: formatDate(workitem.updatedAt), icon: 'sync' }
              ].map((detail, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Icon name={detail.icon} size={16} color={detail.color || theme.colors.mutedForeground} />
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: theme.colors.mutedForeground,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      {detail.label}
                    </div>
                    <div style={{
                      color: theme.colors.foreground,
                      fontWeight: '500'
                    }}>
                      {detail.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{
            backgroundColor: theme.colors.card,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`,
            padding: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 1rem 0'
            }}>
              Tags
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {workitem.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" style={{ fontSize: '0.75rem' }}>
                  {tag}
                </Badge>
              ))}
              {workitem.tags.length === 0 && (
                <span style={{
                  fontSize: '0.875rem',
                  color: theme.colors.mutedForeground
                }}>
                  No tags
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Save/Cancel */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: theme.colors.card,
          padding: '1rem',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.lg
        }}>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Icon name="save" size={16} color={theme.colors.primaryForeground} />
            Save Changes
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Workitem"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Icon name="delete" size={48} color={theme.colors.destructive} />
          <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Are you sure?</h3>
          <p style={{ color: theme.colors.mutedForeground, margin: '0 0 1.5rem 0' }}>
            This action cannot be undone. This will permanently delete the workitem.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(workitem.id);
                setShowDeleteConfirm(false);
                onBack();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        show={showAddComment}
        onClose={() => setShowAddComment(false)}
        title="Add Comment"
        size="md"
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.colors.background,
              color: theme.colors.foreground,
              fontSize: '0.875rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddComment(false);
                setNewComment('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // In real app, save comment to API
                console.log('Adding comment:', newComment);
                setShowAddComment(false);
                setNewComment('');
              }}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};