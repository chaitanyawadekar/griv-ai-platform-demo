import React from 'react';
import { Input } from '../../ui/Input';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { LegacyWidgetFormData } from '../AddWidgetModal';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { WidgetConfigEngine } from '../../../utils/widgetConfigEngine';
import type { AggregationOption } from '../../../utils/widgetConfigEngine';

interface WidgetConfigurationStepProps {
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

export const WidgetConfigurationStep: React.FC<WidgetConfigurationStepProps> = ({
  formData,
  onChange,
  theme
}) => {
  const handleChange = (field: keyof LegacyWidgetFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const renderMetricSelection = () => {
    const configOptions = WidgetConfigEngine.getAvailableOptions(formData.type, formData.dataSource);
    
    // Get available fields based on the selected aggregation for all widget types
    const getAvailableFieldsForAggregation = () => {
      // For widgets that don't use aggregation, return all fields
      if (!['metric_card', 'chart', 'progress_bar'].includes(formData.type)) {
        return WidgetDataProvider.getAvailableFields(formData.dataSource);
      }
      
      const selectedAggregation = configOptions.schema.aggregations.find(
        (agg: AggregationOption) => agg.value === formData.aggregation
      );
      
      if (!selectedAggregation || !selectedAggregation.requiresField) {
        return []; // Count aggregation doesn't need a field
      }
      
      // Filter fields based on aggregation requirements for metric cards, charts, and progress bars
      return configOptions.fields
        .filter(field => selectedAggregation.applicableFieldTypes.includes(field.type))
        .map(field => field.name);
    };
    
    const availableFields = getAvailableFieldsForAggregation();
    
    const handleSingleFieldChange = (field: string) => {
      onChange({
        ...formData,
        selectedFields: field ? [field] : []
      });
    };

    const handleMultiFieldChange = (field: string, isRemoving: boolean = false) => {
      if (isRemoving) {
        onChange({
          ...formData,
          selectedFields: formData.selectedFields.filter(f => f !== field)
        });
      } else {
        if (!formData.selectedFields.includes(field)) {
          onChange({
            ...formData,
            selectedFields: [...formData.selectedFields, field]
          });
        }
      }
    };

    const getFieldLabel = (field: string) => {
      return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    };

    // Single select widgets (Metric Card, Progress Bar, Chart)
    if (['metric_card', 'progress_bar', 'chart'].includes(formData.type)) {
      const selectedField = formData.selectedFields[0] || '';
      
      // For count aggregation on widgets that use aggregation, no field selection needed
      if (['metric_card', 'chart', 'progress_bar'].includes(formData.type) && formData.aggregation === 'count') {
        const message = formData.type === 'metric_card' 
          ? 'This will count the total number of records matching your filters.'
          : formData.type === 'chart'
          ? 'This will count records per category for your chart visualization.'
          : 'This will count records for progress tracking.';
          
        return (
          <div style={{
            padding: '1rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '6px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: theme.colors.foreground,
              margin: 0
            }}>
              <strong>Count aggregation selected:</strong> No specific field required. {message}
            </p>
          </div>
        );
      }
      
      return (
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: theme.colors.foreground,
            marginBottom: '0.5rem'
          }}>
{(() => {
              if (formData.type === 'metric_card') {
                return ['sum', 'avg', 'min', 'max'].includes(formData.aggregation) 
                  ? 'Select Numeric Field for Calculation *'
                  : 'Select Field for Calculation *';
              } else if (formData.type === 'chart') {
                return ['sum', 'avg'].includes(formData.aggregation)
                  ? 'Select Numeric Field to Aggregate *'
                  : 'Select Field to Visualize *';
              } else if (formData.type === 'progress_bar') {
                return ['sum', 'avg'].includes(formData.aggregation)
                  ? 'Select Numeric Field for Progress Value *'
                  : 'Select Field for Progress Tracking *';
              }
              return 'Select Field *';
            })()}
          </label>
          
          {availableFields.length === 0 ? (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.colors.warning + '10',
              border: `1px solid ${theme.colors.warning}`,
              borderRadius: '6px',
              color: theme.colors.foreground
            }}>
{(() => {
                const requiresNumeric = ['sum', 'avg', 'min', 'max'].includes(formData.aggregation);
                const widgetTypeMsg = formData.type === 'metric_card' 
                  ? 'metric calculation'
                  : formData.type === 'chart'
                  ? 'chart visualization'
                  : 'progress tracking';
                  
                return (
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    No compatible fields available for <strong>{formData.aggregation}</strong> aggregation in {widgetTypeMsg}.
                    {requiresNumeric && (
                      <span> This aggregation requires numeric fields (numbers, amounts, scores, etc.).</span>
                    )}
                  </p>
                );
              })()}
            </div>
          ) : (
            <select
              value={selectedField}
              onChange={(e) => handleSingleFieldChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="">Choose a field...</option>
              {availableFields.map(field => (
                <option key={field} value={field}>
                  {getFieldLabel(field)}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    }

    // Multi select widgets (Table, Activity Feed)
    if (['table', 'activity_feed'].includes(formData.type)) {
      return (
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: theme.colors.foreground,
            marginBottom: '0.5rem'
          }}>
            {formData.type === 'table' ? 'Select Table Columns *' : 'Select Fields to Display *'}
          </label>
          
          {/* Add Field Dropdown */}
          <select
            value=""
            onChange={(e) => e.target.value && handleMultiFieldChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.colors.background,
              color: theme.colors.foreground,
              fontSize: '0.875rem',
              marginBottom: '0.75rem'
            }}
          >
            <option value="">Add a field...</option>
            {availableFields
              .filter(field => !formData.selectedFields.includes(field))
              .map(field => (
                <option key={field} value={field}>
                  {getFieldLabel(field)}
                </option>
              ))}
          </select>

          {/* Selected Fields Display */}
          {formData.selectedFields.length > 0 && (
            <div style={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '0.75rem',
              backgroundColor: theme.colors.secondary
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Selected Fields ({formData.selectedFields.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.selectedFields.map(field => (
                  <div
                    key={field}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  >
                    <span>{getFieldLabel(field)}</span>
                    <button
                      onClick={() => handleMultiFieldChange(field, true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.colors.mutedForeground,
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '0.75rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Quick Actions - no field selection needed
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: theme.colors.secondary,
        borderRadius: '6px',
        border: `1px solid ${theme.colors.border}`
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: theme.colors.mutedForeground,
          margin: 0
        }}>
          Quick action buttons will be automatically generated based on your data source and permissions. No field selection required.
        </p>
      </div>
    );
  };

  const renderWidgetTypeOptions = () => {
    // Only show widget-specific options if a field is selected (except for quick_actions)
    if (formData.type !== 'quick_actions' && formData.selectedFields.length === 0) {
      return (
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.secondary,
          borderRadius: '6px',
          border: `1px solid ${theme.colors.border}`,
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
            margin: 0,
            fontStyle: 'italic'
          }}>
            Please select a field above to see {formData.type.replace('_', ' ')} configuration options.
          </p>
        </div>
      );
    }

    switch (formData.type) {
      case 'chart':
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Chart Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Chart Type *
                </label>
                <select
                  value={formData.chartType}
                  onChange={(e) => handleChange('chartType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="bar">Bar Chart - Best for comparing categories</option>
                  <option value="line">Line Chart - Best for trends over time</option>
                  <option value="pie">Pie Chart - Best for showing parts of a whole</option>
                  <option value="area">Area Chart - Best for showing volume over time</option>
                  <option value="donut">Donut Chart - Like pie but with center space</option>
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
                  Chart Size
                </label>
                <select
                  value={formData.chartSize || 'medium'}
                  onChange={(e) => handleChange('chartSize', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="small">Small (3x1)</option>
                  <option value="medium">Medium (6x2)</option>
                  <option value="large">Large (6x3)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Table Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Rows Per Page
                </label>
                <select
                  value={formData.rowsPerPage || '10'}
                  onChange={(e) => handleChange('rowsPerPage', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="5">5 rows</option>
                  <option value="10">10 rows</option>
                  <option value="25">25 rows</option>
                  <option value="50">50 rows</option>
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
                  Enable Search
                </label>
                <select
                  value={formData.enableSearch !== false ? 'true' : 'false'}
                  onChange={(e) => handleChange('enableSearch', e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="true">Enable search box</option>
                  <option value="false">No search box</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'progress_bar':
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Progress Bar Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Target Value *
                </label>
                <Input
                  type="number"
                  value={formData.progressTarget?.toString() || '100'}
                  onChange={(e) => handleChange('progressTarget', parseInt(e.target.value) || 100)}
                  placeholder="100"
                  style={{ width: '100%' }}
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
                  Progress Type
                </label>
                <select
                  value={formData.progressType || 'percentage'}
                  onChange={(e) => handleChange('progressType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="percentage">Percentage (0-100%)</option>
                  <option value="count">Count (current/target)</option>
                  <option value="value">Raw Value</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'activity_feed':
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Activity Feed Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Update Frequency
                </label>
                <select
                  value={formData.refreshInterval || '5m'}
                  onChange={(e) => handleChange('refreshInterval', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="1m">Real-time (1 minute)</option>
                  <option value="5m">Every 5 minutes</option>
                  <option value="15m">Every 15 minutes</option>
                  <option value="30m">Every 30 minutes</option>
                  <option value="1h">Every hour</option>
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
                  Activity Filter
                </label>
                <select
                  value={formData.activityType || 'recent'}
                  onChange={(e) => handleChange('activityType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="recent">Recent Activity (all types)</option>
                  <option value="updates">Status Updates only</option>
                  <option value="alerts">Alerts & Notifications</option>
                  <option value="assignments">Assignment Changes</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'quick_actions':
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Quick Actions Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Action Style
                </label>
                <select
                  value={formData.actionStyle || 'buttons'}
                  onChange={(e) => handleChange('actionStyle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="buttons">Button Grid</option>
                  <option value="list">Action List</option>
                  <option value="cards">Action Cards</option>
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
                  Max Actions
                </label>
                <select
                  value={formData.maxActions || '6'}
                  onChange={(e) => handleChange('maxActions', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="4">4 actions</option>
                  <option value="6">6 actions</option>
                  <option value="8">8 actions</option>
                  <option value="12">12 actions</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'metric_card':
      default:
        return (
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.75rem'
            }}>
              Metric Card Configuration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '0.5rem'
                }}>
                  Display Format
                </label>
                <select
                  value={formData.displayFormat || 'number'}
                  onChange={(e) => handleChange('displayFormat', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="number">Number (1,234)</option>
                  <option value="currency">Currency ($1,234.56)</option>
                  <option value="percentage">Percentage (12.34%)</option>
                  <option value="duration">Duration (2h 15m)</option>
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
                  Show Trend
                </label>
                <select
                  value={formData.showTrend !== false ? 'true' : 'false'}
                  onChange={(e) => handleChange('showTrend', e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="true">Show trend arrow & percentage</option>
                  <option value="false">Show value only</option>
                </select>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderCommonConfiguration = () => {
    // Quick Actions don't need aggregation/time range
    if (formData.type === 'quick_actions') {
      return null;
    }

    // Activity Feed only needs time range
    if (formData.type === 'activity_feed') {
      return (
        <div>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '0.75rem'
          }}>
            Data Configuration
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Time Range
              </label>
              <select
                value={formData.timeRange}
                onChange={(e) => handleChange('timeRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
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
                Max Items
              </label>
              <Input
                type="number"
                value={formData.limit.toString()}
                onChange={(e) => handleChange('limit', Math.min(parseInt(e.target.value) || 50, 100))}
                placeholder="50"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Table widgets need different configuration
    if (formData.type === 'table') {
      return (
        <div>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '0.75rem'
          }}>
            Data Configuration
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Time Range
              </label>
              <select
                value={formData.timeRange}
                onChange={(e) => handleChange('timeRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
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
                Max Records
              </label>
              <Input
                type="number"
                value={formData.limit.toString()}
                onChange={(e) => handleChange('limit', parseInt(e.target.value) || 100)}
                placeholder="100"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      );
    }

    // For Metric Cards, Charts, Progress Bars - full configuration
    return (
      <div>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: theme.colors.foreground,
          marginBottom: '0.75rem'
        }}>
          Data Configuration
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Aggregation Method
            </label>
            <select
              value={formData.aggregation}
              onChange={(e) => handleChange('aggregation', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="count">Count Records - Total number of items</option>
              <option value="sum">Sum Values - Add up all numeric values</option>
              <option value="avg">Average - Mean of all values</option>
              <option value="min">Minimum Value - Lowest value found</option>
              <option value="max">Maximum Value - Highest value found</option>
              <option value="distinct_count">Unique Count - Number of unique values</option>
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
              Time Range
            </label>
            <select
              value={formData.timeRange}
              onChange={(e) => handleChange('timeRange', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Icon name="layers" size={48} color={theme.colors.primary} />
      </div>
      
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        marginBottom: '0.75rem',
        textAlign: 'center'
      }}>
        What would you like to create?
      </h3>
      <p style={{
        fontSize: '1rem',
        color: theme.colors.mutedForeground,
        marginBottom: '2rem',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        Choose what type of widget to create with your {getDataSourceInfo(formData.dataSource).label.toLowerCase()} data
      </p>

      {/* Context-aware widget type selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto 2rem auto'
      }}>
        {getContextualWidgetOptions(formData.dataSource).map((option) => (
          <div
            key={option.type}
            onClick={() => handleChange('type', option.type)}
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
              textAlign: 'left',
              position: 'relative'
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

      {/* Widget Type Specific Options - Data Configuration First */}
      {renderWidgetTypeOptions()}

      {/* Metric/Field Selection - After Data Configuration */}
      {renderMetricSelection()}

      {/* Common Configuration - Only for widgets that need it */}
      {renderCommonConfiguration()}
    </div>
  );
};