import { Widget } from '../types';

// Enhanced widget configuration types
export type WidgetType = Widget['type'];
export type DataSourceType = 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom';

export interface FieldInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'text' | 'boolean';
  label: string;
  description?: string;
  sampleValues?: any[];
  isRequired?: boolean;
}

export interface AggregationOption {
  value: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';
  label: string;
  description: string;
  requiresField: boolean;
  applicableFieldTypes: FieldInfo['type'][];
}

export interface WidgetSuggestion {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
  config: Partial<any>; // Partial widget config
  previewValue?: string | number;
}

export interface WidgetConfigSchema {
  requiredFields: string[];
  optionalFields: string[];
  conditionalFields: Record<string, string[]>; // field -> dependent fields
  
  // Widget capabilities
  requiresAggregation: boolean;
  requiresGroupBy: boolean;
  requiresTimeRange: boolean;
  supportsFiltering: boolean;
  supportsMultipleMetrics: boolean;
  
  // Available options
  aggregations: AggregationOption[];
  chartTypes?: string[];
  displayFormats?: string[];
}

export class WidgetConfigEngine {
  
  /**
   * Get configuration options for a specific widget type and data source
   */
  static getAvailableOptions(widgetType: WidgetType, dataSource: DataSourceType) {
    const schema = this.getWidgetSchema(widgetType);
    const fields = this.getDataSourceFields(dataSource);
    const suggestions = this.generateSmartSuggestions(widgetType, dataSource, fields);
    
    return {
      schema,
      fields,
      suggestions,
      applicableAggregations: this.getApplicableAggregations(widgetType, fields),
      applicableGroupByFields: fields.filter(f => f.type === 'categorical'),
      applicableValueFields: fields.filter(f => f.type === 'numeric')
    };
  }
  
  /**
   * Get widget schema defining what configuration options are available
   */
  private static getWidgetSchema(widgetType: WidgetType): WidgetConfigSchema {
    const schemas: Record<WidgetType, WidgetConfigSchema> = {
      metric_card: {
        requiredFields: ['title', 'dataSource', 'aggregation'],
        optionalFields: ['displayFormat', 'showTrend', 'trendPeriod', 'color', 'icon'],
        conditionalFields: {
          'aggregation': ['valueField'], // sum/avg/min/max require valueField
          'showTrend': ['trendPeriod']
        },
        requiresAggregation: true,
        requiresGroupBy: false,
        requiresTimeRange: false,
        supportsFiltering: true,
        supportsMultipleMetrics: false,
        aggregations: [
          {
            value: 'count',
            label: 'Count',
            description: 'Total number of records',
            requiresField: false,
            applicableFieldTypes: []
          },
          {
            value: 'sum',
            label: 'Sum',
            description: 'Add up numeric values',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          },
          {
            value: 'avg',
            label: 'Average',
            description: 'Calculate mean value',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          },
          {
            value: 'min',
            label: 'Minimum',
            description: 'Lowest value',
            requiresField: true,
            applicableFieldTypes: ['numeric', 'date']
          },
          {
            value: 'max',
            label: 'Maximum',
            description: 'Highest value',
            requiresField: true,
            applicableFieldTypes: ['numeric', 'date']
          },
          {
            value: 'distinct_count',
            label: 'Unique Count',
            description: 'Count of unique values',
            requiresField: true,
            applicableFieldTypes: ['text', 'categorical']
          }
        ],
        displayFormats: ['number', 'currency', 'percentage', 'duration']
      },
      
      chart: {
        requiredFields: ['title', 'dataSource', 'chartType', 'groupBy', 'aggregation'],
        optionalFields: ['valueField', 'maxCategories', 'sortBy', 'sortOrder', 'colorScheme'],
        conditionalFields: {
          'aggregation': ['valueField'],
          'chartType': ['colorScheme']
        },
        requiresAggregation: true,
        requiresGroupBy: true,
        requiresTimeRange: false,
        supportsFiltering: true,
        supportsMultipleMetrics: false,
        aggregations: [
          {
            value: 'count',
            label: 'Count',
            description: 'Count records per category',
            requiresField: false,
            applicableFieldTypes: []
          },
          {
            value: 'sum',
            label: 'Sum',
            description: 'Sum values per category',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          },
          {
            value: 'avg',
            label: 'Average',
            description: 'Average values per category',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          }
        ],
        chartTypes: ['bar', 'line', 'pie', 'area', 'donut']
      },
      
      progress_bar: {
        requiredFields: ['title', 'dataSource', 'progressType', 'currentValueAggregation', 'targetValue'],
        optionalFields: ['currentValueField', 'displayFormat', 'warningThreshold', 'color'],
        conditionalFields: {
          'currentValueAggregation': ['currentValueField'],
          'progressType': ['displayFormat']
        },
        requiresAggregation: true,
        requiresGroupBy: false,
        requiresTimeRange: false,
        supportsFiltering: true,
        supportsMultipleMetrics: false,
        aggregations: [
          {
            value: 'count',
            label: 'Count',
            description: 'Count of records',
            requiresField: false,
            applicableFieldTypes: []
          },
          {
            value: 'sum',
            label: 'Sum',
            description: 'Sum of values',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          },
          {
            value: 'avg',
            label: 'Average',
            description: 'Average value',
            requiresField: true,
            applicableFieldTypes: ['numeric']
          }
        ],
        displayFormats: ['percentage', 'fraction', 'both']
      },
      
      activity_feed: {
        requiredFields: ['title', 'dataSource', 'dateField', 'timeRange'],
        optionalFields: ['maxItems', 'showTimestamps', 'showAvatars', 'groupByDate'],
        conditionalFields: {},
        requiresAggregation: false,
        requiresGroupBy: false,
        requiresTimeRange: true,
        supportsFiltering: true,
        supportsMultipleMetrics: false,
        aggregations: []
      },
      
      table: {
        requiredFields: ['title', 'dataSource', 'selectedColumns'],
        optionalFields: ['maxRows', 'enableSearch', 'enableSort', 'defaultSort', 'showRowNumbers'],
        conditionalFields: {
          'enableSort': ['defaultSort']
        },
        requiresAggregation: false,
        requiresGroupBy: false,
        requiresTimeRange: false,
        supportsFiltering: true,
        supportsMultipleMetrics: false,
        aggregations: []
      },
      
      quick_actions: {
        requiredFields: ['title', 'actions'],
        optionalFields: ['actionStyle', 'actionSize', 'showIcons'],
        conditionalFields: {},
        requiresAggregation: false,
        requiresGroupBy: false,
        requiresTimeRange: false,
        supportsFiltering: false,
        supportsMultipleMetrics: false,
        aggregations: []
      }
    };
    
    return schemas[widgetType];
  }
  
