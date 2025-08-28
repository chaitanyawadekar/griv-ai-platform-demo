import React from 'react';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { LegacyWidgetFormData } from '../AddWidgetModal';

interface WidgetTypeSelectorProps {
  formData: LegacyWidgetFormData;
  onChange: (formData: LegacyWidgetFormData) => void;
  theme: Theme;
}

const getDataSourceInfo = (source: string) => {
  const info = {
    workitems: { label: 'Work & Tasks' },
    contacts: { label: 'People & Contacts' },
    employees: { label: 'Team Members' },
    sops: { label: 'Documents & SOPs' },
    custom: { label: 'Custom Data' }
  };
  return info[source as keyof typeof info] || info.workitems;
};

const getContextualWidgetOptions = (dataSource: string) => {
  const baseOptions = [
    {
      type: 'metric_card',
      icon: 'trending-up',
      title: 'Total Count',
      description: 'Show a single important number',
      color: '#3b82f6'
    },
    {
      type: 'chart',
      icon: 'bar-chart-2',
      title: 'Visual Breakdown',
      description: 'Compare different categories with charts',
      color: '#10b981'
    },
    {
      type: 'table',
      icon: 'table',
      title: 'Detailed List',
      description: 'See detailed information in rows and columns',
      color: '#6366f1'
    },
    {
      type: 'activity_feed',
      icon: 'clock',
      title: 'Recent Activity',
      description: 'Show latest updates and changes',
      color: '#8b5cf6'
    }
  ];

  // Customize examples based on data source
  switch (dataSource) {
    case 'workitems':
      return [
        { ...baseOptions[0], examples: ['Total tasks', 'Open issues count', 'Average priority score'] },
        { ...baseOptions[1], examples: ['Tasks by status', 'Issues by department', 'Priority distribution'] },
        { ...baseOptions[2], examples: ['Task assignments', 'Open issues list', 'Recent work items'] },
        { ...baseOptions[3], examples: ['Latest task updates', 'Recent assignments', 'Status changes'] },
        {
          type: 'progress_bar',
          icon: 'activity', 
          title: 'Progress Tracking',
          description: 'Track completion toward goals',
          examples: ['Project completion', 'Sprint progress', 'Team performance'],
          color: '#f59e0b'
        },
        {
          type: 'quick_actions',
          icon: 'zap',
          title: 'Quick Actions', 
          description: 'Fast access to common tasks',
          examples: ['Create task', 'Add issue', 'Assign work'],
          color: '#ef4444'
        }
      ];
    case 'contacts':
      return [
        { ...baseOptions[0], examples: ['Total contacts', 'New customers', 'Active clients count'] },
        { ...baseOptions[1], examples: ['Contacts by type', 'Customers by region', 'Status breakdown'] },
        { ...baseOptions[2], examples: ['Customer list', 'Contact directory', 'Client details'] },
        { ...baseOptions[3], examples: ['Recent interactions', 'New contacts', 'Client updates'] },
        {
          type: 'quick_actions',
          icon: 'zap',
          title: 'Quick Actions',
          description: 'Fast access to contact tasks', 
          examples: ['Add contact', 'Send message', 'Schedule call'],
          color: '#ef4444'
        }
      ];
    case 'employees':
      return [
        { ...baseOptions[0], examples: ['Total team members', 'Active employees', 'Department size'] },
        { ...baseOptions[1], examples: ['Staff by department', 'Roles breakdown', 'Performance scores'] },
        { ...baseOptions[2], examples: ['Employee directory', 'Team roster', 'Staff assignments'] },
        { ...baseOptions[3], examples: ['Recent hires', 'Team updates', 'Performance reviews'] }
      ];
    case 'sops':
      return [
        { ...baseOptions[0], examples: ['Total documents', 'Active SOPs', 'Pending reviews'] },
        { ...baseOptions[1], examples: ['Documents by type', 'SOPs by department', 'Status overview'] },
        { ...baseOptions[2], examples: ['Document library', 'SOP directory', 'Procedure list'] },
        { ...baseOptions[3], examples: ['Recent updates', 'New documents', 'Review activity'] }
      ];
    default:
      return baseOptions.map(option => ({ ...option, examples: ['Example 1', 'Example 2', 'Example 3'] }));
  }
};

export const WidgetTypeSelector: React.FC<WidgetTypeSelectorProps> = ({
  formData,
  onChange,
  theme
}) => {
  const handleTypeChange = (type: string) => {
    onChange({
      ...formData,
      type: type as LegacyWidgetFormData['type']
    });
  };

  return (
    <div>

      {/* Context-aware widget type selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {getContextualWidgetOptions(formData.dataSource).map((option) => (
          <div
            key={option.type}
            onClick={() => handleTypeChange(option.type)}
            style={{
              padding: '1.5rem',
              border: formData.type === option.type 
                ? `2px solid ${theme.colors.primary}` 
                : `1px solid ${theme.colors.border}`,
              borderRadius: '12px',
              backgroundColor: formData.type === option.type 
                ? `${theme.colors.primary}08` 
                : theme.colors.background,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (formData.type !== option.type) {
                e.currentTarget.style.borderColor = theme.colors.primary + '40';
                e.currentTarget.style.backgroundColor = theme.colors.muted;
              }
            }}
            onMouseLeave={(e) => {
              if (formData.type !== option.type) {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: `${option.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon name={option.icon as any} size={20} color={option.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  {option.title}
                </h4>
              </div>
              {formData.type === option.type && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name="check" size={14} color="white" />
                </div>
              )}
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: theme.colors.mutedForeground,
              margin: '0 0 8px 0',
              lineHeight: '1.4'
            }}>
              {option.description}
            </p>
            
            <div style={{
              fontSize: '0.75rem',
              color: theme.colors.mutedForeground,
              fontStyle: 'italic'
            }}>
              Examples: {option.examples.slice(0, 2).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};