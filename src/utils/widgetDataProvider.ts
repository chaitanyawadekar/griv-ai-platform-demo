import { Widget, Workitem, Contact, Employee, SOP } from '../types';
import { DataFilterEngine } from './dataFilter';

// Import sample data (this would come from a real data source in production)
import { sampleWorkitems, sampleContacts, employees, sops } from '../data/sampleData';

interface WidgetData {
  rawData: any[];
  filteredData: any[];
  aggregatedValue: number | string;
  summary: Record<string, any>;
  chartData?: any[];
  tableData?: any[];
}

export class WidgetDataProvider {
  /**
   * Get data for a specific widget based on its configuration
   */
  static getWidgetData(widget: Widget): WidgetData {
    const dataSource = widget.dataSource;
    const rawData = this.getRawData(dataSource.type);
    
    // Apply conditions if they exist
    let filteredData = rawData;
    if (dataSource.conditions && dataSource.conditions.length > 0) {
      filteredData = DataFilterEngine.filterData(
        rawData,
        dataSource.conditions,
        dataSource.conditionLogic || 'AND'
      );
    }
    
    // Apply time range filtering if applicable
    if (dataSource.timeRange && dataSource.timeRange !== 'all') {
      filteredData = this.applyTimeRangeFilter(filteredData, dataSource.timeRange, dataSource.type);
    }
    
    // Apply custom time range if specified
    if (dataSource.timeRange === 'custom' && dataSource.customTimeRange) {
      filteredData = this.applyCustomTimeRangeFilter(
        filteredData,
        dataSource.customTimeRange.start,
        dataSource.customTimeRange.end,
        dataSource.type
      );
    }
    
    // Sort data if specified
    if (dataSource.sortBy) {
      filteredData = DataFilterEngine.sortData(
        filteredData,
        dataSource.sortBy,
        dataSource.sortOrder || 'desc'
      );
    }
    
    // Apply limit
    if (dataSource.limit && dataSource.limit > 0) {
      filteredData = filteredData.slice(0, dataSource.limit);
    }
    
    // Calculate aggregated value
    const aggregatedValue = this.getAggregatedValue(widget, filteredData);
    
    // Generate summary statistics
    const summary = dataSource.type !== 'custom' ? DataFilterEngine.generateSummary(
      rawData,
      dataSource.conditions || [],
      dataSource.type as 'workitems' | 'contacts' | 'sops' | 'employees'
    ) : {
      totalRecords: rawData.length,
      filteredRecords: filteredData.length,
      filterPercentage: rawData.length > 0 ? (filteredData.length / rawData.length) * 100 : 0
    };
    
    // Prepare chart data if needed
    const chartData = widget.type === 'chart' ? this.prepareChartData(widget, filteredData) : undefined;
    
    // Prepare table data if needed
    const tableData = widget.type === 'table' ? this.prepareTableData(widget, filteredData) : undefined;
    
    return {
      rawData,
      filteredData,
      aggregatedValue,
      summary,
      chartData,
      tableData
    };
  }
  
  /**
   * Get raw data based on data source type
   */
  private static getRawData(dataSourceType: string): any[] {
    switch (dataSourceType) {
      case 'workitems':
        return sampleWorkitems;
      case 'contacts':
        return sampleContacts;
      case 'employees':
        return employees;
      case 'sops':
        return sops;
      case 'custom':
        return []; // Would be populated from custom data source
      default:
        return [];
    }
  }
  
  /**
   * Apply time range filtering
   */
  private static applyTimeRangeFilter(data: any[], timeRange: string, dataSourceType: string): any[] {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }
    
