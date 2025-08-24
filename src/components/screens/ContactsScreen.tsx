import React, { useState } from 'react';
import { Contact, ContactType, Theme } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/Table';
import { Modal } from '../ui/Modal';

interface ContactsScreenProps {
  contacts: Contact[];
  contactTypes: ContactType[];
  theme: Theme;
  onContactClick: (contact: Contact) => void;
  onContactCreate?: (contact: Contact) => void;
}

interface ContactCardProps {
  contact: Contact;
  contactType: ContactType;
  theme: Theme;
  onContactClick: (contact: Contact) => void;
  isCompact?: boolean;
}

const ContactVerticalItem: React.FC<ContactCardProps & { isCompact?: boolean }> = ({ 
  contact, contactType, theme, onContactClick, isCompact = false
}) => {
  const renderTypeSpecificFields = () => {
    const getKeyFields = () => {
      switch (contact.type) {
        case 'Citizen':
          return ['phone', 'email', 'location'];
        case 'Business':
          return ['phone', 'email', 'location'];
        case 'Vendor':
          return ['phone', 'location'];
        case 'Partner':
          return ['phone', 'email', 'location'];
        default:
          return ['phone', 'email', 'location'];
      }
    };

    const keyFields = getKeyFields();
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        fontSize: '13px',
        color: theme.colors.mutedForeground 
      }}>
        {keyFields.map(field => {
          let value = '';
          let label = '';
          let icon = '';
          
          switch (field) {
            case 'phone':
              value = contact.phone;
              label = 'Phone';
              icon = 'phone';
              break;
            case 'email':
              value = contact.email;
              label = 'Email';
              icon = 'mail';
              break;
            case 'location':
              value = contact.location;
              label = 'Location';
              icon = 'location';
              break;
          }
          
          if (!value) return null;
          
          return (
            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name={icon} size={12} color={theme.colors.mutedForeground} />
              <span style={{ fontWeight: '500', minWidth: '50px' }}>{label}:</span>
              <span>{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.mutedForeground;
      default:
        return theme.colors.mutedForeground;
    }
  };

  return (
    <div
      onClick={() => onContactClick(contact)}
      style={{
        padding: isCompact ? '12px' : '16px',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        backgroundColor: theme.colors.card,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '8px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.primary;
        e.currentTarget.style.boxShadow = `0 2px 8px ${theme.colors.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        {/* Left: Contact Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: contactType.color,
                flexShrink: 0
              }}
            />
            <h3 style={{
              margin: 0,
              fontSize: isCompact ? '15px' : '16px',
              fontWeight: '600',
              color: theme.colors.foreground,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {contact.name}
            </h3>
            <Badge
              variant="default"
              style={{
                backgroundColor: `${contactType.color}15`,
                color: contactType.color,
                fontSize: '11px',
                padding: '2px 6px',
                fontWeight: '500'
              }}
            >
              {contact.type}
            </Badge>
          </div>

          {/* Contact Fields */}
          {!isCompact && renderTypeSpecificFields()}
        </div>

        {/* Right: Status and Last Contact */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end', 
          gap: '4px',
          minWidth: '100px'
        }}>
          <Badge
            variant={contact.status === 'Active' ? 'success' : 'secondary'}
            style={{
              fontSize: '11px',
              padding: '2px 6px'
            }}
          >
            {contact.status}
          </Badge>
          <div style={{
            fontSize: '12px',
            color: theme.colors.mutedForeground,
            textAlign: 'right'
          }}>
            Last: {contact.lastContact}
          </div>
        </div>
      </div>

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginTop: '8px',
          flexWrap: 'wrap'
        }}>
          {contact.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                backgroundColor: theme.colors.muted,
                color: theme.colors.mutedForeground,
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const ContactListItem: React.FC<ContactCardProps> = ({ contact, contactType, theme, onContactClick }) => {
  return (
    <div
      onClick={() => onContactClick(contact)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        backgroundColor: theme.colors.card,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '4px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.muted;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.card;
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: contactType.color,
          marginRight: '12px'
        }}
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: '600', color: theme.colors.foreground }}>
            {contact.name}
          </div>
          <div style={{ fontSize: '12px', color: theme.colors.mutedForeground }}>
            {contact.type}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '150px', fontSize: '13px', color: theme.colors.foreground }}>
          {contact.phone}
        </div>
        <div style={{ flex: 1, minWidth: '200px', fontSize: '13px', color: theme.colors.foreground }}>
          {contact.email}
        </div>
        <div style={{ minWidth: '80px', textAlign: 'center' }}>
          <Badge
            variant={contact.status === 'Active' ? 'success' : 'secondary'}
            style={{ fontSize: '11px' }}
          >
            {contact.status}
          </Badge>
        </div>
        <div style={{ minWidth: '100px', fontSize: '12px', color: theme.colors.mutedForeground, textAlign: 'right' }}>
          {contact.lastContact}
        </div>
      </div>
    </div>
  );
};

const ContactGridItem: React.FC<ContactCardProps> = ({ contact, contactType, theme, onContactClick }) => {
  return (
    <div
      onClick={() => onContactClick(contact)}
      style={{
        padding: '16px',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        backgroundColor: theme.colors.card,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '160px',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.primary;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: contactType.color
          }}
        />
        <Badge
          variant="default"
          style={{
            backgroundColor: `${contactType.color}15`,
            color: contactType.color,
            fontSize: '10px',
            padding: '2px 6px'
          }}
        >
          {contact.type}
        </Badge>
      </div>
      
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        fontWeight: '600',
        color: theme.colors.foreground,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {contact.name}
      </h3>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: theme.colors.mutedForeground }}>
        <div>{contact.phone}</div>
        <div>{contact.email}</div>
        <div>{contact.location}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Badge
          variant={contact.status === 'Active' ? 'success' : 'secondary'}
          style={{ fontSize: '10px' }}
        >
          {contact.status}
        </Badge>
        <span style={{ fontSize: '11px', color: theme.colors.mutedForeground }}>
          {contact.lastContact}
        </span>
      </div>
    </div>
  );
};

export const ContactsScreen: React.FC<ContactsScreenProps> = ({
  contacts,
  contactTypes,
  theme,
  onContactClick,
  onContactCreate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'vertical' | 'grid'>('table');
  const [sortField, setSortField] = useState<'name' | 'type' | 'status' | 'lastContact'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Form state for new contact
  const [newContact, setNewContact] = useState({
    name: '',
    type: 'Citizen',
    phone: '',
    email: '',
    location: '',
    status: 'Active' as 'Active' | 'Inactive',
    tags: ''
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || contact.type === selectedType;
    const matchesStatus = selectedStatus === '' || contact.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'lastContact') {
      // For demo purposes, just use string comparison
      aValue = a.lastContact;
      bValue = b.lastContact;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate contacts
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = sortedContacts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: 'name' | 'type' | 'status' | 'lastContact') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(c => c.id));
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  // Close action menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showActionMenu) {
        setShowActionMenu(null);
      }
    };
    
    if (showActionMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActionMenu]);

  const getContactType = (typeName: string) => {
    return contactTypes.find(t => t.name === typeName) || contactTypes[0];
  };

  const renderTableView = () => (
    <div>
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: theme.colors.muted }}>
              <TableHead style={{ width: '40px', padding: '12px' }}>
                <input
                  type="checkbox"
                  checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('name')}
                style={{ 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Name
                  {sortField === 'name' && (
                    <Icon name={sortDirection === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('type')}
                style={{ 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Type
                  {sortField === 'type' && (
                    <Icon name={sortDirection === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ padding: '12px', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</TableHead>
              <TableHead style={{ padding: '12px', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</TableHead>
              <TableHead style={{ padding: '12px', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</TableHead>
              <TableHead 
                onClick={() => handleSort('status')}
                style={{ 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Status
                  {sortField === 'status' && (
                    <Icon name={sortDirection === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                onClick={() => handleSort('lastContact')}
                style={{ 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Last Contact
                  {sortField === 'lastContact' && (
                    <Icon name={sortDirection === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: '60px', padding: '12px', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContacts.map(contact => {
              const contactType = getContactType(contact.type);
              const isSelected = selectedContacts.includes(contact.id);
              
              return (
                <TableRow 
                  key={contact.id}
                  style={{
                    backgroundColor: isSelected ? theme.colors.muted : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <TableCell style={{ padding: '12px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectContact(contact.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell 
                    onClick={() => onContactClick(contact)}
                    style={{ padding: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: contactType.color,
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontWeight: '500', color: theme.colors.foreground }}>
                        {contact.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px' }}>
                    <Badge
                      variant="default"
                      style={{
                        backgroundColor: `${contactType.color}15`,
                        color: contactType.color,
                        fontSize: '11px'
                      }}
                    >
                      {contact.type}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px', fontSize: '14px', color: theme.colors.mutedForeground }}>
                    {contact.phone}
                  </TableCell>
                  <TableCell style={{ padding: '12px', fontSize: '14px', color: theme.colors.mutedForeground }}>
                    {contact.email}
                  </TableCell>
                  <TableCell style={{ padding: '12px', fontSize: '14px', color: theme.colors.mutedForeground }}>
                    {contact.location}
                  </TableCell>
                  <TableCell style={{ padding: '12px' }}>
                    <Badge
                      variant={contact.status === 'Active' ? 'success' : 'secondary'}
                      style={{ fontSize: '11px' }}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px', fontSize: '13px', color: theme.colors.mutedForeground }}>
                    {contact.lastContact}
                  </TableCell>
                  <TableCell style={{ padding: '12px', position: 'relative' }}>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e?.stopPropagation();
                        setShowActionMenu(showActionMenu === contact.id ? null : contact.id);
                      }}
                      style={{ padding: '4px', minWidth: 'auto' }}
                    >
                      <Icon name="moreVertical" size={16} />
                    </Button>
                    
                    {/* Action Dropdown Menu */}
                    {showActionMenu === contact.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        zIndex: 1000,
                        backgroundColor: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        boxShadow: theme.shadow.lg,
                        minWidth: '160px',
                        padding: '8px 0'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactClick(contact);
                            setShowActionMenu(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: theme.colors.foreground,
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.muted;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Icon name="user" size={14} />
                          View Details
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement edit functionality
                            alert('Edit contact functionality coming soon!');
                            setShowActionMenu(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: theme.colors.foreground,
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.muted;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Icon name="edit" size={14} />
                          Edit Contact
                        </button>
                        
                        <div style={{
                          height: '1px',
                          backgroundColor: theme.colors.border,
                          margin: '4px 0'
                        }} />
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
                              // TODO: Implement delete functionality
                              alert('Delete contact functionality coming soon!');
                            }
                            setShowActionMenu(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: theme.colors.destructive,
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.muted;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Icon name="trash" size={14} />
                          Delete Contact
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        padding: '12px 16px',
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>
          {selectedContacts.length > 0 && (
            <span style={{ marginRight: '12px', fontWeight: '500' }}>
              {selectedContacts.length} of {sortedContacts.length} row(s) selected
            </span>
          )}
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedContacts.length)} of {sortedContacts.length} contacts
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: theme.colors.mutedForeground, marginRight: '8px' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <Icon name="chevronLeft" size={12} />
            <Icon name="chevronLeft" size={12} style={{ marginLeft: '-4px' }} />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <Icon name="chevronLeft" size={12} />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <Icon name="chevronRight" size={12} />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <Icon name="chevronRight" size={12} />
            <Icon name="chevronRight" size={12} style={{ marginLeft: '-4px' }} />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContactItem = (contact: Contact) => {
    const contactType = getContactType(contact.type);
    
    switch (viewMode) {
      case 'grid':
        return (
          <ContactGridItem
            key={contact.id}
            contact={contact}
            contactType={contactType}
            theme={theme}
            onContactClick={onContactClick}
          />
        );
      case 'vertical':
        return (
          <ContactVerticalItem
            key={contact.id}
            contact={contact}
            contactType={contactType}
            theme={theme}
            onContactClick={onContactClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '600',
            color: theme.colors.foreground
          }}>
            Contacts
          </h1>
          <p style={{
            margin: 0,
            color: theme.colors.mutedForeground,
            fontSize: '14px'
          }}>
            Manage your contacts and relationships
          </p>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px'
          }}
        >
          <Icon name="plus" size={16} />
          New Contact
        </Button>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
          style={{ minWidth: '300px', flex: 1 }}
        />
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          <option value="">All Types</option>
          {contactTypes.map(type => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          {(['table', 'vertical', 'grid'] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'ghost'}
              onClick={() => {
                setViewMode(mode);
                setCurrentPage(1);
                setSelectedContacts([]);
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                minWidth: 'auto'
              }}
            >
              <Icon 
                name={mode === 'table' ? 'table' : mode === 'vertical' ? 'menu' : 'grid'} 
                size={14} 
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      {viewMode !== 'table' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '14px',
            color: theme.colors.mutedForeground
          }}>
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* Contacts Display */}
      {viewMode === 'table' ? (
        renderTableView()
      ) : (
        <div style={{
          ...(viewMode === 'grid' && {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          })
        }}>
          {filteredContacts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: theme.colors.mutedForeground
            }}>
              <Icon name="users" size={48} color={theme.colors.mutedForeground} />
              <h3 style={{ margin: '16px 0 8px', fontSize: '18px', fontWeight: '500' }}>
                No contacts found
              </h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {searchTerm || selectedType || selectedStatus
                  ? 'Try adjusting your filters'
                  : 'Create your first contact to get started'
                }
              </p>
            </div>
          ) : (
            filteredContacts.map(renderContactItem)
          )}
        </div>
      )}

      {/* Create Contact Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewContact({
            name: '',
            type: 'Citizen',
            phone: '',
            email: '',
            location: '',
            status: 'Active',
            tags: ''
          });
        }}
        title="Create New Contact"
        size="lg"
      >
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Name Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '6px'
              }}>
                Full Name *
              </label>
              <Input
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter contact name"
                style={{ width: '100%' }}
              />
            </div>

            {/* Type and Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '6px'
                }}>
                  Contact Type *
                </label>
                <select
                  value={newContact.type}
                  onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '14px'
                  }}
                >
                  {contactTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <select
                  value={newContact.status}
                  onChange={(e) => setNewContact({ ...newContact, status: e.target.value as 'Active' | 'Inactive' })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.foreground,
                    fontSize: '14px'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Phone and Email Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '6px'
                }}>
                  Phone Number *
                </label>
                <Input
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+91-XXXXX-XXXXX"
                  type="tel"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  marginBottom: '6px'
                }}>
                  Email Address
                </label>
                <Input
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '6px'
              }}>
                Location *
              </label>
              <Input
                value={newContact.location}
                onChange={(e) => setNewContact({ ...newContact, location: e.target.value })}
                placeholder="City, State/Province"
                style={{ width: '100%' }}
              />
            </div>

            {/* Tags Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '6px'
              }}>
                Tags
              </label>
              <Input
                value={newContact.tags}
                onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                placeholder="Enter tags separated by commas (e.g., vip, partner, priority)"
                style={{ width: '100%' }}
              />
            </div>

            {/* Type-specific fields based on contact type */}
            {newContact.type === 'Business' && (
              <div style={{
                padding: '16px',
                backgroundColor: theme.colors.secondary,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  Business Information
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Company Name</label>
                    <Input
                      value=""
                      onChange={() => {}}
                      placeholder="Enter company name"
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Industry</label>
                    <Input
                      value=""
                      onChange={() => {}}
                      placeholder="e.g., Technology, Healthcare, Manufacturing"
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {newContact.type === 'Vendor' && (
              <div style={{
                padding: '16px',
                backgroundColor: theme.colors.secondary,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  Vendor Information
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Service Type</label>
                    <Input
                      value=""
                      onChange={() => {}}
                      placeholder="e.g., IT Services, Consulting, Supplies"
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Contract Status</label>
                    <select
                      style={{
                        width: '100%',
                        marginTop: '4px',
                        padding: '6px 10px',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: theme.colors.background,
                        color: theme.colors.foreground,
                        fontSize: '13px'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {newContact.type === 'Partner' && (
              <div style={{
                padding: '16px',
                backgroundColor: theme.colors.secondary,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  Partner Information
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Organization</label>
                    <Input
                      value=""
                      onChange={() => {}}
                      placeholder="Enter organization name"
                      style={{ width: '100%', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: theme.colors.mutedForeground }}>Partnership Type</label>
                    <select
                      style={{
                        width: '100%',
                        marginTop: '4px',
                        padding: '6px 10px',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: theme.colors.background,
                        color: theme.colors.foreground,
                        fontSize: '13px'
                      }}
                    >
                      <option value="strategic">Strategic</option>
                      <option value="technology">Technology</option>
                      <option value="channel">Channel</option>
                      <option value="integration">Integration</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: `1px solid ${theme.colors.border}`
          }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewContact({
                  name: '',
                  type: 'Citizen',
                  phone: '',
                  email: '',
                  location: '',
                  status: 'Active',
                  tags: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Validate required fields
                if (!newContact.name.trim() || !newContact.phone.trim() || !newContact.location.trim()) {
                  alert('Please fill in all required fields (Name, Phone, Location)');
                  return;
                }

                // Create the new contact object
                const contact: Contact = {
                  id: `contact-${Date.now()}`,
                  name: newContact.name,
                  type: newContact.type,
                  phone: newContact.phone,
                  email: newContact.email,
                  location: newContact.location,
                  status: newContact.status,
                  lastContact: 'Just now',
                  tags: newContact.tags ? newContact.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : undefined
                };

                // Call the create handler if provided
                if (onContactCreate) {
                  onContactCreate(contact);
                }

                // Close modal and reset form
                setShowCreateModal(false);
                setNewContact({
                  name: '',
                  type: 'Citizen',
                  phone: '',
                  email: '',
                  location: '',
                  status: 'Active',
                  tags: ''
                });
              }}
            >
              Create Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};