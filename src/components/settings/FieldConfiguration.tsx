import React, { useState } from 'react';
import { Button, Icon, Modal, Input } from '../ui';
import { theme } from '../../data/theme';

const initialWorkitemTypes = [
  { id: 1, name: 'Lead', description: 'Sales leads and opportunities', icon: '🎯', color: '#3b82f6' },
  { id: 2, name: 'Task', description: 'Internal tasks and assignments', icon: '📝', color: '#f59e0b' },
  { id: 3, name: 'Grievance', description: 'Customer complaints and issues', icon: '🚨', color: '#ef4444' },
  { id: 4, name: 'Follow-up', description: 'Follow-up activities and reminders', icon: '🔄', color: '#10b981' }
];

const initialContactTypes = [
  { id: 1, name: 'Customer', description: 'Service customers and clients', icon: '👤', color: '#3b82f6' },
  { id: 2, name: 'Voter', description: 'Citizens and constituents', icon: '🗳️', color: '#8b5cf6' },
  { id: 3, name: 'Influencer', description: 'Key stakeholders and leaders', icon: '⭐', color: '#f59e0b' },
  { id: 4, name: 'Partner', description: 'Business partners and vendors', icon: '🤝', color: '#10b981' }
];

export const FieldConfiguration: React.FC = () => {
  const [workitemTypes, setWorkitemTypes] = useState(initialWorkitemTypes);
  const [contactTypes, setContactTypes] = useState(initialContactTypes);
  const [showAddWorkitemType, setShowAddWorkitemType] = useState(false);
  const [showAddContactType, setShowAddContactType] = useState(false);
  const [showManageFields, setShowManageFields] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<'workitem' | 'contact'>('workitem');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  const [showAddField, setShowAddField] = useState(false);
  const [showEditField, setShowEditField] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'checkbox' | 'url' | 'currency' | 'percentage'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<string>('');
  const [fieldDefaultValue, setFieldDefaultValue] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldDescription, setFieldDescription] = useState('');
  const [fieldValidationRules, setFieldValidationRules] = useState<{[key: string]: any}>({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [fields, setFields] = useState<{[key: string]: any[]}>({});
  
  // Validation rules state
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [pattern, setPattern] = useState('');
  const [customValidation, setCustomValidation] = useState('');
  
  const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4', '#f97316'];
  
  const handleAddWorkitemType = () => {
    if (newTypeName.trim()) {
      const newType = {
        id: Math.max(...workitemTypes.map(t => t.id)) + 1,
        name: newTypeName.trim(),
        description: newTypeDescription.trim() || `${newTypeName.trim()} workitems`,
        icon: '📋',
        color: colors[workitemTypes.length % colors.length]
      };
      setWorkitemTypes([...workitemTypes, newType]);
      resetTypeForm();
      setShowAddWorkitemType(false);
    }
  };
  
  const handleAddContactType = () => {
    if (newTypeName.trim()) {
      const newType = {
        id: Math.max(...contactTypes.map(t => t.id)) + 1,
        name: newTypeName.trim(),
        description: newTypeDescription.trim() || `${newTypeName.trim()} contacts`,
        icon: '👤',
        color: colors[contactTypes.length % colors.length]
      };
      setContactTypes([...contactTypes, newType]);
      resetTypeForm();
      setShowAddContactType(false);
    }
  };
  
  const getTypeFields = (typeId: number, category: 'workitem' | 'contact') => {
    const key = `${category}_${typeId}`;
    return fields[key] || [
      { 
        id: 1, 
        name: 'Priority Level', 
        type: 'select', 
        required: true, 
        options: ['Low', 'Medium', 'High', 'Critical'],
        defaultValue: 'Medium',
        description: 'Set the priority level for this item',
        placeholder: 'Select priority level'
      },
      { 
        id: 2, 
        name: 'Department', 
        type: 'text', 
        required: false,
        defaultValue: '',
        description: 'Department responsible for handling this item',
        placeholder: 'Enter department name',
        validation: { minLength: 2, maxLength: 50 }
      },
      { 
        id: 3, 
        name: 'Due Date', 
        type: 'date', 
        required: true,
        description: 'Target completion date',
        validation: { futureDate: true }
      }
    ];
  };
  
  const resetFieldForm = () => {
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setFieldOptions('');
    setFieldDefaultValue('');
    setFieldPlaceholder('');
    setFieldDescription('');
    setFieldValidationRules({});
    setShowAdvancedOptions(false);
    setMinLength('');
    setMaxLength('');
    setMinValue('');
    setMaxValue('');
    setPattern('');
    setCustomValidation('');
  };
  
  const resetTypeForm = () => {
    setNewTypeName('');
    setNewTypeDescription('');
  };
  
  const buildValidationRules = () => {
    const rules: any = {};
    if (minLength) rules.minLength = parseInt(minLength);
    if (maxLength) rules.maxLength = parseInt(maxLength);
    if (minValue) rules.minValue = parseFloat(minValue);
    if (maxValue) rules.maxValue = parseFloat(maxValue);
    if (pattern) rules.pattern = pattern;
    if (customValidation) rules.customValidation = customValidation;
    
    // Type-specific validations
    if (newFieldType === 'email') {
      rules.emailFormat = true;
    } else if (newFieldType === 'phone') {
      rules.phoneFormat = true;
    } else if (newFieldType === 'url') {
      rules.urlFormat = true;
    } else if (newFieldType === 'date') {
      rules.dateFormat = true;
    }
    
    return rules;
  };
  
  const handleAddField = () => {
    if (newFieldName.trim() && selectedType) {
      const key = `${selectedTypeCategory}_${selectedType.id}`;
      const currentFields = getTypeFields(selectedType.id, selectedTypeCategory);
      const newField = {
        id: Math.max(...currentFields.map(f => f.id), 0) + 1,
        name: newFieldName.trim(),
        type: newFieldType,
        required: newFieldRequired,
        defaultValue: fieldDefaultValue,
        placeholder: fieldPlaceholder,
        description: fieldDescription,
        validation: buildValidationRules(),
        ...(newFieldType === 'select' && fieldOptions.trim() ? 
          { options: fieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt) } : {})
      };
      setFields({
        ...fields,
        [key]: [...currentFields, newField]
      });
      resetFieldForm();
      setShowAddField(false);
    }
  };
  
  const loadFieldForEdit = (field: any) => {
    setSelectedField(field);
    setNewFieldName(field.name);
    setNewFieldType(field.type);
    setNewFieldRequired(field.required || false);
    setFieldOptions(field.options ? field.options.join(', ') : '');
    setFieldDefaultValue(field.defaultValue || '');
    setFieldPlaceholder(field.placeholder || '');
    setFieldDescription(field.description || '');
    
    // Load validation rules
    const validation = field.validation || {};
    setMinLength(validation.minLength ? validation.minLength.toString() : '');
    setMaxLength(validation.maxLength ? validation.maxLength.toString() : '');
    setMinValue(validation.minValue ? validation.minValue.toString() : '');
    setMaxValue(validation.maxValue ? validation.maxValue.toString() : '');
    setPattern(validation.pattern || '');
    setCustomValidation(validation.customValidation || '');
    
    setShowEditField(true);
  };
  
  const handleEditField = () => {
    if (newFieldName.trim() && selectedType && selectedField) {
      const key = `${selectedTypeCategory}_${selectedType.id}`;
      const currentFields = getTypeFields(selectedType.id, selectedTypeCategory);
      const updatedFields = currentFields.map(field => 
        field.id === selectedField.id ? {
          ...field,
          name: newFieldName.trim(),
          type: newFieldType,
          required: newFieldRequired,
          defaultValue: fieldDefaultValue,
          placeholder: fieldPlaceholder,
          description: fieldDescription,
          validation: buildValidationRules(),
          ...(newFieldType === 'select' && fieldOptions.trim() ? 
            { options: fieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt) } : {})
        } : field
      );
      setFields({
        ...fields,
        [key]: updatedFields
      });
      setSelectedField(null);
      resetFieldForm();
      setShowEditField(false);
    }
  };
  
  const handleDeleteField = (fieldId: number) => {
    if (selectedType && window.confirm('Are you sure you want to delete this field?')) {
      const key = `${selectedTypeCategory}_${selectedType.id}`;
      const currentFields = getTypeFields(selectedType.id, selectedTypeCategory);
      const updatedFields = currentFields.filter(field => field.id !== fieldId);
      setFields({
        ...fields,
        [key]: updatedFields
      });
    }
  };
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        margin: 0
      }}>
        Configuration
      </h3>

      {/* Workitem Types Section */}
      <div style={{
        backgroundColor: theme.colors.secondary,
        borderRadius: '8px',
        padding: '1.5rem',
        border: `1px solid ${theme.colors.border}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: 0
          }}>
            Workitem Types ({workitemTypes.length})
          </h4>
          <Button size="sm" onClick={() => setShowAddWorkitemType(true)}>
            <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
            Add Type
          </Button>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {workitemTypes.map((type) => (
            <div
              key={type.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: theme.colors.card,
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: `${type.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name="workitems" size={16} color={type.color} />
                </div>
                <div>
                  <h5 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {type.name}
                  </h5>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground,
                    margin: 0
                  }}>
                    {type.description}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => {
                  setSelectedType(type);
                  setSelectedTypeCategory('workitem');
                  setShowManageFields(true);
                }}>
                  <Icon name="fields" size={14} />
                  Manage Fields
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  const newName = prompt('Enter new name for workitem type:', type.name);
                  if (newName && newName.trim() && newName !== type.name) {
                    setWorkitemTypes(workitemTypes.map(t => t.id === type.id ? {...t, name: newName.trim()} : t));
                  }
                }}>
                  <Icon name="edit" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Types Section */}
      <div style={{
        backgroundColor: theme.colors.secondary,
        borderRadius: '8px',
        padding: '1.5rem',
        border: `1px solid ${theme.colors.border}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: 0
          }}>
            Contact Types ({contactTypes.length})
          </h4>
          <Button size="sm" onClick={() => setShowAddContactType(true)}>
            <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
            Add Type
          </Button>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {contactTypes.map((type) => (
            <div
              key={type.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: theme.colors.card,
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: `${type.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name="contacts" size={16} color={type.color} />
                </div>
                <div>
                  <h5 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: theme.colors.foreground,
                    margin: 0
                  }}>
                    {type.name}
                  </h5>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.mutedForeground,
                    margin: 0
                  }}>
                    {type.description}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => {
                  setSelectedType(type);
                  setSelectedTypeCategory('contact');
                  setShowManageFields(true);
                }}>
                  <Icon name="fields" size={14} />
                  Manage Fields
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  const newName = prompt('Enter new name for contact type:', type.name);
                  if (newName && newName.trim() && newName !== type.name) {
                    setContactTypes(contactTypes.map(t => t.id === type.id ? {...t, name: newName.trim()} : t));
                  }
                }}>
                  <Icon name="edit" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Workitem Type Modal */}
      <Modal
        show={showAddWorkitemType}
        onClose={() => {
          setShowAddWorkitemType(false);
          resetTypeForm();
        }}
        title="Add Workitem Type"
        size="md"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Type Name *
            </label>
            <Input
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Enter workitem type name"
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Description (Optional)
            </label>
            <Input
              value={newTypeDescription}
              onChange={(e) => setNewTypeDescription(e.target.value)}
              placeholder="Describe what this workitem type is used for"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddWorkitemType(false);
                resetTypeForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddWorkitemType}>
              Add Type
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Contact Type Modal */}
      <Modal
        show={showAddContactType}
        onClose={() => {
          setShowAddContactType(false);
          resetTypeForm();
        }}
        title="Add Contact Type"
        size="md"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Type Name *
            </label>
            <Input
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Enter contact type name"
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Description (Optional)
            </label>
            <Input
              value={newTypeDescription}
              onChange={(e) => setNewTypeDescription(e.target.value)}
              placeholder="Describe what this contact type is used for"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddContactType(false);
                resetTypeForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddContactType}>
              Add Type
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manage Fields Modal */}
      <Modal
        show={showManageFields}
        onClose={() => {
          setShowManageFields(false);
          setSelectedType(null);
        }}
        title={`Manage Fields - ${selectedType?.name || ''}`}
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme.colors.muted,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.foreground,
              margin: '0 0 0.5rem 0'
            }}>
              Custom Fields for {selectedType?.name}
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: theme.colors.mutedForeground,
              margin: 0
            }}>
              Configure custom fields for this {selectedTypeCategory} type. You can add text fields, dropdowns, date pickers, and more.
            </p>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Current Fields ({selectedType ? getTypeFields(selectedType.id, selectedTypeCategory).length : 0})
              </h5>
              <Button size="sm" onClick={() => setShowAddField(true)}>
                <Icon name="plus" size={14} color={theme.colors.primaryForeground} />
                Add Field
              </Button>
            </div>
            
            {/* Dynamic fields */}
            {selectedType && getTypeFields(selectedType.id, selectedTypeCategory).map((field) => (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: theme.colors.card,
                  borderRadius: '6px',
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: `${theme.colors.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="fields" size={10} color={theme.colors.primary} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.foreground
                    }}>
                      {field.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: theme.colors.mutedForeground
                    }}>
                      {field.type.charAt(0).toUpperCase() + field.type.slice(1)} • {field.required ? 'Required' : 'Optional'}
                      {field.defaultValue && ` • Default: ${field.defaultValue}`}
                      {field.validation && Object.keys(field.validation).length > 0 && ' • Validated'}
                    </div>
                    {field.description && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: theme.colors.mutedForeground,
                        fontStyle: 'italic',
                        marginTop: '0.25rem'
                      }}>
                        {field.description}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <Button variant="ghost" size="sm" onClick={() => loadFieldForEdit(field)}>
                    <Icon name="edit" size={12} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                    <Icon name="trash" size={12} />
                  </Button>
                </div>
              </div>
            ))}
            {selectedType && getTypeFields(selectedType.id, selectedTypeCategory).length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: theme.colors.mutedForeground,
                fontSize: '0.875rem'
              }}>
                No fields configured yet. Click "Add Field" to get started.
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Add Field Modal */}
      <Modal
        show={showAddField}
        onClose={() => {
          setShowAddField(false);
          resetFieldForm();
        }}
        title="Add Custom Field"
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Field Name *
            </label>
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Enter field name"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Field Type *
            </label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.card,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="url">URL</option>
              <option value="date">Date</option>
              <option value="select">Select (Dropdown)</option>
              <option value="textarea">Text Area</option>
              <option value="checkbox">Checkbox</option>
              <option value="currency">Currency</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Description (Optional)
            </label>
            <Input
              value={fieldDescription}
              onChange={(e) => setFieldDescription(e.target.value)}
              placeholder="Brief description of this field"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Placeholder Text (Optional)
            </label>
            <Input
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              placeholder="Placeholder text for the field"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Default Value (Optional)
            </label>
            <Input
              value={fieldDefaultValue}
              onChange={(e) => setFieldDefaultValue(e.target.value)}
              placeholder="Default value for this field"
            />
          </div>

          {newFieldType === 'select' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: theme.colors.foreground
              }}>
                Options (comma-separated) *
              </label>
              <Input
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          
          {/* Advanced Options Toggle */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${theme.colors.border}` }}>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: theme.colors.primary,
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Icon name={showAdvancedOptions ? 'chevronDown' : 'chevronRight'} size={16} />
              Advanced Validation Rules
            </button>
          </div>
          
          {showAdvancedOptions && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.colors.muted,
              borderRadius: '6px',
              display: 'grid',
              gap: '1rem'
            }}>
              {(newFieldType === 'text' || newFieldType === 'textarea') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Min Length
                    </label>
                    <Input
                      type="number"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Max Length
                    </label>
                    <Input
                      type="number"
                      value={maxLength}
                      onChange={(e) => setMaxLength(e.target.value)}
                      placeholder="255"
                    />
                  </div>
                </div>
              )}
              
              {(newFieldType === 'number' || newFieldType === 'currency' || newFieldType === 'percentage') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Min Value
                    </label>
                    <Input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Max Value
                    </label>
                    <Input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: theme.colors.foreground
                }}>
                  Regex Pattern (Optional)
                </label>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="^[A-Za-z0-9]+$"
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: theme.colors.foreground
                }}>
                  Custom Validation Message
                </label>
                <Input
                  value={customValidation}
                  onChange={(e) => setCustomValidation(e.target.value)}
                  placeholder="Custom error message"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="required"
              checked={newFieldRequired}
              onChange={(e) => setNewFieldRequired(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: theme.colors.primary
              }}
            />
            <label
              htmlFor="required"
              style={{
                fontSize: '0.875rem',
                color: theme.colors.foreground,
                cursor: 'pointer'
              }}
            >
              Required field
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddField(false);
                resetFieldForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddField}>
              Add Field
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Field Modal */}
      <Modal
        show={showEditField}
        onClose={() => {
          setShowEditField(false);
          setSelectedField(null);
          resetFieldForm();
        }}
        title="Edit Field"
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Field Name *
            </label>
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Enter field name"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Field Type *
            </label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                backgroundColor: theme.colors.card,
                color: theme.colors.foreground,
                fontSize: '0.875rem'
              }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="url">URL</option>
              <option value="date">Date</option>
              <option value="select">Select (Dropdown)</option>
              <option value="textarea">Text Area</option>
              <option value="checkbox">Checkbox</option>
              <option value="currency">Currency</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Description (Optional)
            </label>
            <Input
              value={fieldDescription}
              onChange={(e) => setFieldDescription(e.target.value)}
              placeholder="Brief description of this field"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Placeholder Text (Optional)
            </label>
            <Input
              value={fieldPlaceholder}
              onChange={(e) => setFieldPlaceholder(e.target.value)}
              placeholder="Placeholder text for the field"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: theme.colors.foreground
            }}>
              Default Value (Optional)
            </label>
            <Input
              value={fieldDefaultValue}
              onChange={(e) => setFieldDefaultValue(e.target.value)}
              placeholder="Default value for this field"
            />
          </div>

          {newFieldType === 'select' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: theme.colors.foreground
              }}>
                Options (comma-separated) *
              </label>
              <Input
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          
          {/* Advanced Options Toggle */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${theme.colors.border}` }}>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: theme.colors.primary,
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Icon name={showAdvancedOptions ? 'chevronDown' : 'chevronRight'} size={16} />
              Advanced Validation Rules
            </button>
          </div>
          
          {showAdvancedOptions && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.colors.muted,
              borderRadius: '6px',
              display: 'grid',
              gap: '1rem'
            }}>
              {(newFieldType === 'text' || newFieldType === 'textarea') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Min Length
                    </label>
                    <Input
                      type="number"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Max Length
                    </label>
                    <Input
                      type="number"
                      value={maxLength}
                      onChange={(e) => setMaxLength(e.target.value)}
                      placeholder="255"
                    />
                  </div>
                </div>
              )}
              
              {(newFieldType === 'number' || newFieldType === 'currency' || newFieldType === 'percentage') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Min Value
                    </label>
                    <Input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: theme.colors.foreground
                    }}>
                      Max Value
                    </label>
                    <Input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: theme.colors.foreground
                }}>
                  Regex Pattern (Optional)
                </label>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="^[A-Za-z0-9]+$"
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: theme.colors.foreground
                }}>
                  Custom Validation Message
                </label>
                <Input
                  value={customValidation}
                  onChange={(e) => setCustomValidation(e.target.value)}
                  placeholder="Custom error message"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="required-edit"
              checked={newFieldRequired}
              onChange={(e) => setNewFieldRequired(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: theme.colors.primary
              }}
            />
            <label
              htmlFor="required-edit"
              style={{
                fontSize: '0.875rem',
                color: theme.colors.foreground,
                cursor: 'pointer'
              }}
            >
              Required field
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditField(false);
                setSelectedField(null);
                resetFieldForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditField}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};