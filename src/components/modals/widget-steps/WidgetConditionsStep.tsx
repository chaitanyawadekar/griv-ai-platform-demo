import React from 'react';
import { Theme } from '../../../types';
import { ConditionBuilder } from '../../ui/ConditionBuilder';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { LegacyWidgetFormData } from '../AddWidgetModal';

interface WidgetConditionsStepProps {
  formData: LegacyWidgetFormData;
  onChange: (formData: LegacyWidgetFormData) => void;
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

  const handleSortChange = (field: keyof LegacyWidgetFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const availableFields = WidgetDataProvider.getAvailableFields(formData.dataSource);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      <div style={{ display: 'grid', gap: '2rem' }}>

        {/* Time Range - Moved from Step 3 */}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={theme.colors.primary} strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke={theme.colors.primary} strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke={theme.colors.primary} strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke={theme.colors.primary} strokeWidth="2"/>
            </svg>
            Time Period
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
            margin: '0 0 1rem 0'
          }}>
            How far back should we look for data?
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px'
          }}>
            {[
              { value: '7d', label: 'Last Week' },
              { value: '30d', label: 'Last Month' },
              { value: '90d', label: '3 Months' },
              { value: '1y', label: 'Last Year' },
              { value: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ ...formData, timeRange: option.value as LegacyWidgetFormData['timeRange'] })}
                style={{
                  padding: '8px 12px',
                  border: formData.timeRange === option.value
                    ? `2px solid ${theme.colors.primary}`
                    : `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: formData.timeRange === option.value
                    ? `${theme.colors.primary}20`
                    : theme.colors.background,
                  color: formData.timeRange === option.value
                    ? theme.colors.primary
                    : theme.colors.foreground,
                  fontSize: '0.875rem',
                  fontWeight: formData.timeRange === option.value ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>


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