  /**
   * Analyze data source and return typed field information
   */
  private static getDataSourceFields(dataSource: DataSourceType): FieldInfo[] {
    const fieldDefinitions: Record<DataSourceType, FieldInfo[]> = {
      workitems: [
        {
          name: 'id',
          type: 'numeric',
          label: 'Workitem ID',
          description: 'Unique identifier'
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          description: 'Workitem title'
        },
        {
          name: 'type',
          type: 'categorical',
          label: 'Type',
          description: 'Workitem type',
          sampleValues: ['Lead', 'Task', 'Grievance', 'Follow-up']
        },
        {
          name: 'status',
          type: 'categorical',
          label: 'Status',
          description: 'Current status',
          sampleValues: ['Open', 'In Progress', 'Completed', 'Closed']
        },
        {
          name: 'priority',
          type: 'categorical',
          label: 'Priority',
          description: 'Priority level',
          sampleValues: ['Low', 'Medium', 'High', 'Critical']
        },
        {
          name: 'assignee',
          type: 'categorical',
          label: 'Assignee',
          description: 'Assigned person'
        },
        {
          name: 'department',
          type: 'categorical',
          label: 'Department',
          description: 'Responsible department',
          sampleValues: ['Sales', 'Support', 'Marketing', 'Engineering']
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Created Date',
          description: 'When the workitem was created'
        },
        {
          name: 'dueDate',
          type: 'date',
          label: 'Due Date',
          description: 'When the workitem is due'
        },
        {
          name: 'tags',
          type: 'text',
          label: 'Tags',
          description: 'Associated tags'
        }
      ],
      
      contacts: [
        {
          name: 'id',
          type: 'numeric',
          label: 'Contact ID',
          description: 'Unique identifier'
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          description: 'Contact name'
        },
        {
          name: 'type',
          type: 'categorical',
          label: 'Type',
          description: 'Contact type',
          sampleValues: ['Customer', 'Lead', 'Partner', 'Vendor']
        },
        {
          name: 'status',
          type: 'categorical',
          label: 'Status',
          description: 'Contact status',
          sampleValues: ['Active', 'Inactive']
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          description: 'Email address'
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          description: 'Phone number'
        },
        {
          name: 'location',
          type: 'categorical',
          label: 'Location',
          description: 'Geographic location'
        },
        {
          name: 'lastContact',
          type: 'date',
          label: 'Last Contact',
          description: 'Date of last interaction'
        },
        {
          name: 'tags',
          type: 'text',
          label: 'Tags',
          description: 'Associated tags'
        }
      ],
      
      employees: [
        {
          name: 'id',
          type: 'numeric',
          label: 'Employee ID',
          description: 'Unique identifier'
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          description: 'Employee name'
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          description: 'Email address'
        },
        {
          name: 'department',
          type: 'categorical',
          label: 'Department',
          description: 'Employee department',
          sampleValues: ['Sales', 'Support', 'Engineering', 'Marketing', 'HR']
        },
        {
          name: 'role',
          type: 'categorical',
          label: 'Role',
          description: 'Job role'
        },
        {
          name: 'status',
          type: 'categorical',
          label: 'Status',
          description: 'Employment status',
          sampleValues: ['Active', 'Inactive']
        },
        {
          name: 'joinDate',
          type: 'date',
          label: 'Join Date',
          description: 'Date of joining'
        }
      ],
      
      sops: [
        {
          name: 'id',
          type: 'text',
          label: 'SOP ID',
          description: 'Unique identifier'
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          description: 'SOP name'
        },
        {
          name: 'appliesTo',
          type: 'categorical',
          label: 'Applies To',
          description: 'What this SOP applies to',
          sampleValues: ['workitem', 'contact']
        },
        {
          name: 'status',
          type: 'categorical',
          label: 'Status',
          description: 'SOP status',
          sampleValues: ['active', 'draft', 'archived']
        },
        {
          name: 'version',
          type: 'text',
          label: 'Version',
          description: 'Version number'
        },
        {
          name: 'createdBy',
          type: 'categorical',
          label: 'Created By',
          description: 'Author'
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Created Date',
          description: 'Creation date'
        }
      ],
      
      custom: []
    };
    
    return fieldDefinitions[dataSource] || [];
  }
  
