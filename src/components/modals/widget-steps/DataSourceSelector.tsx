import React from 'react';
import { Icon } from '../../ui/Icon';
import { Theme } from '../../../types';
import { WidgetDataProvider } from '../../../utils/widgetDataProvider';
import { WidgetFormData } from '../AddWidgetModal';

interface DataSourceSelectorProps {
  formData: WidgetFormData;
  onChange: (formData: WidgetFormData) => void;
  theme: Theme;
}

const getDataSourceInfo = (source: string) => {
  const info = {
    workitems: {
      icon: 'briefcase',
      label: 'Work Items',
      description: 'Tasks, leads, issues, and requests',
      color: '#3b82f6',
      recordCount: WidgetDataProvider.getSampleDataPreview('workitems', 1000).length
    },
    contacts: {
      icon: 'users',
      label: 'Contacts',
      description: 'Customers, leads, and partners',
      color: '#10b981',
      recordCount: WidgetDataProvider.getSampleDataPreview('contacts', 1000).length
    },
    employees: {
      icon: 'user',
      label: 'Employees',
      description: 'Team members and staff',
      color: '#8b5cf6',
      recordCount: WidgetDataProvider.getSampleDataPreview('employees', 1000).length
    },
    sops: {
      icon: 'fileText',
      label: 'SOPs',
      description: 'Standard operating procedures',
      color: '#f59e0b',
      recordCount: WidgetDataProvider.getSampleDataPreview('sops', 1000).length
    },
    custom: {
      icon: 'database',
      label: 'Custom Data',
      description: 'Custom data source',
      color: '#6b7280',
      recordCount: 0
    }
  };
  return info[source as keyof typeof info] || info.workitems;
};

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  formData,
  onChange,
  theme
}) => {
  const handleSourceSelect = (source: string) => {
    onChange({
      ...formData,
      dataSource: source as WidgetFormData['dataSource']
    });
  };

  return (
    <div>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        marginBottom: '0.5rem'
      }}>
        Choose Your Data Source
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: theme.colors.mutedForeground,
        marginBottom: '1.5rem'
      }}>
        Select the data source that your widget will display information from.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {(['workitems', 'contacts', 'employees', 'sops'] as const).map((source) => {
          const info = getDataSourceInfo(source);
          const isSelected = formData.dataSource === source;
          
          return (
            <div
              key={source}
              onClick={() => handleSourceSelect(source)}
              style={{
                padding: '1.5rem',
                border: isSelected 
                  ? `2px solid ${theme.colors.primary}` 
                  : `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                backgroundColor: isSelected 
                  ? `${theme.colors.primary}08` 
                  : theme.colors.background,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = theme.colors.primary + '40';
                  e.currentTarget.style.backgroundColor = theme.colors.muted;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
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
                  backgroundColor: `${info.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name={info.icon as any} size={20} color={info.color} />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {info.label}
                  </h4>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground,
                    margin: '4px 0 0 0'
                  }}>
                    {info.recordCount} records available
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    marginLeft: 'auto',
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
                margin: 0,
                lineHeight: '1.4'
              }}>
                {info.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};