import React, { useState, useMemo } from 'react';
import { Workitem, WorkitemType, Employee, Department } from '../../types';
import { theme } from '../../data/theme';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

interface WorkitemsScreenProps {
  workitems: Workitem[];
  workitemTypes: WorkitemType[];
  employees: Employee[];
  departments: Department[];
  onWorkitemClick: (workitem: Workitem) => void;
  onCreateWorkitem: () => void;
}

interface WorkitemCardProps {
  workitem: Workitem;
  workitemType: WorkitemType | undefined;
  assignee: Employee | undefined;
  department: Department | undefined;
  onWorkitemClick: (workitem: Workitem) => void;
}

const WorkitemVerticalItem: React.FC<WorkitemCardProps & { isCompact?: boolean }> = ({ 
  workitem, 
  workitemType, 
  assignee, 
  department, 
  onWorkitemClick,
  isCompact = false
}) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTypeSpecificFields = () => {
    if (!workitem.typeFields) return null;

    const getKeyFields = () => {
      switch (workitem.type) {
        case 'Lead':
          return ['name', 'phone', 'email', 'company'];
        case 'Complaint':
          return ['name', 'phone', 'issue', 'severity'];
        case 'Request':
          return ['name', 'request_type', 'platform'];
        case 'Inquiry':
          return ['name', 'phone', 'subject'];
        default:
          return Object.keys(workitem.typeFields || {}).slice(0, 3);
      }
    };

    const keyFields = getKeyFields();
    
    return (
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        fontSize: '0.75rem'
      }}>
        {keyFields.map((fieldKey) => {
          const value = workitem.typeFields![fieldKey];
          if (!value) return null;
          
          return (
            <div key={fieldKey} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                color: theme.colors.mutedForeground,
                textTransform: 'capitalize',
                fontWeight: '500'
              }}>
                {fieldKey.replace(/_/g, ' ')}:
              </span>
              <span style={{
                color: theme.colors.foreground,
                fontWeight: '500',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {Array.isArray(value) ? value.join(', ') : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      onClick={() => onWorkitemClick(workitem)}
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: '8px',
        border: `1px solid ${theme.colors.border}`,
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '0.5rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = workitemType?.color || theme.colors.primary;
        e.currentTarget.style.boxShadow = `0 2px 8px ${(workitemType?.color || theme.colors.primary)}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        {/* Icon and Type */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minWidth: '120px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: `${workitemType?.color || theme.colors.primary}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon 
              name={workitemType?.icon || 'workitems'} 
              size={16} 
              color={workitemType?.color || theme.colors.primary} 
            />
          </div>
          <Badge 
            variant="secondary" 
            style={{
              backgroundColor: `${workitemType?.color || theme.colors.primary}15`,
              color: workitemType?.color || theme.colors.primary,
              border: `1px solid ${workitemType?.color || theme.colors.primary}30`,
              fontSize: '0.7rem',
              fontWeight: '600'
            }}
          >
            {workitem.type}
          </Badge>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0,
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {workitem.title}
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                fontSize: '0.8rem',
                lineHeight: '1.4',
                margin: '0.25rem 0 0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {workitem.description}
              </p>
            </div>

            {/* Status, Priority, ID */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
              <Badge style={{
                backgroundColor: `${getStatusColor(workitem.status)}20`,
                color: getStatusColor(workitem.status),
                border: `1px solid ${getStatusColor(workitem.status)}30`,
                fontSize: '0.65rem'
              }}>
                {workitem.status}
              </Badge>
              <Badge style={{
                backgroundColor: `${getPriorityColor(workitem.priority)}20`,
                color: getPriorityColor(workitem.priority),
                border: `1px solid ${getPriorityColor(workitem.priority)}30`,
                fontSize: '0.65rem',
                fontWeight: '600'
              }}>
                {workitem.priority}
              </Badge>
              <span style={{
                fontSize: '0.65rem',
                color: theme.colors.mutedForeground,
                opacity: 0.7
              }}>
                #{workitem.id}
              </span>
            </div>
          </div>

          {/* Type-specific fields */}
          <div style={{ marginBottom: '0.75rem' }}>
            {renderTypeSpecificFields()}
          </div>

          {/* Footer - Assignee, Department, Due Date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Assignee */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: assignee ? workitemType?.color || theme.colors.primary : theme.colors.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: assignee ? theme.colors.primaryForeground : theme.colors.foreground,
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {assignee ? assignee.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                </div>
                <span style={{ color: theme.colors.mutedForeground, fontSize: '0.75rem' }}>
                  {assignee?.name || 'Unassigned'}
                </span>
              </div>

              {/* Department */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: department?.color || theme.colors.mutedForeground,
                  flexShrink: 0
                }} />
                <span style={{ color: theme.colors.mutedForeground, fontSize: '0.75rem' }}>
                  {workitem.department}
                </span>
              </div>
            </div>

            {/* Due date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="calendar" size={12} color={theme.colors.mutedForeground} />
              <span style={{ 
                color: theme.colors.mutedForeground,
                fontSize: '0.75rem'
              }}>
                Due {formatDate(workitem.dueDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkitemCard: React.FC<WorkitemCardProps> = ({ 
  workitem, 
  workitemType, 
  assignee, 
  department, 
  onWorkitemClick 
}) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTypeSpecificFields = () => {
    if (!workitem.typeFields) return null;

    // Get key fields to show based on workitem type
    const getKeyFields = () => {
      switch (workitem.type) {
        case 'Lead':
          return ['name', 'phone', 'email', 'source', 'budget'];
        case 'Complaint':
          return ['name', 'phone', 'issue', 'severity', 'category'];
        case 'Request':
          return ['name', 'request_type', 'platform', 'justification'];
        case 'Inquiry':
          return ['name', 'phone', 'subject', 'industry'];
        default:
          return Object.keys(workitem.typeFields || {}).slice(0, 4);
      }
    };

    const keyFields = getKeyFields();
    
    return (
      <div style={{
        display: 'grid',
        gap: '0.5rem',
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: `1px solid ${theme.colors.border}`
      }}>
        {keyFields.map((fieldKey) => {
          const value = workitem.typeFields![fieldKey];
          if (!value) return null;
          
          return (
            <div key={fieldKey} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}>
              <span style={{
                color: theme.colors.mutedForeground,
                textTransform: 'capitalize',
                fontWeight: '500'
              }}>
                {fieldKey.replace(/_/g, ' ')}:
              </span>
              <span style={{
                color: theme.colors.foreground,
                fontWeight: '500',
                maxWidth: '60%',
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {Array.isArray(value) ? value.join(', ') : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      onClick={() => onWorkitemClick(workitem)}
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: '12px',
        border: `1px solid ${theme.colors.border}`,
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = workitemType?.color || theme.colors.primary;
        e.currentTarget.style.boxShadow = `0 4px 12px ${(workitemType?.color || theme.colors.primary)}20`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header with Icon, Type and Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: `${workitemType?.color || theme.colors.primary}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon 
              name={workitemType?.icon || 'workitems'} 
              size={20} 
              color={workitemType?.color || theme.colors.primary} 
            />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Badge 
              variant="secondary" 
              style={{
                backgroundColor: `${workitemType?.color || theme.colors.primary}15`,
                color: workitemType?.color || theme.colors.primary,
                border: `1px solid ${workitemType?.color || theme.colors.primary}30`,
                fontSize: '0.7rem',
                fontWeight: '600'
              }}
            >
              {workitem.type}
            </Badge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Badge style={{
            backgroundColor: `${getStatusColor(workitem.status)}20`,
            color: getStatusColor(workitem.status),
            border: `1px solid ${getStatusColor(workitem.status)}30`,
            fontSize: '0.7rem'
          }}>
            {workitem.status}
          </Badge>
          <Badge style={{
            backgroundColor: `${getPriorityColor(workitem.priority)}20`,
            color: getPriorityColor(workitem.priority),
            border: `1px solid ${getPriorityColor(workitem.priority)}30`,
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            {workitem.priority}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        margin: '0 0 0.5rem 0',
        lineHeight: '1.4'
      }}>
        {workitem.title}
      </h3>

      {/* Description */}
      <p style={{
        color: theme.colors.mutedForeground,
        fontSize: '0.875rem',
        lineHeight: '1.5',
        margin: '0 0 1rem 0',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {workitem.description}
      </p>

      {/* Type-specific fields */}
      {renderTypeSpecificFields()}

      {/* Footer with assignee, department, and due date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: `1px solid ${theme.colors.border}`,
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Assignee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: assignee ? workitemType?.color || theme.colors.primary : theme.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: assignee ? theme.colors.primaryForeground : theme.colors.foreground,
              fontSize: '0.7rem',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {assignee ? assignee.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
            </div>
            <span style={{ color: theme.colors.mutedForeground, fontSize: '0.75rem' }}>
              {assignee?.name || 'Unassigned'}
            </span>
          </div>

          {/* Department */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: department?.color || theme.colors.mutedForeground,
              flexShrink: 0
            }} />
            <span style={{ color: theme.colors.mutedForeground, fontSize: '0.75rem' }}>
              {workitem.department}
            </span>
          </div>
        </div>

        {/* Due date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="calendar" size={12} color={theme.colors.mutedForeground} />
          <span style={{ 
            color: theme.colors.mutedForeground,
            fontSize: '0.75rem'
          }}>
            Due {formatDate(workitem.dueDate)}
          </span>
        </div>
      </div>

      {/* Tags */}
      {workitem.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: '0.75rem'
        }}>
          {workitem.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.65rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: theme.colors.secondary,
                color: theme.colors.foreground,
                borderRadius: '12px',
                fontWeight: '500'
              }}
            >
              #{tag}
            </span>
          ))}
          {workitem.tags.length > 3 && (
            <span style={{
              fontSize: '0.65rem',
              color: theme.colors.mutedForeground,
              padding: '0.25rem 0.5rem'
            }}>
              +{workitem.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ID indicator in corner */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        fontSize: '0.65rem',
        color: theme.colors.mutedForeground,
        opacity: 0.7
      }}>
        #{workitem.id}
      </div>
    </div>
  );
};

export const WorkitemsScreen: React.FC<WorkitemsScreenProps> = ({
  workitems,
  workitemTypes,
  employees,
  departments,
  onWorkitemClick,
  onCreateWorkitem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'vertical'>('vertical');

  const filteredWorkitems = useMemo(() => {
    return workitems.filter(workitem => {
      const matchesSearch = workitem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workitem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (workitem.typeFields && Object.values(workitem.typeFields).some(value => 
                             String(value).toLowerCase().includes(searchTerm.toLowerCase())
                           ));
      const matchesType = filterType === 'all' || workitem.type === filterType;
      const matchesStatus = filterStatus === 'all' || workitem.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || workitem.priority === filterPriority;
      
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [workitems, searchTerm, filterType, filterStatus, filterPriority]);

  // Sort workitems by created date (newest first) for vertical view
  const sortedWorkitems = useMemo(() => {
    return [...filteredWorkitems].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredWorkitems]);

  // Group workitems by type for grid view
  const groupedWorkitems = useMemo(() => {
    const groups: Record<string, Workitem[]> = {};
    filteredWorkitems.forEach(workitem => {
      if (!groups[workitem.type]) {
        groups[workitem.type] = [];
      }
      groups[workitem.type].push(workitem);
    });
    return groups;
  }, [filteredWorkitems]);

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: theme.colors.background,
      minHeight: 'calc(100vh - 120px)'
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
            Workitems
          </h1>
          <p style={{
            fontSize: '1rem',
            color: theme.colors.mutedForeground,
            margin: '0.5rem 0 0 0'
          }}>
            Mix and match display of leads, tasks, tickets, and grievances ({filteredWorkitems.length} of {workitems.length})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: theme.colors.secondary,
            borderRadius: '6px',
            padding: '0.25rem'
          }}>
            <button
              onClick={() => setViewMode('vertical')}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: viewMode === 'vertical' ? theme.colors.primary : 'transparent',
                color: viewMode === 'vertical' ? theme.colors.primaryForeground : theme.colors.foreground,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Icon name="table" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: viewMode === 'list' ? theme.colors.primary : 'transparent',
                color: viewMode === 'list' ? theme.colors.primaryForeground : theme.colors.foreground,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Icon name="dashboard" size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? theme.colors.primary : 'transparent',
                color: viewMode === 'grid' ? theme.colors.primaryForeground : theme.colors.foreground,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Icon name="workitems" size={16} />
            </button>
          </div>
          
          <Button onClick={onCreateWorkitem}>
            <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
            Create Workitem
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 180px 180px 180px',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search workitems, descriptions, or field values..."
          style={{
            minWidth: 0,
            width: '100%'
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '0.75rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontSize: '0.875rem',
            width: '100%'
          }}
        >
          <option value="all">All Types</option>
          {workitemTypes.map(type => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.75rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontSize: '0.875rem',
            width: '100%'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{
            padding: '0.75rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontSize: '0.875rem',
            width: '100%'
          }}
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Content */}
      {filteredWorkitems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: theme.colors.card,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <Icon name="workitems" size={64} color={theme.colors.mutedForeground} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: '1rem 0 0.5rem 0'
          }}>
            No workitems found
          </h3>
          <p style={{
            color: theme.colors.mutedForeground,
            marginBottom: '1.5rem'
          }}>
            {workitems.length === 0 
              ? 'Create your first workitem to get started'
              : 'Try adjusting your search criteria or filters'
            }
          </p>
          <Button onClick={onCreateWorkitem}>
            <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
            Create Workitem
          </Button>
        </div>
      ) : viewMode === 'vertical' ? (
        // Vertical view - chronological mix and match list
        <div style={{ maxWidth: '100%' }}>
          {sortedWorkitems.map((workitem) => (
            <WorkitemVerticalItem
              key={workitem.id}
              workitem={workitem}
              workitemType={workitemTypes.find(t => t.name === workitem.type)}
              assignee={employees.find(e => e.name === workitem.assignee)}
              department={departments.find(d => d.name === workitem.department)}
              onWorkitemClick={onWorkitemClick}
            />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        // List view - all items in a card grid
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1rem'
        }}>
          {filteredWorkitems.map((workitem) => (
            <WorkitemCard
              key={workitem.id}
              workitem={workitem}
              workitemType={workitemTypes.find(t => t.name === workitem.type)}
              assignee={employees.find(e => e.name === workitem.assignee)}
              department={departments.find(d => d.name === workitem.department)}
              onWorkitemClick={onWorkitemClick}
            />
          ))}
        </div>
      ) : (
        // Grid view - grouped by type
        <div style={{ display: 'grid', gap: '2rem' }}>
          {Object.entries(groupedWorkitems).map(([type, items]) => {
            const typeInfo = workitemTypes.find(t => t.name === type);
            return (
              <div key={type}>
                {/* Type Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${typeInfo?.color || theme.colors.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon 
                      name={typeInfo?.icon || 'workitems'} 
                      size={18} 
                      color={typeInfo?.color || theme.colors.primary} 
                    />
                  </div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {type}s ({items.length})
                  </h2>
                </div>
                
                {/* Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {items.map((workitem) => (
                    <WorkitemCard
                      key={workitem.id}
                      workitem={workitem}
                      workitemType={workitemTypes.find(t => t.name === workitem.type)}
                      assignee={employees.find(e => e.name === workitem.assignee)}
                      department={departments.find(d => d.name === workitem.department)}
                      onWorkitemClick={onWorkitemClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};