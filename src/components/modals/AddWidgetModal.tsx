import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Widget, WidgetCondition, Theme } from '../../types';
import { DataSourceSelector } from './widget-steps/DataSourceSelector';
import { WidgetConfigurationStep } from './widget-steps/WidgetConfigurationStep';
import { WidgetConditionsStep } from './widget-steps/WidgetConditionsStep';
import { WidgetPreviewStep } from './widget-steps/WidgetPreviewStep';
import { WidgetDataProvider } from '../../utils/widgetDataProvider';

interface AddWidgetModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (widget: Widget) => void;
  theme: Theme;
}

export interface WidgetFormData {
  title: string;
  type: Widget['type'];
  dataSource: 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom';
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  conditions: WidgetCondition[];
  conditionLogic: 'AND' | 'OR' | 'CUSTOM';
  aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  groupBy: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  selectedFields: string[];
  
  // Widget type-specific fields
  showTrend?: boolean;
  displayFormat?: 'number' | 'currency' | 'percentage' | 'duration';
  progressTarget?: number;
  progressType?: 'percentage' | 'count' | 'value';
  refreshInterval?: '1m' | '5m' | '15m' | '30m' | '1h';
  activityType?: 'recent' | 'updates' | 'alerts' | 'assignments';
  chartSize?: 'small' | 'medium' | 'large';
  rowsPerPage?: number;
  enableSearch?: boolean;
  actionStyle?: 'buttons' | 'list' | 'cards';
  maxActions?: number;
}

const initialFormData: WidgetFormData = {
  title: '',
  type: 'metric_card',
  dataSource: 'workitems',
  chartType: 'bar',
  timeRange: '7d',
  conditions: [],
  conditionLogic: 'AND',
  aggregation: 'count',
  groupBy: '',
  sortBy: '',
  sortOrder: 'desc',
  limit: 100,
  selectedFields: []
};

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  show,
  onClose,
  onCreate,
  theme
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WidgetFormData>(initialFormData);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setPreviewData([]);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 3) {
        generatePreviewData();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePreviewData = () => {
    const widgetDefaults = getWidgetDefaults(formData.type, formData.dataSource);
    const mockWidget: Widget = {
      id: 'preview',
      title: formData.title || 'Preview Widget',
      type: formData.type,
      position: { x: 0, y: 0, w: 1, h: 1 },
      dataSource: {
        type: formData.dataSource,
        conditions: formData.conditions,
        conditionLogic: formData.conditionLogic,
        aggregation: formData.aggregation,
        timeRange: formData.timeRange,
        limit: Math.min(formData.limit, 10)
      },
      config: {
        chartType: formData.chartType,
        showTrend: formData.showTrend,
        color: widgetDefaults.color,
        icon: widgetDefaults.icon
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    const data = WidgetDataProvider.getWidgetData(mockWidget);
    setPreviewData(data.filteredData.slice(0, 5));
    return data;
  };

  const getWidgetDefaults = (type: Widget['type'], dataSource: string) => {
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
      color: defaults[type]?.color || defaults.metric_card.color,
      icon: dataSourceIcons[dataSource as keyof typeof dataSourceIcons] || defaults[type]?.icon || 'briefcase'
    };
  };

  const handleCreate = () => {
    // Determine grid size based on widget type
    let width = 3;
    let height = 1;
    
    switch (formData.type) {
      case 'metric_card':
      case 'progress_bar':
        width = 3;
        height = 1;
        break;
      case 'chart':
      case 'activity_feed':
      case 'table':
        width = 6;
        height = 2;
        break;
      case 'quick_actions':
        width = 4;
        height = 1;
        break;
      default:
        width = 3;
        height = 1;
    }

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      title: formData.title || `New ${formData.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      type: formData.type,
      position: { x: 0, y: 0, w: width, h: height },
      dataSource: {
        type: formData.dataSource,
        conditions: formData.conditions,
        conditionLogic: formData.conditionLogic,
        aggregation: formData.aggregation,
        timeRange: formData.timeRange,
        groupBy: formData.groupBy || undefined,
        sortBy: formData.sortBy || undefined,
        sortOrder: formData.sortOrder,
        limit: formData.limit
      },
      config: {
        chartType: formData.type === 'chart' ? formData.chartType : undefined,
        showTrend: formData.showTrend,
        displayFormat: formData.displayFormat,
        progressTarget: formData.progressTarget,
        progressType: formData.progressType,
        refreshInterval: formData.refreshInterval === '1m' ? 1 : 
                        formData.refreshInterval === '5m' ? 5 :
                        formData.refreshInterval === '15m' ? 15 :
                        formData.refreshInterval === '30m' ? 30 :
                        formData.refreshInterval === '1h' ? 60 : 15,
        activityType: formData.activityType,
        ...getWidgetDefaults(formData.type, formData.dataSource)
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onCreate(newWidget);
    handleClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataSourceSelector
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 2:
        return (
          <WidgetConfigurationStep
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 3:
        return (
          <WidgetConditionsStep
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 4:
        return (
          <WidgetPreviewStep
            formData={formData}
            previewData={previewData}
            theme={theme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      title={`Add New Widget - Step ${currentStep} of 4`}
      size="xl"
    >
      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step <= currentStep ? theme.colors.primary : theme.colors.muted,
              color: step <= currentStep ? 'white' : theme.colors.mutedForeground,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {step}
            </div>
            {step < 4 && (
              <div style={{
                flex: 1,
                height: '2px',
                backgroundColor: step < currentStep ? theme.colors.primary : theme.colors.border,
                margin: '0 1rem'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ minHeight: '400px', padding: '0 1rem' }}>
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'space-between',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${theme.colors.border}`,
        margin: '0 1rem'
      }}>
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              <Icon name="chevronLeft" size={14} color={theme.colors.foreground} />
              Previous
            </Button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <Icon name="chevronRight" size={14} color="white" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Icon name="plus" size={14} color="white" />
              Create Widget
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};