  /**
   * Generate smart widget suggestions based on type and data source
   */
  private static generateSmartSuggestions(
    widgetType: WidgetType, 
    dataSource: DataSourceType, 
    fields: FieldInfo[]
  ): WidgetSuggestion[] {
    const suggestions: Record<string, WidgetSuggestion[]> = {
      [`metric_card-workitems`]: [
        {
          id: 'total-workitems',
          title: 'Total Workitems',
          description: 'Count of all workitems',
          recommended: true,
          config: {
            aggregation: 'count',
            displayFormat: 'number',
            showTrend: true,
            icon: 'briefcase'
          },
          previewValue: '247'
        },
        {
          id: 'high-priority',
          title: 'High Priority Items',
          description: 'Count of high priority workitems',
          recommended: true,
          config: {
            aggregation: 'count',
            conditions: [{ field: 'priority', operator: 'equals', value: 'High' }],
            displayFormat: 'number',
            showTrend: true,
            icon: 'alert-triangle',
            color: '#ef4444'
          },
          previewValue: '23'
        },
        {
          id: 'open-items',
          title: 'Open Items',
          description: 'Count of open workitems',
          recommended: false,
          config: {
            aggregation: 'count',
            conditions: [{ field: 'status', operator: 'equals', value: 'Open' }],
            displayFormat: 'number',
            icon: 'circle'
          },
          previewValue: '89'
        }
      ],
      
      [`metric_card-contacts`]: [
        {
          id: 'total-contacts',
          title: 'Total Contacts',
          description: 'Count of all contacts',
          recommended: true,
          config: {
            aggregation: 'count',
            displayFormat: 'number',
            showTrend: true,
            icon: 'users'
          },
          previewValue: '1,342'
        },
        {
          id: 'active-contacts',
          title: 'Active Contacts',
          description: 'Count of active contacts',
          recommended: true,
          config: {
            aggregation: 'count',
            conditions: [{ field: 'status', operator: 'equals', value: 'Active' }],
            displayFormat: 'number',
            showTrend: true,
            icon: 'user-check',
            color: '#10b981'
          },
          previewValue: '1,205'
        },
        {
          id: 'unique-locations',
          title: 'Unique Locations',
          description: 'Count of distinct locations',
          recommended: false,
          config: {
            aggregation: 'distinct_count',
            valueField: 'location',
            displayFormat: 'number',
            icon: 'map-pin'
          },
          previewValue: '47'
        }
      ],
      
      [`chart-workitems`]: [
        {
          id: 'status-breakdown',
          title: 'Status Breakdown',
          description: 'Workitems grouped by status',
          recommended: true,
          config: {
            chartType: 'pie',
            groupBy: 'status',
            aggregation: 'count',
            colorScheme: 'status'
          }
        },
        {
          id: 'priority-distribution',
          title: 'Priority Distribution',
          description: 'Workitems grouped by priority',
          recommended: true,
          config: {
            chartType: 'bar',
            groupBy: 'priority',
            aggregation: 'count',
            colorScheme: 'priority'
          }
        },
        {
          id: 'department-workload',
          title: 'Department Workload',
          description: 'Workitems per department',
          recommended: false,
          config: {
            chartType: 'bar',
            groupBy: 'department',
            aggregation: 'count',
            sortBy: 'value',
            sortOrder: 'desc'
          }
        }
      ]
    };
    
    const key = `${widgetType}-${dataSource}`;
    return suggestions[key] || [];
  }
  
