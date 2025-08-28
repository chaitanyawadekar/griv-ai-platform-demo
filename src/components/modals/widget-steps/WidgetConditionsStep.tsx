import React from 'react';
import { Theme } from '../../../types';
import { ConditionBuilder } from '../../ui/ConditionBuilder';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { WidgetFormData } from '../AddWidgetModal';

interface WidgetConditionsStepProps {
  formData: WidgetFormData;
  onChange: (formData: WidgetFormData) => void;
  theme: Theme;
}

export const WidgetConditionsStep: React.FC<WidgetConditionsStepProps> = ({
  formData,
  onChange,
  theme
}) => {
  const handleConditionsChange = (conditions: any[]) => {
    onChange({
      ...formData,
      conditions
    });
  };

  const handleLogicChange = (conditionLogic: 'AND' | 'OR' | 'CUSTOM') => {
    onChange({
      ...formData,
      conditionLogic
    });
  };

  const handleFieldSelectionChange = (field: string, checked: boolean) => {
    const updatedFields = checked 
      ? [...formData.selectedFields, field]
      : formData.selectedFields.filter(f => f !== field);
    
    onChange({
      ...formData,
      selectedFields: updatedFields
    });
  };

  const handleSortChange = (field: keyof WidgetFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const availableFields = WidgetDataProvider.getAvailableFields(formData.dataSource);

  return (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        marginBottom: '0.5rem'
      }}>
        Configure Data & Conditions
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: theme.colors.mutedForeground,
        marginBottom: '1.5rem'
      }}>
        Set up data filters and field selections for your widget.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>

        {/* Advanced Configuration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Sort By
            </label>
            <select
              value={formData.sortBy}
              onChange={(e) => handleSortChange('sortBy', e.target.value)}
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
              <option value="">No sorting</option>
              {availableFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
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
              Sort Order
            </label>
            <select
              value={formData.sortOrder}
              onChange={(e) => handleSortChange('sortOrder', e.target.value)}
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
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Group By (for charts) */}
        {formData.type === 'chart' && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Group By (for chart visualization)
            </label>
            <select
              value={formData.groupBy}
              onChange={(e) => handleSortChange('groupBy', e.target.value)}
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
              <option value="">No grouping</option>
              {availableFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        )}

        {/* Data Conditions */}
        <div>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            marginBottom: '0.75rem'
          }}>
            Data Filters
          </h4>
          <ConditionBuilder
            theme={theme}
            dataSourceType={formData.dataSource}
            conditions={formData.conditions}
            onChange={handleConditionsChange}
            conditionLogic={formData.conditionLogic}
            onLogicChange={handleLogicChange}
          />
        </div>

        {/* Filter Summary */}
        {formData.conditions.length > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '6px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h5 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Active Filters Summary
            </h5>
            <p style={{
              fontSize: '0.75rem',
              color: theme.colors.mutedForeground,
              margin: 0
            }}>
              {formData.conditions.length} filter{formData.conditions.length !== 1 ? 's' : ''} applied using {formData.conditionLogic} logic
            </p>
          </div>
        )}
      </div>
    </div>
  );
};