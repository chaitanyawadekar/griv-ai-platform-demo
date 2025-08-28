import React from 'react';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { WidgetFormData } from '../AddWidgetModal';

interface WidgetPreviewStepProps {
  formData: WidgetFormData;
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
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        marginBottom: '0.5rem'
      }}>
        Review & Preview
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: theme.colors.mutedForeground,
        marginBottom: '1.5rem'
      }}>
        Review your widget configuration and see a preview before creating it.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Configuration Summary */}
        <div style={{
          backgroundColor: theme.colors.secondary,
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '1rem'
          }}>
            Configuration Summary
          </h4>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Data Source:</span>
              <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                {dataSourceInfo.label}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Widget Type:</span>
              <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                {formData.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Time Range:</span>
              <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                {formData.timeRange === '7d' ? 'Last 7 days' : 
                 formData.timeRange === '30d' ? 'Last 30 days' :
                 formData.timeRange === '90d' ? 'Last 90 days' :
                 formData.timeRange === '1y' ? 'Last year' : 'All time'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Record Limit:</span>
              <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                {formData.limit}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Aggregation:</span>
              <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                {formData.aggregation.charAt(0).toUpperCase() + formData.aggregation.slice(1)}
              </span>
            </div>
            
            {formData.type === 'chart' && formData.chartType && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Chart Type:</span>
                <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                  {formData.chartType.charAt(0).toUpperCase() + formData.chartType.slice(1)} Chart
                </span>
              </div>
            )}
            
            {formData.conditions.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Filters Applied:</span>
                <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                  {formData.conditions.length} condition{formData.conditions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            {formData.selectedFields.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: theme.colors.mutedForeground, fontSize: '0.875rem' }}>Selected Fields:</span>
                <span style={{ color: theme.colors.foreground, fontSize: '0.875rem', fontWeight: '500' }}>
                  {formData.selectedFields.length} field{formData.selectedFields.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Widget Preview */}
        <div style={{
          backgroundColor: theme.colors.card,
          padding: '1.5rem',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '1rem'
          }}>
            Widget Preview
          </h4>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: theme.colors.background,
            borderRadius: '6px',
            border: `1px solid ${theme.colors.border}`,
            marginBottom: '1rem'
          }}>
            <div style={{
              backgroundColor: widgetDefaults.color + '20',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Icon name={widgetDefaults.icon} size={20} color={widgetDefaults.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                marginBottom: '4px'
              }}>
                {formData.title || `New ${formData.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: theme.colors.mutedForeground
              }}>
                {dataSourceInfo.label} • {formData.aggregation}
              </div>
            </div>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: widgetDefaults.color + '10',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: widgetDefaults.color,
              fontWeight: '600'
            }}>
              {formData.type.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          {/* Sample Data Preview */}
          {previewData.length > 0 && (
            <div>
              <h5 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Sample Data Preview (First 5 records)
              </h5>
              <div style={{
                backgroundColor: theme.colors.secondary,
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${theme.colors.border}`,
                fontSize: '0.75rem',
                color: theme.colors.mutedForeground,
                fontFamily: 'monospace',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {/* Expected Widget Size */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: theme.colors.muted,
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: theme.colors.mutedForeground
          }}>
            <strong>Expected Grid Size:</strong>{' '}
            {(() => {
              switch (formData.type) {
                case 'metric_card':
                case 'progress_bar':
                  return 'Small (3 columns × 1 row)';
                case 'chart':
                case 'activity_feed':
                case 'table':
                  return 'Large (6 columns × 2 rows)';
                case 'quick_actions':
                  return 'Medium (4 columns × 1 row)';
                default:
                  return 'Small (3 columns × 1 row)';
              }
            })()}
          </div>
        </div>

        {/* Ready to Create */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          backgroundColor: theme.colors.primary + '05',
          borderRadius: '8px',
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
            fontSize: '1rem',
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
            Your widget is configured and ready to be added to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};