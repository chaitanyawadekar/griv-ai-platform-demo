import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Widget, WidgetCondition, Theme } from '../../types';
import { DataSourceSelector } from './widget-steps/DataSourceSelector';
import { WidgetTypeSelector } from './widget-steps/WidgetTypeSelector';
import { SimpleConfigurationStep } from './widget-steps/SimpleConfigurationStep';
import { WidgetConditionsStep } from './widget-steps/WidgetConditionsStep';
import { WidgetPreviewStep } from './widget-steps/WidgetPreviewStep';
import { WidgetDataProvider } from '../../utils/widgetDataProvider';
import { theme } from '../../data/theme';

interface AddWidgetModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (widget: Widget) => void;
  theme: Theme;
}

// Enhanced type-specific widget form data
export interface BaseWidgetFormData {
  title: string;
  type: Widget['type'];
  dataSource: 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom';
  conditions: WidgetCondition[];
  conditionLogic: 'AND' | 'OR' | 'CUSTOM';
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';
  customTimeRange?: {
    start: string;
    end: string;
  };
  color?: string;
  icon?: string;
}

export interface MetricCardFormData extends BaseWidgetFormData {
  type: 'metric_card';
  aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  valueField?: string; // Required for sum/avg/min/max/distinct_count
  displayFormat: 'number' | 'currency' | 'percentage' | 'duration';
  showTrend: boolean;
  trendPeriod?: '7d' | '30d' | '90d' | '1y';
}

export interface ChartFormData extends BaseWidgetFormData {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'donut';
  groupBy: string; // Required - categorical field
  aggregation: 'count' | 'sum' | 'avg';
  valueField?: string; // Required for sum/avg
  maxCategories: number;
  sortBy: 'value' | 'label';
  sortOrder: 'asc' | 'desc';
  colorScheme: 'default' | 'status' | 'priority' | 'custom';
  customColors?: string[];
  showLabels: boolean;
  showLegend: boolean;
}

export interface ProgressBarFormData extends BaseWidgetFormData {
  type: 'progress_bar';
  progressType: 'percentage' | 'count' | 'value';
  currentValueAggregation: 'count' | 'sum' | 'avg';
  currentValueField?: string; // Required for sum/avg
  targetValue: number;
  displayFormat: 'percentage' | 'fraction' | 'both';
  showTarget: boolean;
  warningThreshold?: number;
}

export interface ActivityFeedFormData extends BaseWidgetFormData {
  type: 'activity_feed';
  dateField: string; // Required - date field to sort by
  activityTimeRange: '1d' | '7d' | '30d';
  maxItems: number;
  showTimestamps: boolean;
  showAvatars: boolean;
  groupByDate: boolean;
}

export interface TableFormData extends BaseWidgetFormData {
  type: 'table';
  selectedColumns: string[]; // Required - minimum 2, maximum 8
  primaryColumn: string; // Main identifier column
  maxRows: number;
  enableSearch: boolean;
  enableSort: boolean;
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  showRowNumbers: boolean;
  alternateRowColors: boolean;
  compactMode: boolean;
}

export interface QuickActionsFormData extends BaseWidgetFormData {
  type: 'quick_actions';
  actions: {
    label: string;
    icon: string;
    action: 'navigate' | 'modal' | 'external';
    target: string;
    color?: string;
  }[];
  actionStyle: 'buttons' | 'list' | 'grid';
  actionSize: 'small' | 'medium' | 'large';
  showIcons: boolean;
}

// Union type for all widget form data
export type WidgetFormData = 
  | MetricCardFormData 
  | ChartFormData 
  | ProgressBarFormData 
  | ActivityFeedFormData 
  | TableFormData 
  | QuickActionsFormData;

// Legacy support for existing code - simplified interface
export interface LegacyWidgetFormData {
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

const initialFormData: LegacyWidgetFormData = {
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
  const [formData, setFormData] = useState<LegacyWidgetFormData>(initialFormData);
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
    if (currentStep < 5) {
      if (currentStep === 4) {
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

  const getStepTitle = () => {
    const titleStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      color: theme.colors.foreground
    };

    switch (currentStep) {
      case 1:
        return (
          <div style={titleStyle}>
            <Icon name="help-circle" size={20} color={theme.colors.primary} />
            Where should we get this information?
          </div>
        );
      case 2:
        return (
          <div style={titleStyle}>
            <Icon name="layers" size={20} color={theme.colors.primary} />
            What would you like to create?
          </div>
        );
      case 3:
        return (
          <div style={titleStyle}>
            <Icon name="settings" size={20} color={theme.colors.primary} />
            How should we show it?
          </div>
        );
      case 4:
        return (
          <div style={titleStyle}>
            <Icon name="filter" size={20} color={theme.colors.primary} />
            Any filters or conditions?
          </div>
        );
      case 5:
        return (
          <div style={titleStyle}>
            <Icon name="eye" size={20} color={theme.colors.primary} />
            Perfect! Here's your widget
          </div>
        );
      default:
        return `Add New Widget - Step ${currentStep} of 5`;
    }
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
          <WidgetTypeSelector
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 3:
        return (
          <SimpleConfigurationStep
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 4:
        return (
          <WidgetConditionsStep
            formData={formData}
            onChange={setFormData}
            theme={theme}
          />
        );
      case 5:
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
      title={getStepTitle()}
      size="xl"
    >
      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        {[1, 2, 3, 4, 5].map((step) => (
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
            {step < 5 && (
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
          
          {currentStep < 5 ? (
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