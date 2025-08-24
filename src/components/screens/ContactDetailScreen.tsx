import React, { useState } from 'react';
import { Contact, ContactType, Theme, SOP, Employee } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';

interface ContactDetailScreenProps {
  contact: Contact;
  contactType: ContactType;
  theme: Theme;
  sops: SOP[];
  employees: Employee[];
  onBack: () => void;
  onContactUpdate: (contact: Contact) => void;
}

interface ActivityItem {
  id: string;
  type: 'comment' | 'status_change' | 'sop_triggered' | 'field_update';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  icon: string;
}

export const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({
  contact,
  contactType,
  theme,
  sops,
  employees,
  onBack,
  onContactUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'sops' | 'timeline'>('overview');
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Mock activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'comment',
      title: 'Comment added',
      description: 'Initial contact made via phone call',
      user: 'John Smith',
      timestamp: '2 hours ago',
      icon: 'message'
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Status changed',
      description: 'Status updated from Inactive to Active',
      user: 'Sarah Johnson',
      timestamp: '1 day ago',
      icon: 'check'
    },
    {
      id: '3',
      type: 'sop_triggered',
      title: 'SOP triggered',
      description: 'Customer Onboarding Process initiated',
      user: 'System',
      timestamp: '2 days ago',
      icon: 'checklist'
    }
  ];

  const handleStatusChange = (newStatus: 'Active' | 'Inactive') => {
    const updatedContact = { ...contact, status: newStatus };
    onContactUpdate(updatedContact);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      // In a real app, this would add the comment to the database
      setComment('');
      setShowCommentModal(false);
    }
  };

  const applicableSOPs = sops.filter(sop => 
    sop.appliesTo === 'contact' &&
    sop.status === 'active' &&
    sop.conditions.some(condition => 
      condition.field === 'type' && condition.value === contact.type
    )
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'info' },
    { id: 'activity' as const, label: 'Activity', icon: 'message' },
    { id: 'sops' as const, label: 'SOPs', icon: 'checklist' },
    { id: 'timeline' as const, label: 'Timeline', icon: 'calendar' }
  ];

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      {/* Left Column - Contact Details */}
      <div>
        <div style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: theme.colors.foreground,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Contact Information
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'active') handleStatusChange('Active');
                else if (value === 'inactive') handleStatusChange('Inactive');
                else if (value === 'add_comment') setShowCommentModal(true);
                e.target.value = '';
              }}
              style={{
                padding: '6px 12px',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                fontSize: '14px'
              }}
            >
              <option value="">Actions</option>
              <option value="active">Mark Active</option>
              <option value="inactive">Mark Inactive</option>
              <option value="add_comment">Add Comment</option>
              <option value="edit">Edit Contact</option>
              <option value="duplicate">Duplicate</option>
              <option value="delete">Delete</option>
            </select>
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Name</label>
              <div style={{ fontSize: '14px', color: theme.colors.foreground, marginTop: '4px' }}>{contact.name}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Type</label>
              <div style={{ marginTop: '4px' }}>
                <Badge
                  variant="default"
                  style={{
                    backgroundColor: `${contactType.color}15`,
                    color: contactType.color,
                    fontSize: '12px'
                  }}
                >
                  {contact.type}
                </Badge>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Phone</label>
              <div style={{ fontSize: '14px', color: theme.colors.foreground, marginTop: '4px' }}>{contact.phone}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Email</label>
              <div style={{ fontSize: '14px', color: theme.colors.foreground, marginTop: '4px' }}>{contact.email}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Location</label>
              <div style={{ fontSize: '14px', color: theme.colors.foreground, marginTop: '4px' }}>{contact.location}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Status</label>
              <div style={{ marginTop: '4px' }}>
                <Badge
                  variant={contact.status === 'Active' ? 'success' : 'secondary'}
                  style={{ fontSize: '12px' }}
                >
                  {contact.status}
                </Badge>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Last Contact</label>
              <div style={{ fontSize: '14px', color: theme.colors.foreground, marginTop: '4px' }}>{contact.lastContact}</div>
            </div>
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: theme.colors.mutedForeground, textTransform: 'uppercase' }}>Tags</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
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
            </div>
          )}
        </div>

        {/* Applicable SOPs */}
        {applicableSOPs.length > 0 && (
          <div style={{
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.foreground,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Icon name="checklist" size={20} />
              Applicable SOPs ({applicableSOPs.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {applicableSOPs.map(sop => (
                <div
                  key={sop.id}
                  style={{
                    padding: '12px',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: theme.colors.background,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: theme.colors.foreground, fontSize: '14px' }}>
                        {sop.name}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.colors.mutedForeground, marginTop: '2px' }}>
                        {sop.description}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.colors.mutedForeground, marginTop: '4px' }}>
                        {sop.steps.length} steps • Version {sop.version}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Trigger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Quick Stats */}
      <div>
        <div style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: theme.colors.foreground
          }}>
            Quick Stats
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>Total Interactions</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.foreground }}>24</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>Active Workitems</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.foreground }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>Last Activity</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.foreground }}>2 hours ago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>Satisfaction Score</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.success }}>4.2/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.colors.foreground }}>
          Activity Feed
        </h3>
        <Button
          variant="outline"
          onClick={() => setShowCommentModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Icon name="plus" size={14} />
          Add Comment
        </Button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activities.map(activity => (
          <div
            key={activity.id}
            style={{
              backgroundColor: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              gap: '12px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon name={activity.icon} size={16} color={theme.colors.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.foreground }}>
                  {activity.title}
                </h4>
                <span style={{ fontSize: '12px', color: theme.colors.mutedForeground }}>
                  {activity.timestamp}
                </span>
              </div>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: theme.colors.foreground }}>
                {activity.description}
              </p>
              <span style={{ fontSize: '12px', color: theme.colors.mutedForeground }}>
                by {activity.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSOPs = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: theme.colors.foreground }}>
        Standard Operating Procedures
      </h3>
      
      {applicableSOPs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: theme.colors.mutedForeground
        }}>
          <Icon name="checklist" size={48} color={theme.colors.mutedForeground} />
          <h4 style={{ margin: '16px 0 8px', fontSize: '16px', fontWeight: '500' }}>
            No SOPs applicable
          </h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            No Standard Operating Procedures are configured for {contact.type} contacts
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applicableSOPs.map(sop => (
            <div
              key={sop.id}
              style={{
                backgroundColor: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: theme.colors.foreground }}>
                    {sop.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: theme.colors.mutedForeground }}>
                    {sop.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    View Steps
                  </Button>
                  <Button variant="default" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Trigger SOP
                  </Button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme.colors.mutedForeground }}>
                <span>{sop.steps.length} steps</span>
                <span>Version {sop.version}</span>
                <span>Created by {sop.createdBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTimeline = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: theme.colors.foreground }}>
        Contact Timeline
      </h3>
      
      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '8px',
          top: '0',
          bottom: '0',
          width: '2px',
          backgroundColor: theme.colors.border
        }} />
        
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              position: 'relative',
              paddingBottom: index < activities.length - 1 ? '24px' : '0'
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '-20px',
              top: '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: theme.colors.background,
              border: `2px solid ${theme.colors.primary}`,
              zIndex: 1
            }} />
            
            <div style={{
              backgroundColor: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.colors.foreground }}>
                  {activity.title}
                </h4>
                <span style={{ fontSize: '12px', color: theme.colors.mutedForeground }}>
                  {activity.timestamp}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: theme.colors.foreground }}>
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <Button
          variant="ghost"
          onClick={onBack}
          style={{
            padding: '6px',
            minWidth: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="chevronLeft" size={20} />
        </Button>
        
        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: theme.colors.foreground
          }}>
            {contact.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge
              variant="default"
              style={{
                backgroundColor: `${contactType.color}15`,
                color: contactType.color
              }}
            >
              {contact.type}
            </Badge>
            <Badge
              variant={contact.status === 'Active' ? 'success' : 'secondary'}
            >
              {contact.status}
            </Badge>
            <span style={{ fontSize: '14px', color: theme.colors.mutedForeground }}>
              Last contact: {contact.lastContact}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.colors.border}`
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? theme.colors.primary : theme.colors.mutedForeground,
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: activeTab === tab.id ? 2 : 1,
                ...(activeTab === tab.id && {
                  backgroundColor: theme.colors.card,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  borderTop: `1px solid ${theme.colors.border}`,
                  borderLeft: `1px solid ${theme.colors.border}`,
                  borderRight: `1px solid ${theme.colors.border}`,
                  borderBottom: `2px solid ${theme.colors.card}`,
                  marginBottom: '-1px'
                })
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = theme.colors.foreground;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = theme.colors.mutedForeground;
                }
              }}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'sops' && renderSOPs()}
        {activeTab === 'timeline' && renderTimeline()}
      </div>

      {/* Add Comment Modal */}
      <Modal
        show={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        title="Add Comment"
        size="md"
      >
        <div style={{ padding: '20px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.colors.background,
              color: theme.colors.foreground,
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
              variant="outline"
              onClick={() => setShowCommentModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddComment}
              disabled={!comment.trim()}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};