    const dateField = this.getDateFieldForDataSource(dataSourceType);
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= now;
    });
  }
  
  /**
   * Apply custom time range filtering
   */
  private static applyCustomTimeRangeFilter(
    data: any[], 
    startDateStr: string, 
    endDateStr: string, 
    dataSourceType: string
  ): any[] {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dateField = this.getDateFieldForDataSource(dataSourceType);
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }
  
  /**
   * Get the primary date field for each data source type
   */
  private static getDateFieldForDataSource(dataSourceType: string): string {
    switch (dataSourceType) {
      case 'workitems':
        return 'createdAt';
      case 'contacts':
        return 'lastContact';
      case 'employees':
        return 'joinDate';
      case 'sops':
        return 'createdAt';
      default:
        return 'createdAt';
    }
  }
  
  /**
   * Calculate aggregated value for the widget
   */
  private static getAggregatedValue(widget: Widget, filteredData: any[]): number | string {
    const aggregation = widget.dataSource.aggregation || 'count';
    const groupBy = widget.dataSource.groupBy;
    
    if (groupBy) {
      // For grouped data, return the most significant group
      const grouped = DataFilterEngine.groupData(filteredData, groupBy);
      const sortedGroups = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
      return sortedGroups.length > 0 ? `${sortedGroups[0][1].length} (${sortedGroups[0][0]})` : '0';
    }
    
    // For numeric aggregations, we might need a specific field
    let fieldForAggregation: string | undefined;
    if (['sum', 'avg', 'min', 'max'].includes(aggregation)) {
      // Use a default numeric field or the first numeric field found
      fieldForAggregation = this.getNumericFieldForDataSource(widget.dataSource.type);
    }
    
    const result = DataFilterEngine.aggregateData(filteredData, aggregation as any, fieldForAggregation);
    
    // Format the result based on widget type and aggregation
    if (aggregation === 'avg' && typeof result === 'number') {
      return Math.round(result * 100) / 100; // Round to 2 decimal places
    }
    
    return result;
  }
  
  /**
   * Get a default numeric field for aggregations
   */
  private static getNumericFieldForDataSource(dataSourceType: string): string {
    switch (dataSourceType) {
      case 'workitems':
        return 'id'; // Could be priority level if numeric
      case 'contacts':
        return 'id';
      case 'employees':
        return 'id';
      case 'sops':
        return 'id';
      default:
        return 'id';
    }
  }
  
  /**
   * Prepare chart data for visualization
   */
  private static prepareChartData(widget: Widget, filteredData: any[]): any[] {
    const chartType = widget.config.chartType || 'bar';
    const groupBy = widget.dataSource.groupBy;
    
    if (groupBy) {
      const grouped = DataFilterEngine.groupData(filteredData, groupBy);
      return Object.entries(grouped).map(([key, items]) => ({
        label: key,
        value: items.length,
        color: widget.config.color || '#3b82f6'
      }));
    }
    
    // Default chart data based on data source type
    switch (widget.dataSource.type) {
      case 'workitems':
        const statusGroups = DataFilterEngine.groupData(filteredData, 'status');
        return Object.entries(statusGroups).map(([status, items]) => ({
          label: status,
          value: items.length,
          color: this.getStatusColor(status)
        }));
        
      case 'contacts':
        const typeGroups = DataFilterEngine.groupData(filteredData, 'type');
        return Object.entries(typeGroups).map(([type, items]) => ({
          label: type,
          value: items.length,
          color: this.getContactTypeColor(type)
        }));
        
      default:
        return [{
          label: 'Total',
          value: filteredData.length,
          color: widget.config.color || '#3b82f6'
        }];
    }
  }
  
  /**
   * Prepare table data for display
   */
  private static prepareTableData(widget: Widget, filteredData: any[]): any[] {
    // Return the filtered data with relevant columns based on data source type
    switch (widget.dataSource.type) {
      case 'workitems':
        return filteredData.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          status: item.status,
          priority: item.priority,
          assignee: item.assignee,
          dueDate: item.dueDate,
          createdAt: item.createdAt
        }));
        
      case 'contacts':
        return filteredData.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          email: item.email,
          phone: item.phone,
          location: item.location,
          status: item.status,
          lastContact: item.lastContact
        }));
        
      case 'employees':
        return filteredData.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          department: item.department,
          role: item.role,
          status: item.status,
          joinDate: item.joinDate
        }));
        
      case 'sops':
        return filteredData.map(item => ({
          id: item.id,
          name: item.name,
          appliesTo: item.appliesTo,
          status: item.status,
          version: item.version,
          createdBy: item.createdBy,
          createdAt: item.createdAt
        }));
        
      default:
        return filteredData;
    }
  }
  
  /**
   * Get color for workitem status
   */
  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Open': '#3b82f6',
      'In Progress': '#f59e0b',
      'Completed': '#10b981',
      'Closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
  }
  
  /**
   * Get color for contact type
   */
  private static getContactTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Customer': '#10b981',
      'Lead': '#f59e0b',
      'Partner': '#8b5cf6',
      'Vendor': '#ef4444'
    };
    return colors[type] || '#6b7280';
  }
  
  /**
   * Get real-time widget data with caching
   */
  static getWidgetDataWithCache(widget: Widget): WidgetData {
    // In a real application, this would implement caching logic
    // For now, just return fresh data
    return this.getWidgetData(widget);
  }
  
  /**
   * Validate widget configuration
   */
  static validateWidgetConfig(widget: Widget): string[] {
    const errors: string[] = [];
    
    if (!widget.title.trim()) {
      errors.push('Widget title is required');
    }
    
    if (!widget.dataSource.type) {
      errors.push('Data source type is required');
    }
    
    // Validate conditions if they exist
    if (widget.dataSource.conditions) {
      const rawData = this.getRawData(widget.dataSource.type);
      const availableFields = rawData.length > 0 ? Object.keys(rawData[0]) : [];
      
      widget.dataSource.conditions.forEach((condition, index) => {
        const conditionErrors = DataFilterEngine.validateCondition(condition, availableFields);
        conditionErrors.forEach(error => {
          errors.push(`Condition ${index + 1}: ${error}`);
        });
      });
    }
    
    return errors;
  }
  
  /**
   * Get available fields for a data source type
   */
  static getAvailableFields(dataSourceType: string): string[] {
    const rawData = this.getRawData(dataSourceType);
    if (rawData.length === 0) return [];
    
    // Get all unique field names from the data
    const allFields = new Set<string>();
    rawData.forEach(item => {
      Object.keys(item).forEach(key => allFields.add(key));
      
      // Include nested fields if they exist
      if (item.typeFields && typeof item.typeFields === 'object') {
        Object.keys(item.typeFields).forEach(key => {
          allFields.add(`typeFields.${key}`);
        });
      }
    });
    
    return Array.from(allFields).sort();
  }
  
  /**
   * Get sample data for preview
   */
  static getSampleDataPreview(dataSourceType: string, limit: number = 3): any[] {
    const rawData = this.getRawData(dataSourceType);
    return rawData.slice(0, limit);
  }
}