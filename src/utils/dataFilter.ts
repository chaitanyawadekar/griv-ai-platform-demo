import { WidgetCondition, WidgetConditionOperator, Workitem, Contact, Employee, SOP } from '../types';

// Type for any data record that can be filtered
type FilterableRecord = Record<string, any>;

export class DataFilterEngine {
  /**
   * Apply conditions to filter a dataset
   */
  static filterData<T extends FilterableRecord>(
    data: T[],
    conditions: WidgetCondition[],
    conditionLogic: 'AND' | 'OR' | 'CUSTOM' = 'AND'
  ): T[] {
    if (!conditions.length) return data;

    return data.filter(record => {
      if (conditionLogic === 'AND') {
        return conditions.every(condition => this.evaluateCondition(record, condition));
      } else if (conditionLogic === 'OR') {
        return conditions.some(condition => this.evaluateCondition(record, condition));
      } else {
        // CUSTOM logic - use individual condition logical operators
        return this.evaluateCustomLogic(record, conditions);
      }
    });
  }

  /**
   * Evaluate custom logic with mixed AND/OR operators
   */
  private static evaluateCustomLogic<T extends FilterableRecord>(
    record: T,
    conditions: WidgetCondition[]
  ): boolean {
    if (conditions.length === 0) return true;
    if (conditions.length === 1) return this.evaluateCondition(record, conditions[0]);

    // Build a result array where each element represents the evaluation of a condition
    const results: boolean[] = [];
    const operators: string[] = [];

    conditions.forEach((condition, index) => {
      results.push(this.evaluateCondition(record, condition));
      if (index > 0) {
        operators.push(condition.logicalOperator || 'AND');
      }
    });

    // Process operators left to right
    let finalResult = results[0];
    for (let i = 0; i < operators.length; i++) {
      const operator = operators[i];
      const nextResult = results[i + 1];
      
      if (operator === 'AND') {
        finalResult = finalResult && nextResult;
      } else if (operator === 'OR') {
        finalResult = finalResult || nextResult;
      }
    }

    return finalResult;
  }

  /**
   * Evaluate a single condition against a record
   */
  private static evaluateCondition<T extends FilterableRecord>(
    record: T,
    condition: WidgetCondition
  ): boolean {
    if (condition.isGroup && condition.conditions) {
      return this.filterData([record], condition.conditions).length > 0;
    }

    const fieldValue = this.getFieldValue(record, condition.field);
    return this.applyOperator(fieldValue, condition.operator, condition.value, condition.secondValue, condition.caseSensitive);
  }

  /**
   * Get field value from record, supporting nested fields (e.g., 'typeFields.name')
   */
  private static getFieldValue<T extends FilterableRecord>(record: T, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let value: any = record;

    for (const part of parts) {
      if (value == null) return null;
      value = value[part];
    }

    return value;
  }

