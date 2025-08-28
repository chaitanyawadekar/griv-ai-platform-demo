import React from 'react';
import { Input } from '../../ui/Input';
import { Theme } from '../../../types';
import { WidgetFormData } from '../AddWidgetModal';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';

interface WidgetConfigurationStepProps {
  formData: WidgetFormData;
  onChange: (formData: WidgetFormData) => void;
  theme: Theme;
}

export const WidgetConfigurationStep: React.FC<WidgetConfigurationStepProps> = ({
  formData,
  onChange,
  theme
}) => {
  const handleChange = (field: keyof WidgetFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const renderMetricSelection = () => {
    const availableFields = WidgetDataProvider.getAvailableFields(formData.dataSource);
    
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
      
      return (
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: theme.colors.foreground,
            marginBottom: '0.5rem'
          }}>
            {formData.type === 'metric_card' ? 'Select Metric to Display *' : 
             formData.type === 'chart' ? 'Select Field to Visualize *' :
             'Select Field for Progress Tracking *'}
          </label>
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
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        marginBottom: '0.5rem'
      }}>
        Configure Your Widget
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: theme.colors.mutedForeground,
        marginBottom: '1.5rem'
      }}>
        Set up the basic properties and appearance of your widget.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Widget Title */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: theme.colors.foreground,
            marginBottom: '0.5rem'
          }}>
            Widget Title
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter widget title"
          />
        </div>

        {/* Widget Type and Time Range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Widget Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
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
              <option value="metric_card">Metric Card - Single key metric with trend</option>
              <option value="chart">Chart - Visual data representation (bar, line, pie)</option>
              <option value="progress_bar">Progress Bar - Goal tracking with target</option>
              <option value="activity_feed">Activity Feed - Real-time updates and notifications</option>
              <option value="quick_actions">Quick Actions - Fast access buttons</option>
              <option value="table">Table - Detailed data in tabular format</option>
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

        {/* Metric/Field Selection */}
        {renderMetricSelection()}

        {/* Widget Type Specific Options */}
        {renderWidgetTypeOptions()}

        {/* Common Configuration - Only for widgets that need it */}
        {renderCommonConfiguration()}
      </div>
    </div>
  );
};