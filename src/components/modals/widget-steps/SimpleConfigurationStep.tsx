import React from 'react';
import { Input } from '../../ui/Input';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { LegacyWidgetFormData } from '../AddWidgetModal';
import { WidgetConfigEngine } from '../../../utils/widgetConfigEngine';
import type { AggregationOption } from '../../../utils/widgetConfigEngine';

interface SimpleConfigurationStepProps {
  formData: LegacyWidgetFormData;
  onChange: (formData: LegacyWidgetFormData) => void;
  theme: Theme;
}

const getWidgetTypeInfo = (type: string) => {
  const info = {
    metric_card: { title: 'Total Count', description: 'Show a single important number' },
    chart: { title: 'Visual Breakdown', description: 'Compare different categories with charts' },
    progress_bar: { title: 'Progress Tracking', description: 'Track completion toward goals' },
    table: { title: 'Detailed List', description: 'See detailed information in rows and columns' },
    activity_feed: { title: 'Recent Activity', description: 'Show latest updates and changes' },
    quick_actions: { title: 'Quick Actions', description: 'Fast access to common tasks' }
  };
  return info[type as keyof typeof info] || info.metric_card;
};

export const SimpleConfigurationStep: React.FC<SimpleConfigurationStepProps> = ({
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

  const configOptions = WidgetConfigEngine.getAvailableOptions(formData.type, formData.dataSource);
  const widgetInfo = getWidgetTypeInfo(formData.type);

  // Get available fields for different purposes
  const getFieldsForSelection = () => {
    const selectedAggregation = configOptions.schema.aggregations.find(
      (agg: AggregationOption) => agg.value === formData.aggregation
    );
    
    // Determine what types of field selection we need
    const showGroupByFields = formData.type === 'chart';
    const showValueFields = selectedAggregation?.requiresField || false;
    const showColumnFields = formData.type === 'table';
    const showDateFields = formData.type === 'activity_feed';
    
    const valueFields = showValueFields 
      ? configOptions.fields
          .filter(field => selectedAggregation!.applicableFieldTypes.includes(field.type))
          .map(field => ({ name: field.name, label: field.label }))
      : [];
    
    const groupByFields = showGroupByFields
      ? configOptions.fields
          .filter(field => field.type === 'categorical')
          .map(field => ({ name: field.name, label: field.label }))
      : [];
      
    const columnFields = showColumnFields
      ? configOptions.fields.map(field => ({ name: field.name, label: field.label }))
      : [];
      
    const dateFields = showDateFields
      ? configOptions.fields
          .filter(field => field.type === 'date')
          .map(field => ({ name: field.name, label: field.label }))
      : [];
    
    return { 
      valueFields, 
      groupByFields, 
      columnFields,
      dateFields,
      showValueFields, 
      showGroupByFields,
      showColumnFields,
      showDateFields
    };
  };

  const fieldSelection = getFieldsForSelection();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* Widget Name */}
        <div style={{
          padding: '1.5rem',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          backgroundColor: theme.colors.background
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icon name="edit" size={18} color={theme.colors.primary} />
            Widget Name
          </h4>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={`My ${widgetInfo.title}`}
            style={{
              width: '100%',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* How to Calculate/Show Data */}
        {['metric_card', 'chart', 'progress_bar'].includes(formData.type) && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="calculator" size={18} color={theme.colors.primary} />
              How to Calculate
            </h4>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {configOptions.schema.aggregations.map((agg: AggregationOption) => (
                <label
                  key={agg.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: formData.aggregation === agg.value
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: formData.aggregation === agg.value
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleChange('aggregation', agg.value)}
                >
                  <input
                    type="radio"
                    name="aggregation"
                    value={agg.value}
                    checked={formData.aggregation === agg.value}
                    onChange={() => handleChange('aggregation', agg.value)}
                    style={{ margin: 0 }}
                  />
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground,
                      marginBottom: '2px'
                    }}>
                      {agg.label}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: theme.colors.mutedForeground
                    }}>
                      {agg.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Group By Field Selection - For charts */}
        {fieldSelection.showGroupByFields && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="layers" size={18} color={theme.colors.primary} />
              How should we group the data?
            </h4>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {fieldSelection.groupByFields.map((field) => (
                <label
                  key={field.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    border: formData.groupBy === field.name
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: formData.groupBy === field.name
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleChange('groupBy', field.name)}
                >
                  <input
                    type="radio"
                    name="groupByField"
                    value={field.name}
                    checked={formData.groupBy === field.name}
                    onChange={() => handleChange('groupBy', field.name)}
                    style={{ margin: 0 }}
                  />
                  {field.label || field.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Value Field Selection - For aggregations that require fields */}
        {fieldSelection.showValueFields && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="target" size={18} color={theme.colors.primary} />
              {formData.type === 'metric_card' ? 'Which field to calculate?' :
               formData.type === 'chart' ? 'Which field to aggregate?' :
               'Which field to track?'}
            </h4>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {fieldSelection.valueFields.map((field) => (
                <label
                  key={field.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    border: formData.selectedFields.includes(field.name)
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: formData.selectedFields.includes(field.name)
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleChange('selectedFields', [field.name])}
                >
                  <input
                    type="radio"
                    name="selectedField"
                    value={field.name}
                    checked={formData.selectedFields.includes(field.name)}
                    onChange={() => handleChange('selectedFields', [field.name])}
                    style={{ margin: 0 }}
                  />
                  {field.label || field.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Column Selection - For tables */}
        {fieldSelection.showColumnFields && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="table" size={18} color={theme.colors.primary} />
              Which columns should we show?
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: theme.colors.mutedForeground,
              margin: '0 0 1rem 0'
            }}>
              Select 2-6 columns for your table
            </p>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {fieldSelection.columnFields.map((field) => (
                <label
                  key={field.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    border: formData.selectedFields.includes(field.name)
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: formData.selectedFields.includes(field.name)
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => {
                    const currentFields = formData.selectedFields || [];
                    const newFields = currentFields.includes(field.name)
                      ? currentFields.filter(f => f !== field.name)
                      : [...currentFields, field.name];
                    handleChange('selectedFields', newFields);
                  }}
                >
                  <input
                    type="checkbox"
                    value={field.name}
                    checked={formData.selectedFields.includes(field.name)}
                    onChange={() => {}}
                    style={{ margin: 0 }}
                  />
                  {field.label || field.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Date Field Selection - For activity feeds */}
        {fieldSelection.showDateFields && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="calendar" size={18} color={theme.colors.primary} />
              Which date field should we use for ordering?
            </h4>
            
            <div style={{ display: 'grid', gap: '8px' }}>
              {fieldSelection.dateFields.map((field) => (
                <label
                  key={field.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    border: formData.selectedFields.includes(field.name)
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: formData.selectedFields.includes(field.name)
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => handleChange('selectedFields', [field.name])}
                >
                  <input
                    type="radio"
                    name="dateField"
                    value={field.name}
                    checked={formData.selectedFields.includes(field.name)}
                    onChange={() => handleChange('selectedFields', [field.name])}
                    style={{ margin: 0 }}
                  />
                  {field.label || field.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Chart Type - Only for charts */}
        {formData.type === 'chart' && (
          <div style={{
            padding: '1.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            backgroundColor: theme.colors.background
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="bar-chart-2" size={18} color={theme.colors.primary} />
              Chart Style
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '12px'
            }}>
              {[
                { value: 'bar', label: 'Bar Chart', icon: 'bar-chart-2' },
                { value: 'pie', label: 'Pie Chart', icon: 'pie-chart' },
                { value: 'line', label: 'Line Chart', icon: 'trending-up' },
                { value: 'donut', label: 'Donut', icon: 'circle' }
              ].map((chartType) => (
                <button
                  key={chartType.value}
                  onClick={() => handleChange('chartType', chartType.value)}
                  style={{
                    padding: '12px 8px',
                    border: formData.chartType === chartType.value
                      ? `2px solid ${theme.colors.primary}`
                      : `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: formData.chartType === chartType.value
                      ? `${theme.colors.primary}08`
                      : theme.colors.background,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: theme.colors.foreground,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon name={chartType.icon as any} size={16} color={theme.colors.foreground} />
                  {chartType.label}
                </button>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};