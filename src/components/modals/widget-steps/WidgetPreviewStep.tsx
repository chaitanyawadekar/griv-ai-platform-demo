import React from 'react';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { LegacyWidgetFormData } from '../AddWidgetModal';

interface WidgetPreviewStepProps {
  formData: LegacyWidgetFormData;
  previewData: any[];
  theme: Theme;
}

const getDataSourceInfo = (source: string) => {
  const info = {
    workitems: { label: 'Work Items' },
    contacts: { label: 'Contacts' },
    employees: { label: 'Employees' },
    sops: { label: 'SOPs' },
    custom: { label: 'Custom Data' }
  };
  return info[source as keyof typeof info] || info.workitems;
};

export const WidgetPreviewStep: React.FC<WidgetPreviewStepProps> = ({
  formData,
  previewData,
  theme
}) => {
  const dataSourceInfo = getDataSourceInfo(formData.dataSource);

  const getWidgetDefaults = (type: string, dataSource: string) => {
    const defaults = {
      metric_card: { color: '#3b82f6', icon: 'trending-up' },
      chart: { color: '#10b981', icon: 'bar-chart-2' },
      progress_bar: { color: '#f59e0b', icon: 'activity' },
      activity_feed: { color: '#8b5cf6', icon: 'clock' },
      quick_actions: { color: '#ef4444', icon: 'zap' },
      table: { color: '#6366f1', icon: 'table' }
    };
    
    const dataSourceIcons = {
      workitems: 'briefcase',
      contacts: 'users',
      employees: 'user',
      sops: 'file-text',
      custom: 'database'
    };

    return {
      color: defaults[type as keyof typeof defaults]?.color || defaults.metric_card.color,
      icon: dataSourceIcons[dataSource as keyof typeof dataSourceIcons] || defaults[type as keyof typeof defaults]?.icon || 'briefcase'
    };
  };

  const widgetDefaults = getWidgetDefaults(formData.type, formData.dataSource);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Configuration Summary */}
        <div style={{
          backgroundColor: theme.colors.secondary,
          padding: '1.5rem',
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icon name="list" size={18} color={theme.colors.primary} />
            Configuration Summary
          </h4>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Data Source */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: theme.colors.background,
              borderRadius: '8px'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500',
                color: theme.colors.mutedForeground 
              }}>
                Data Source:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: theme.colors.foreground 
              }}>
                {dataSourceInfo.label}
              </span>
            </div>

            {/* Widget Type */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: theme.colors.background,
              borderRadius: '8px'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500',
                color: theme.colors.mutedForeground 
              }}>
                Widget Type:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: theme.colors.foreground 
              }}>
                {formData.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            {/* Aggregation Method */}
            {formData.aggregation && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: theme.colors.mutedForeground 
                }}>
                  Calculation:
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: theme.colors.foreground 
                }}>
                  {formData.aggregation === 'count' ? 'Total count' : 
                   formData.aggregation === 'sum' ? 'Sum of values' :
                   formData.aggregation === 'avg' ? 'Average value' : 
                   formData.aggregation.charAt(0).toUpperCase() + formData.aggregation.slice(1)}
                </span>
              </div>
            )}

            {/* Selected Fields */}
            {formData.selectedFields && formData.selectedFields.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: theme.colors.mutedForeground 
                }}>
                  {formData.type === 'table' ? 'Columns:' : 
                   formData.type === 'chart' && formData.groupBy ? 'Group by:' : 'Fields:'}
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: theme.colors.foreground 
                }}>
                  {formData.selectedFields.slice(0, 3).join(', ')}
                  {formData.selectedFields.length > 3 && ` +${formData.selectedFields.length - 3} more`}
                </span>
              </div>
            )}

            {/* Group By Field */}
            {formData.groupBy && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: theme.colors.mutedForeground 
                }}>
                  Group By:
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: theme.colors.foreground 
                }}>
                  {formData.groupBy}
                </span>
              </div>
            )}

            {/* Chart Type */}
            {formData.type === 'chart' && formData.chartType && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: theme.colors.mutedForeground 
                }}>
                  Chart Style:
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: theme.colors.foreground 
                }}>
                  {formData.chartType.charAt(0).toUpperCase() + formData.chartType.slice(1)} Chart
                </span>
              </div>
            )}

            {/* Time Range */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: theme.colors.background,
              borderRadius: '8px'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500',
                color: theme.colors.mutedForeground 
              }}>
                Time Period:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600',
                color: theme.colors.foreground 
              }}>
                {formData.timeRange === '7d' ? 'Last 7 days' : 
                 formData.timeRange === '30d' ? 'Last 30 days' :
                 formData.timeRange === '90d' ? 'Last 90 days' :
                 formData.timeRange === '1y' ? 'Last year' : 'All time'}
              </span>
            </div>

            {/* Conditions */}
            {formData.conditions && formData.conditions.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: theme.colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: theme.colors.mutedForeground 
                }}>
                  Filters Applied:
                </span>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: theme.colors.foreground 
                }}>
                  {formData.conditions.length} condition{formData.conditions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ready to Create */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          backgroundColor: theme.colors.primary + '05',
          borderRadius: '12px',
          border: `1px dashed ${theme.colors.primary}`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: theme.colors.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Icon name="check" size={24} color="white" />
          </div>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: '0 0 0.5rem 0'
          }}>
            Ready to Create!
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
            margin: 0
          }}>
            Click "Create Widget" to add this to your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};