  /**
   * Apply an operator to compare field value with condition value
   */
  private static applyOperator(
    fieldValue: any,
    operator: WidgetConditionOperator,
    conditionValue: any,
    secondValue?: any,
    caseSensitive: boolean = false
  ): boolean {
    // Handle null/undefined field values
    if (fieldValue == null) {
      return ['is_null', 'is_empty', 'is_not_null', 'is_not_empty'].includes(operator) ?
        this.handleNullOperators(fieldValue, operator) : false;
    }

    // Convert values to strings for text operations if needed
    const fieldStr = caseSensitive ? String(fieldValue) : String(fieldValue).toLowerCase();
    const conditionStr = caseSensitive ? String(conditionValue) : String(conditionValue).toLowerCase();

    switch (operator) {
      // Basic comparison
      case 'equals':
        return fieldValue === conditionValue;
      case 'not_equals':
        return fieldValue !== conditionValue;

      // Text operations
      case 'contains':
        return fieldStr.includes(conditionStr);
      case 'not_contains':
        return !fieldStr.includes(conditionStr);
      case 'starts_with':
        return fieldStr.startsWith(conditionStr);
      case 'ends_with':
        return fieldStr.endsWith(conditionStr);

      // Numeric/Date operations
      case 'greater_than':
        return this.compareNumericOrDate(fieldValue, conditionValue, '>');
      case 'greater_than_or_equal':
        return this.compareNumericOrDate(fieldValue, conditionValue, '>=');
      case 'less_than':
        return this.compareNumericOrDate(fieldValue, conditionValue, '<');
      case 'less_than_or_equal':
        return this.compareNumericOrDate(fieldValue, conditionValue, '<=');

      // Array operations
      case 'in':
        return Array.isArray(conditionValue) ? conditionValue.includes(fieldValue) : false;
      case 'not_in':
        return Array.isArray(conditionValue) ? !conditionValue.includes(fieldValue) : true;
      case 'includes_any':
        return Array.isArray(fieldValue) && Array.isArray(conditionValue) ?
          conditionValue.some(val => fieldValue.includes(val)) : false;
      case 'includes_all':
        return Array.isArray(fieldValue) && Array.isArray(conditionValue) ?
          conditionValue.every(val => fieldValue.includes(val)) : false;

      // Special operations
      case 'is_empty':
        return this.isEmpty(fieldValue);
      case 'is_not_empty':
        return !this.isEmpty(fieldValue);
      case 'is_null':
        return fieldValue == null;
      case 'is_not_null':
        return fieldValue != null;

      // Date specific operations
      case 'is_today':
        return this.isToday(fieldValue);
      case 'is_yesterday':
        return this.isYesterday(fieldValue);
      case 'is_this_week':
        return this.isThisWeek(fieldValue);
      case 'is_this_month':
        return this.isThisMonth(fieldValue);
      case 'is_this_year':
        return this.isThisYear(fieldValue);
      case 'last_n_days':
        return this.isInLastNDays(fieldValue, conditionValue);
      case 'next_n_days':
        return this.isInNextNDays(fieldValue, conditionValue);
      case 'between_dates':
        return this.isBetweenDates(fieldValue, conditionValue, secondValue);

      // Advanced text operations
      case 'matches_regex':
        try {
          const regex = new RegExp(String(conditionValue), caseSensitive ? 'g' : 'gi');
          return regex.test(String(fieldValue));
        } catch {
          return false;
        }
      case 'word_count_equals':
        return this.getWordCount(fieldValue) === Number(conditionValue);
      case 'char_count_greater_than':
        return String(fieldValue).length > Number(conditionValue);

      default:
        return false;
    }
  }

  // Helper methods for special operators
  private static handleNullOperators(fieldValue: any, operator: WidgetConditionOperator): boolean {
    switch (operator) {
      case 'is_null':
        return fieldValue == null;
      case 'is_not_null':
        return fieldValue != null;
      case 'is_empty':
        return this.isEmpty(fieldValue);
      case 'is_not_empty':
        return !this.isEmpty(fieldValue);
      default:
        return false;
    }
  }

  private static isEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  private static compareNumericOrDate(fieldValue: any, conditionValue: any, operator: '>' | '>=' | '<' | '<='): boolean {
    // Try numeric comparison first
    const fieldNum = Number(fieldValue);
    const conditionNum = Number(conditionValue);
    
    if (!isNaN(fieldNum) && !isNaN(conditionNum)) {
      switch (operator) {
        case '>': return fieldNum > conditionNum;
        case '>=': return fieldNum >= conditionNum;
        case '<': return fieldNum < conditionNum;
        case '<=': return fieldNum <= conditionNum;
      }
    }

    // Try date comparison
    const fieldDate = new Date(fieldValue);
    const conditionDate = new Date(conditionValue);
    
    if (!isNaN(fieldDate.getTime()) && !isNaN(conditionDate.getTime())) {
      switch (operator) {
        case '>': return fieldDate > conditionDate;
        case '>=': return fieldDate >= conditionDate;
        case '<': return fieldDate < conditionDate;
        case '<=': return fieldDate <= conditionDate;
      }
    }

    return false;
  }