  /**
   * Get aggregation options applicable to a widget type and available fields
   */
  private static getApplicableAggregations(widgetType: WidgetType, fields: FieldInfo[]): AggregationOption[] {
    const schema = this.getWidgetSchema(widgetType);
    const numericFields = fields.filter(f => f.type === 'numeric');
    const hasNumericFields = numericFields.length > 0;
    
    return schema.aggregations.filter(agg => {
      // If aggregation requires a field but no applicable fields exist, hide it
      if (agg.requiresField && !hasNumericFields && agg.applicableFieldTypes.includes('numeric')) {
        return false;
      }
      return true;
    });
  }
  
  /**
   * Validate widget configuration
   */
  static validateConfiguration(widgetType: WidgetType, config: any): string[] {
    const errors: string[] = [];
    const schema = this.getWidgetSchema(widgetType);
    
    // Check required fields
    schema.requiredFields.forEach(field => {
      if (!config[field] || (typeof config[field] === 'string' && config[field].trim() === '')) {
        errors.push(`${field} is required`);
      }
    });
    
    // Check conditional fields
    Object.entries(schema.conditionalFields).forEach(([parentField, dependentFields]) => {
      if (config[parentField]) {
        const aggregation = schema.aggregations.find(a => a.value === config[parentField]);
        if (aggregation?.requiresField) {
          dependentFields.forEach(depField => {
            if (!config[depField]) {
              errors.push(`${depField} is required when ${parentField} is ${config[parentField]}`);
            }
          });
        }
      }
    });
    
    return errors;
  }
  
  /**
   * Get default configuration for a widget type
   */
  static getDefaultConfig(widgetType: WidgetType, dataSource: DataSourceType): any {
    const suggestions = this.generateSmartSuggestions(widgetType, dataSource, this.getDataSourceFields(dataSource));
    const recommended = suggestions.find(s => s.recommended);
    
    if (recommended) {
      return {
        title: recommended.title,
        ...recommended.config
      };
    }
    
    // Fallback defaults
    const defaults: Record<WidgetType, any> = {
      metric_card: {
        aggregation: 'count',
        displayFormat: 'number',
        showTrend: false
      },
      chart: {
        chartType: 'bar',
        aggregation: 'count',
        maxCategories: 10,
        sortBy: 'value',
        sortOrder: 'desc'
      },
      progress_bar: {
        progressType: 'percentage',
        currentValueAggregation: 'count',
        targetValue: 100,
        displayFormat: 'percentage'
      },
      activity_feed: {
        timeRange: '7d',
        maxItems: 10,
        showTimestamps: true,
        groupByDate: false
      },
      table: {
        maxRows: 20,
        enableSearch: true,
        enableSort: true,
        showRowNumbers: false
      },
      quick_actions: {
        actionStyle: 'buttons',
        actionSize: 'medium',
        showIcons: true,
        actions: []
      }
    };
    
    return defaults[widgetType] || {};
  }
}