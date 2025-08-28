import React, { useState, useMemo } from 'react';
import { Theme, WidgetCondition, WidgetConditionOperator } from '../../types';
import { Button } from './Button';
import { Input } from './Input';
import { Icon } from './Icon';
import { Badge } from './Badge';

interface ConditionBuilderProps {
  theme: Theme;
  dataSourceType: 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom';
  conditions: WidgetCondition[];
  onChange: (conditions: WidgetCondition[]) => void;
  conditionLogic: 'AND' | 'OR' | 'CUSTOM';
  onLogicChange: (logic: 'AND' | 'OR' | 'CUSTOM') => void;
}

interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'email' | 'phone';
  options?: string[];
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  theme,
  dataSourceType,
  conditions,
  onChange,
  conditionLogic,
  onLogicChange
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  // Define available fields based on data source type
  const availableFields: FieldDefinition[] = useMemo(() => {
    const baseFields: Record<string, FieldDefinition[]> = {
      workitems: [
        { key: 'type', label: 'Type', type: 'text', options: ['Lead', 'Task', 'Issue', 'Request', 'Incident', 'Complaint', 'Inquiry'] },
        { key: 'status', label: 'Status', type: 'text', options: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled'] },
        { key: 'priority', label: 'Priority', type: 'text', options: ['Low', 'Medium', 'High', 'Critical'] },
        { key: 'assignee', label: 'Assignee', type: 'text' },
        { key: 'department', label: 'Department', type: 'text', options: ['Sales', 'Support', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations'] },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'contact', label: 'Contact', type: 'text' },
        { key: 'tags', label: 'Tags', type: 'array' },
        { key: 'createdAt', label: 'Created Date', type: 'date' },
        { key: 'updatedAt', label: 'Updated Date', type: 'date' },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
        // Type-specific fields
        { key: 'typeFields.name', label: 'Customer Name', type: 'text' },
        { key: 'typeFields.phone', label: 'Phone', type: 'phone' },
        { key: 'typeFields.email', label: 'Email', type: 'email' },
        { key: 'typeFields.company', label: 'Company', type: 'text' },
        { key: 'typeFields.source', label: 'Lead Source', type: 'text', options: ['Website', 'Social Media', 'Referral', 'Cold Outreach', 'Advertising', 'Events'] },
        { key: 'typeFields.budget', label: 'Budget', type: 'text' },
        { key: 'typeFields.timeline', label: 'Timeline', type: 'text' },
        { key: 'typeFields.severity', label: 'Severity', type: 'text', options: ['Low', 'Medium', 'High', 'Critical'] },
        { key: 'typeFields.issue', label: 'Issue Type', type: 'text' },
        { key: 'typeFields.request_type', label: 'Request Type', type: 'text' },
        { key: 'typeFields.platform', label: 'Platform', type: 'text' },
        { key: 'typeFields.subject', label: 'Subject', type: 'text' }
      ],
      contacts: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'type', label: 'Type', type: 'text', options: ['Customer', 'Vendor', 'Partner', 'Lead', 'Prospect'] },
        { key: 'phone', label: 'Phone', type: 'phone' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'status', label: 'Status', type: 'text', options: ['Active', 'Inactive'] },
        { key: 'lastContact', label: 'Last Contact', type: 'date' },
        { key: 'tags', label: 'Tags', type: 'array' }
      ],
      employees: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone', type: 'phone' },
        { key: 'department', label: 'Department', type: 'text', options: ['Sales', 'Support', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations'] },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'accessLevel', label: 'Access Level', type: 'text', options: ['read', 'write', 'admin'] },
        { key: 'status', label: 'Status', type: 'text', options: ['Active', 'Inactive'] },
        { key: 'joinDate', label: 'Join Date', type: 'date' },
        { key: 'lastActive', label: 'Last Active', type: 'date' }
      ],
      sops: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'appliesTo', label: 'Applies To', type: 'text', options: ['workitem', 'contact'] },
        { key: 'status', label: 'Status', type: 'text', options: ['active', 'draft', 'archived'] },
        { key: 'version', label: 'Version', type: 'text' },
        { key: 'createdBy', label: 'Created By', type: 'text' },
        { key: 'createdAt', label: 'Created Date', type: 'date' },
        { key: 'lastModified', label: 'Last Modified', type: 'date' },
        { key: 'tags', label: 'Tags', type: 'array' }
      ],
      custom: []
    };

    return baseFields[dataSourceType] || [];
  }, [dataSourceType]);

  // Get available operators based on field type
  const getAvailableOperators = (fieldType: string): { operator: WidgetConditionOperator; label: string; requiresValue: boolean; requiresSecondValue: boolean }[] => {
    const operatorMap: Record<string, any[]> = {
      text: [
        { operator: 'equals', label: 'equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'not equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'contains', label: 'contains', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_contains', label: 'does not contain', requiresValue: true, requiresSecondValue: false },
        { operator: 'starts_with', label: 'starts with', requiresValue: true, requiresSecondValue: false },
        { operator: 'ends_with', label: 'ends with', requiresValue: true, requiresSecondValue: false },
        { operator: 'in', label: 'is one of', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_in', label: 'is not one of', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_empty', label: 'is empty', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_empty', label: 'is not empty', requiresValue: false, requiresSecondValue: false },
        { operator: 'matches_regex', label: 'matches regex', requiresValue: true, requiresSecondValue: false },
        { operator: 'word_count_equals', label: 'word count equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'char_count_greater_than', label: 'character count >', requiresValue: true, requiresSecondValue: false }
      ],
      number: [
        { operator: 'equals', label: 'equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'not equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'greater_than', label: 'greater than', requiresValue: true, requiresSecondValue: false },
        { operator: 'greater_than_or_equal', label: 'greater than or equal', requiresValue: true, requiresSecondValue: false },
        { operator: 'less_than', label: 'less than', requiresValue: true, requiresSecondValue: false },
        { operator: 'less_than_or_equal', label: 'less than or equal', requiresValue: true, requiresSecondValue: false },
        { operator: 'in', label: 'is one of', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_in', label: 'is not one of', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_null', label: 'is null', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_null', label: 'is not null', requiresValue: false, requiresSecondValue: false }
      ],
      date: [
        { operator: 'equals', label: 'is on', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'is not on', requiresValue: true, requiresSecondValue: false },
        { operator: 'greater_than', label: 'is after', requiresValue: true, requiresSecondValue: false },
        { operator: 'less_than', label: 'is before', requiresValue: true, requiresSecondValue: false },
        { operator: 'between_dates', label: 'is between', requiresValue: true, requiresSecondValue: true },
        { operator: 'is_today', label: 'is today', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_yesterday', label: 'is yesterday', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_this_week', label: 'is this week', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_this_month', label: 'is this month', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_this_year', label: 'is this year', requiresValue: false, requiresSecondValue: false },
        { operator: 'last_n_days', label: 'in last N days', requiresValue: true, requiresSecondValue: false },
        { operator: 'next_n_days', label: 'in next N days', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_null', label: 'is not set', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_null', label: 'is set', requiresValue: false, requiresSecondValue: false }
      ],
      boolean: [
        { operator: 'equals', label: 'is', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'is not', requiresValue: true, requiresSecondValue: false }
      ],
      array: [
        { operator: 'includes_any', label: 'includes any of', requiresValue: true, requiresSecondValue: false },
        { operator: 'includes_all', label: 'includes all of', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_in', label: 'does not include any of', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_empty', label: 'is empty', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_empty', label: 'is not empty', requiresValue: false, requiresSecondValue: false }
      ],
      email: [
        { operator: 'equals', label: 'equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'not equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'contains', label: 'contains', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_contains', label: 'does not contain', requiresValue: true, requiresSecondValue: false },
        { operator: 'ends_with', label: 'domain is', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_empty', label: 'is empty', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_empty', label: 'is not empty', requiresValue: false, requiresSecondValue: false }
      ],
      phone: [
        { operator: 'equals', label: 'equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'not_equals', label: 'not equals', requiresValue: true, requiresSecondValue: false },
        { operator: 'starts_with', label: 'starts with', requiresValue: true, requiresSecondValue: false },
        { operator: 'contains', label: 'contains', requiresValue: true, requiresSecondValue: false },
        { operator: 'is_empty', label: 'is empty', requiresValue: false, requiresSecondValue: false },
        { operator: 'is_not_empty', label: 'is not empty', requiresValue: false, requiresSecondValue: false }
      ]
    };

    return operatorMap[fieldType] || operatorMap.text;
  };

  const addCondition = () => {
    const newCondition: WidgetCondition = {
      id: `condition_${Date.now()}`,
      field: availableFields[0]?.key || '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };
    onChange([...conditions, newCondition]);
  };

  const updateCondition = (index: number, updates: Partial<WidgetCondition>) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    
    // Reset value when field or operator changes
    if (updates.field || updates.operator) {
      updated[index].value = '';
      updated[index].secondValue = undefined;
    }
    
    onChange(updated);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const addConditionGroup = () => {
    const newGroup: WidgetCondition = {
      id: `group_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      isGroup: true,
      conditions: [],
      logicalOperator: 'AND'
    };
    onChange([...conditions, newGroup]);
  };

  const addConditionToGroup = (groupIndex: number) => {
    const newCondition: WidgetCondition = {
      id: `condition_${Date.now()}`,
      field: availableFields[0]?.key || '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };

    const updatedConditions = [...conditions];
    if (updatedConditions[groupIndex].conditions) {
      updatedConditions[groupIndex].conditions!.push(newCondition);
    } else {
      updatedConditions[groupIndex].conditions = [newCondition];
    }
    onChange(updatedConditions);
  };

  const updateGroupCondition = (groupIndex: number, conditionIndex: number, updates: Partial<WidgetCondition>) => {
    const updatedConditions = [...conditions];
    if (updatedConditions[groupIndex].conditions) {
      updatedConditions[groupIndex].conditions![conditionIndex] = {
        ...updatedConditions[groupIndex].conditions![conditionIndex],
        ...updates
      };
      onChange(updatedConditions);
    }
  };

  const removeGroupCondition = (groupIndex: number, conditionIndex: number) => {
    const updatedConditions = [...conditions];
    if (updatedConditions[groupIndex].conditions) {
      updatedConditions[groupIndex].conditions!.splice(conditionIndex, 1);
      onChange(updatedConditions);
    }
  };

  const updateGroupLogic = (groupIndex: number, logic: 'AND' | 'OR') => {
    const updatedConditions = [...conditions];
    updatedConditions[groupIndex].logicalOperator = logic;
    onChange(updatedConditions);
  };

  const renderValueInput = (condition: WidgetCondition, index: number, onValueChange?: (value: string) => void) => {
    const field = availableFields.find(f => f.key === condition.field);
    const operatorInfo = getAvailableOperators(field?.type || 'text').find(op => op.operator === condition.operator);
    
    const handleValueChange = (value: string) => {
      if (onValueChange) {
        onValueChange(value);
      } else {
        updateCondition(index, { value });
      }
    };
    
    if (!operatorInfo?.requiresValue) {
      return null;
    }

    const isArrayOperator = ['in', 'not_in', 'includes_any', 'includes_all'].includes(condition.operator);

    // Dropdown for fields with predefined options
    if (field?.options && !isArrayOperator && !['matches_regex', 'word_count_equals', 'char_count_greater_than'].includes(condition.operator)) {
      return (
        <select
          value={condition.value as string}
          onChange={(e) => updateCondition(index, { value: e.target.value })}
          style={{
            padding: '0.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            fontSize: '0.875rem',
            minWidth: '150px'
          }}
        >
          <option value="">Select...</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    // Date input
    if (field?.type === 'date' && !['last_n_days', 'next_n_days'].includes(condition.operator)) {
      return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="date"
            value={condition.value as string}
            onChange={(e) => updateCondition(index, { value: e.target.value })}
            style={{
              padding: '0.5rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.colors.card,
              color: theme.colors.foreground,
              fontSize: '0.875rem'
            }}
          />
          {operatorInfo?.requiresSecondValue && (
            <input
              type="date"
              value={condition.secondValue as string || ''}
              onChange={(e) => updateCondition(index, { secondValue: e.target.value })}
              style={{
                padding: '0.5rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.card,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            />
          )}
        </div>
      );
    }

    // Number input
    const inputType = field?.type === 'number' || ['last_n_days', 'next_n_days', 'word_count_equals', 'char_count_greater_than'].includes(condition.operator) ? 'number' : 'text';
    
    // Array input (comma-separated)
    if (isArrayOperator) {
      return (
        <Input
          value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value as string}
          onChange={(e) => {
            const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
            updateCondition(index, { value: values });
          }}
          placeholder="Value1, Value2, Value3..."
          style={{ minWidth: '200px' }}
        />
      );
    }

    // Boolean input
    if (field?.type === 'boolean') {
      return (
        <select
          value={condition.value as string}
          onChange={(e) => updateCondition(index, { value: e.target.value === 'true' })}
          style={{
            padding: '0.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            fontSize: '0.875rem'
          }}
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }

    // Regular text/number input
    return (
      <Input
        type={inputType}
        value={condition.value as string}
        onChange={(e) => updateCondition(index, { 
          value: inputType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value 
        })}
        placeholder={
          condition.operator === 'matches_regex' ? 'Regular expression...' :
          field?.type === 'email' ? 'email@example.com' :
          field?.type === 'phone' ? '+1234567890' :
          'Enter value...'
        }
        style={{ minWidth: '150px' }}
      />
    );
  };

  const renderCondition = (condition: WidgetCondition, index: number, level = 0) => {
    if (condition.isGroup) {
      return (
        <div
          key={condition.id}
          style={{
            border: `2px dashed ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '1rem',
            marginLeft: `${level * 20}px`,
            backgroundColor: theme.colors.secondary
          }}
        >
          {/* Group Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: theme.colors.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon name="folder" size={16} color={theme.colors.primary} />
              </div>
              <div>
                <span style={{ 
                  fontWeight: '600', 
                  color: theme.colors.foreground,
                  fontSize: '1rem'
                }}>
                  Condition Group
                </span>
                <div style={{
                  fontSize: '0.75rem',
                  color: theme.colors.mutedForeground,
                  marginTop: '2px'
                }}>
                  {condition.conditions?.length || 0} condition{(condition.conditions?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Group Logic Selector */}
              <select
                value={condition.logicalOperator || 'AND'}
                onChange={(e) => updateGroupLogic(index, e.target.value as 'AND' | 'OR')}
                style={{
                  padding: '0.25rem 0.5rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.75rem'
                }}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(index)}
                style={{ color: theme.colors.destructive }}
              >
                <Icon name="trash" size={14} />
              </Button>
            </div>
          </div>

          {/* Group Conditions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {condition.conditions?.map((groupCondition, conditionIndex) => (
              <div key={groupCondition.id} style={{
                backgroundColor: theme.colors.background,
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}>
                  {/* Field Selector */}
                  <select
                    value={groupCondition.field}
                    onChange={(e) => updateGroupCondition(index, conditionIndex, { 
                      field: e.target.value,
                      operator: 'equals',
                      value: ''
                    })}
                    style={{
                      padding: '0.5rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: theme.colors.background,
                      color: theme.colors.foreground,
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">Select field...</option>
                    {availableFields.map(field => (
                      <option key={field.key} value={field.key}>
                        {field.label}
                      </option>
                    ))}
                  </select>

                  {/* Operator Selector */}
                  <select
                    value={groupCondition.operator}
                    onChange={(e) => updateGroupCondition(index, conditionIndex, { 
                      operator: e.target.value as WidgetConditionOperator,
                      value: ''
                    })}
                    style={{
                      padding: '0.5rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: theme.colors.background,
                      color: theme.colors.foreground,
                      fontSize: '0.875rem'
                    }}
                    disabled={!groupCondition.field}
                  >
                    {groupCondition.field && getAvailableOperators(
                      availableFields.find(f => f.key === groupCondition.field)?.type || 'text'
                    ).map(op => (
                      <option key={op.operator} value={op.operator}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  {/* Value Input */}
                  <div>
                    <Input
                      value={groupCondition.value as string}
                      onChange={(e) => updateGroupCondition(index, conditionIndex, { value: e.target.value })}
                      placeholder="Enter value..."
                      disabled={!groupCondition.field}
                      style={{ minWidth: '120px' }}
                    />
                  </div>

                  {/* Remove Condition */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGroupCondition(index, conditionIndex)}
                    style={{ color: theme.colors.destructive }}
                  >
                    <Icon name="trash" size={14} />
                  </Button>
                </div>
                
                {/* Logic Operator (between conditions) */}
                {conditionIndex < (condition.conditions?.length || 1) - 1 && (
                  <div style={{
                    textAlign: 'center',
                    margin: '0.5rem 0 0 0',
                    padding: '0.25rem',
                  }}>
                    <Badge variant="secondary" style={{ fontSize: '0.75rem' }}>
                      {condition.logicalOperator || 'AND'}
                    </Badge>
                  </div>
                )}
              </div>
            ))}

            {/* Add Condition to Group */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addConditionToGroup(index)}
              style={{
                border: `2px dashed ${theme.colors.border}`,
                backgroundColor: 'transparent',
                color: theme.colors.mutedForeground,
                padding: '0.75rem'
              }}
            >
              <Icon name="plus" size={14} />
              Add condition to this group
            </Button>

            {/* Empty State */}
            {(!condition.conditions || condition.conditions.length === 0) && (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: theme.colors.mutedForeground,
                fontSize: '0.875rem'
              }}>
                <Icon name="info" size={20} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  This group is empty
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  Add conditions to create complex filters with {condition.logicalOperator || 'AND'} logic
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    const field = availableFields.find(f => f.key === condition.field);
    const operatorInfo = getAvailableOperators(field?.type || 'text').find(op => op.operator === condition.operator);

    return (
      <div
        key={condition.id}
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 200px 200px 1fr auto auto',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          backgroundColor: theme.colors.card,
          marginLeft: `${level * 20}px`
        }}
      >
        {/* Logical Operator */}
        {index > 0 && (
          <select
            value={condition.logicalOperator}
            onChange={(e) => updateCondition(index, { logicalOperator: e.target.value as 'AND' | 'OR' })}
            style={{
              padding: '0.5rem',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.colors.secondary,
              color: theme.colors.foreground,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        )}

        {/* Field Selection */}
        <select
          value={condition.field}
          onChange={(e) => updateCondition(index, { field: e.target.value })}
          style={{
            padding: '0.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            fontSize: '0.875rem'
          }}
        >
          <option value="">Select field...</option>
          {availableFields.map(field => (
            <option key={field.key} value={field.key}>{field.label}</option>
          ))}
        </select>

        {/* Operator Selection */}
        <select
          value={condition.operator}
          onChange={(e) => updateCondition(index, { operator: e.target.value as WidgetConditionOperator })}
          style={{
            padding: '0.5rem',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            fontSize: '0.875rem'
          }}
        >
          {getAvailableOperators(field?.type || 'text').map(op => (
            <option key={op.operator} value={op.operator}>{op.label}</option>
          ))}
        </select>

        {/* Value Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {renderValueInput(condition, index)}
        </div>

        {/* Case Sensitive Toggle for text operations */}
        {field?.type === 'text' && ['contains', 'not_contains', 'starts_with', 'ends_with', 'matches_regex'].includes(condition.operator) && (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: theme.colors.mutedForeground
          }}>
            <input
              type="checkbox"
              checked={condition.caseSensitive || false}
              onChange={(e) => updateCondition(index, { caseSensitive: e.target.checked })}
            />
            Case sensitive
          </label>
        )}

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeCondition(index)}
        >
          <Icon name="trash" size={14} color={theme.colors.destructive} />
        </Button>
      </div>
    );
  };

  const generatePreviewText = (): string => {
    if (conditions.length === 0) return 'No conditions set';
    
    const conditionTexts = conditions.map((condition, index) => {
      const field = availableFields.find(f => f.key === condition.field);
      const operatorInfo = getAvailableOperators(field?.type || 'text').find(op => op.operator === condition.operator);
      const fieldLabel = field?.label || condition.field;
      const operatorLabel = operatorInfo?.label || condition.operator;
      
      let valueText = '';
      if (operatorInfo?.requiresValue) {
        if (Array.isArray(condition.value)) {
          valueText = condition.value.join(', ');
        } else if (operatorInfo.requiresSecondValue) {
          valueText = `${condition.value} and ${condition.secondValue}`;
        } else {
          valueText = String(condition.value);
        }
      }

      const logicalPrefix = index > 0 ? `${condition.logicalOperator} ` : '';
      return `${logicalPrefix}${fieldLabel} ${operatorLabel}${valueText ? ' ' + valueText : ''}`;
    });

    return conditionTexts.join(' ');
  };

  return (
    <div style={{
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: theme.colors.background
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            Data Conditions ({conditions.length})
          </h4>
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground
          }}>
            Define what data should be included in this widget
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Icon name={previewMode ? 'eye-off' : 'eye'} size={14} />
            {previewMode ? 'Hide' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addCondition}
          >
            <Icon name="plus" size={14} />
            Add Condition
          </Button>
        </div>
      </div>


      {/* Preview Mode */}
      {previewMode && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: theme.colors.secondary,
          borderRadius: '6px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Icon name="eye" size={16} color={theme.colors.primary} />
            <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
              Condition Preview
            </span>
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: theme.colors.foreground,
            backgroundColor: theme.colors.card,
            padding: '0.75rem',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.border}`,
            wordBreak: 'break-all'
          }}>
            {generatePreviewText()}
          </div>
        </div>
      )}

      {/* Conditions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {conditions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: theme.colors.secondary,
            borderRadius: '8px',
            border: `1px dashed ${theme.colors.border}`
          }}>
            <Icon name="filter" size={48} color={theme.colors.mutedForeground} />
            <h5 style={{ margin: '1rem 0 0.5rem 0', color: theme.colors.foreground }}>
              No Conditions Set
            </h5>
            <p style={{
              color: theme.colors.mutedForeground,
              margin: '0 0 1rem 0',
              fontSize: '0.875rem'
            }}>
              Add conditions to filter the data shown in this widget
            </p>
            <Button onClick={addCondition}>
              <Icon name="plus" size={16} />
              Add First Condition
            </Button>
          </div>
        ) : (
          conditions.map((condition, index) => renderCondition(condition, index))
        )}
      </div>

      {/* Advanced Actions */}
      {conditions.length > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          gap: '0.5rem'
        }}>
          <div style={{ position: 'relative' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={addConditionGroup}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem'
              }}
            >
              <Icon name="folder" size={14} />
              <span>Add Group</span>
              <Icon name="info" size={12} color={theme.colors.mutedForeground} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
          >
            <Icon name="trash" size={14} />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};