  private static isToday(dateValue: any): boolean {
    const date = new Date(dateValue);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private static isYesterday(dateValue: any): boolean {
    const date = new Date(dateValue);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  private static isThisWeek(dateValue: any): boolean {
    const date = new Date(dateValue);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return date >= startOfWeek && date <= endOfWeek;
  }

  private static isThisMonth(dateValue: any): boolean {
    const date = new Date(dateValue);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  private static isThisYear(dateValue: any): boolean {
    const date = new Date(dateValue);
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  }

  private static isInLastNDays(dateValue: any, days: number): boolean {
    const date = new Date(dateValue);
    const now = new Date();
    const nDaysAgo = new Date();
    nDaysAgo.setDate(now.getDate() - days);
    return date >= nDaysAgo && date <= now;
  }

  private static isInNextNDays(dateValue: any, days: number): boolean {
    const date = new Date(dateValue);
    const now = new Date();
    const nDaysLater = new Date();
    nDaysLater.setDate(now.getDate() + days);
    return date >= now && date <= nDaysLater;
  }

  private static isBetweenDates(dateValue: any, startDate: any, endDate: any): boolean {
    const date = new Date(dateValue);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  }

  private static getWordCount(value: any): number {
    return String(value).trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Get aggregated value from filtered data
   */
  static aggregateData<T extends FilterableRecord>(
    data: T[],
    aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count',
    field?: string
  ): number {
    if (data.length === 0) return 0;

    switch (aggregation) {
      case 'count':
        return data.length;
      case 'distinct_count':
        if (!field) return 0;
        const uniqueValues = new Set(data.map(item => this.getFieldValue(item, field)));
        return uniqueValues.size;
      case 'sum':
        if (!field) return 0;
        return data.reduce((sum, item) => {
          const value = Number(this.getFieldValue(item, field)) || 0;
          return sum + value;
        }, 0);
      case 'avg':
        if (!field) return 0;
        const sum = data.reduce((sum, item) => {
          const value = Number(this.getFieldValue(item, field)) || 0;
          return sum + value;
        }, 0);
        return sum / data.length;
      case 'min':
        if (!field) return 0;
        return data.reduce((min, item) => {
          const value = Number(this.getFieldValue(item, field));
          return isNaN(value) ? min : Math.min(min, value);
        }, Infinity);
      case 'max':
        if (!field) return 0;
        return data.reduce((max, item) => {
          const value = Number(this.getFieldValue(item, field));
          return isNaN(value) ? max : Math.max(max, value);
        }, -Infinity);
      default:
        return 0;
    }
  }

  /**
   * Group data by a field
   */
  static groupData<T extends FilterableRecord>(
    data: T[],
    groupByField: string
  ): Record<string, T[]> {
    return data.reduce((groups, item) => {
      const groupValue = String(this.getFieldValue(item, groupByField) || 'Unknown');
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Sort data by field
   */
  static sortData<T extends FilterableRecord>(
    data: T[],
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] {
    return [...data].sort((a, b) => {
      const aValue = this.getFieldValue(a, sortBy);
      const bValue = this.getFieldValue(b, sortBy);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

      // Try numeric comparison
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Try date comparison
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortOrder === 'asc' ? 
          aDate.getTime() - bDate.getTime() : 
          bDate.getTime() - aDate.getTime();
      }

      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortOrder === 'asc' ?
        aStr.localeCompare(bStr) :
        bStr.localeCompare(aStr);
    });
  }

  /**
   * Generate summary statistics for a dataset
   */
  static generateSummary<T extends FilterableRecord>(
    data: T[],
    conditions: WidgetCondition[],
    dataSourceType: 'workitems' | 'contacts' | 'sops' | 'employees'
  ): Record<string, any> {
    const filteredData = this.filterData(data, conditions);
    const summary: Record<string, any> = {
      totalRecords: data.length,
      filteredRecords: filteredData.length,
      filterPercentage: data.length > 0 ? (filteredData.length / data.length) * 100 : 0
    };

    // Add data source specific summaries
    if (dataSourceType === 'workitems') {
      const statusGroups = this.groupData(filteredData, 'status');
      const priorityGroups = this.groupData(filteredData, 'priority');
      const typeGroups = this.groupData(filteredData, 'type');
      
      summary.byStatus = Object.entries(statusGroups).map(([status, items]) => ({
        status,
        count: items.length,
        percentage: (items.length / filteredData.length) * 100
      }));
      
      summary.byPriority = Object.entries(priorityGroups).map(([priority, items]) => ({
        priority,
        count: items.length,
        percentage: (items.length / filteredData.length) * 100
      }));
      
      summary.byType = Object.entries(typeGroups).map(([type, items]) => ({
        type,
        count: items.length,
        percentage: (items.length / filteredData.length) * 100
      }));
    }

    return summary;
  }

  /**
   * Validate a condition for potential issues
   */
  static validateCondition(condition: WidgetCondition, availableFields: string[]): string[] {
    const errors: string[] = [];

    if (!condition.field) {
      errors.push('Field is required');
    } else if (!availableFields.includes(condition.field)) {
      errors.push('Field does not exist');
    }

    if (!condition.operator) {
      errors.push('Operator is required');
    }

    const operatorInfo = this.getOperatorInfo(condition.operator);
    if (operatorInfo.requiresValue && (condition.value == null || condition.value === '')) {
      errors.push('Value is required for this operator');
    }

    if (operatorInfo.requiresSecondValue && (condition.secondValue == null || condition.secondValue === '')) {
      errors.push('Second value is required for this operator');
    }

    // Validate regex
    if (condition.operator === 'matches_regex') {
      try {
        new RegExp(String(condition.value));
      } catch {
        errors.push('Invalid regular expression');
      }
    }

    return errors;
  }

  private static getOperatorInfo(operator: WidgetConditionOperator) {
    const operatorMap: Record<string, { requiresValue: boolean; requiresSecondValue: boolean }> = {
      equals: { requiresValue: true, requiresSecondValue: false },
      not_equals: { requiresValue: true, requiresSecondValue: false },
      contains: { requiresValue: true, requiresSecondValue: false },
      not_contains: { requiresValue: true, requiresSecondValue: false },
      starts_with: { requiresValue: true, requiresSecondValue: false },
      ends_with: { requiresValue: true, requiresSecondValue: false },
      greater_than: { requiresValue: true, requiresSecondValue: false },
      greater_than_or_equal: { requiresValue: true, requiresSecondValue: false },
      less_than: { requiresValue: true, requiresSecondValue: false },
      less_than_or_equal: { requiresValue: true, requiresSecondValue: false },
      in: { requiresValue: true, requiresSecondValue: false },
      not_in: { requiresValue: true, requiresSecondValue: false },
      includes_any: { requiresValue: true, requiresSecondValue: false },
      includes_all: { requiresValue: true, requiresSecondValue: false },
      is_empty: { requiresValue: false, requiresSecondValue: false },
      is_not_empty: { requiresValue: false, requiresSecondValue: false },
      is_null: { requiresValue: false, requiresSecondValue: false },
      is_not_null: { requiresValue: false, requiresSecondValue: false },
      is_today: { requiresValue: false, requiresSecondValue: false },
      is_yesterday: { requiresValue: false, requiresSecondValue: false },
      is_this_week: { requiresValue: false, requiresSecondValue: false },
      is_this_month: { requiresValue: false, requiresSecondValue: false },
      is_this_year: { requiresValue: false, requiresSecondValue: false },
      last_n_days: { requiresValue: true, requiresSecondValue: false },
      next_n_days: { requiresValue: true, requiresSecondValue: false },
      between_dates: { requiresValue: true, requiresSecondValue: true },
      matches_regex: { requiresValue: true, requiresSecondValue: false },
      word_count_equals: { requiresValue: true, requiresSecondValue: false },
      char_count_greater_than: { requiresValue: true, requiresSecondValue: false }
    };

    return operatorMap[operator] || { requiresValue: true, requiresSecondValue: false };
  }
}