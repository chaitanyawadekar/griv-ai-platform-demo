import React, { useState } from 'react';
import { Theme, User, UserTenant } from '../../types';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { Button } from './Button';
import { getRoleColor, getPlanColor, getStatusColor } from '../../data/tenantData';

interface TenantSwitcherProps {
  user: User;
  currentTenantId: string;
  onTenantSwitch: (tenantId: string) => void;
  theme: Theme;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  user,
  currentTenantId,
  onTenantSwitch,
  theme
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentTenant = user.tenants.find(ut => ut.tenant.id === currentTenantId);
  
  const handleTenantSelect = (tenantId: string) => {
    onTenantSwitch(tenantId);
    setIsOpen(false);
  };

  const formatLastAccessed = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!currentTenant) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Current Tenant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: isOpen ? theme.colors.secondary : 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          color: theme.colors.foreground,
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '280px',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = theme.colors.muted;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '600' }}>
              {currentTenant.tenant.displayName}
            </div>
            {/* Token Display with Pulsing Animation */}
            {currentTenant.tenant.tokens && (
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                color: theme.colors.primary,
                animation: 'pulse 2s infinite',
                marginTop: '2px'
              }}>
                {currentTenant.tenant.tokens.current.toLocaleString()} tokens
              </div>
            )}
          </div>
        </div>
        <Icon 
          name={isOpen ? 'chevronUp' : 'chevronDown'} 
          size={14} 
          color={theme.colors.mutedForeground} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: '320px',
              marginTop: '0.25rem',
              backgroundColor: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px',
              boxShadow: theme.shadow.lg,
              zIndex: 999,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1rem 0.75rem',
              borderBottom: `1px solid ${theme.colors.border}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Icon name="building" size={16} color={theme.colors.primary} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  Switch Organization
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                You have access to {user.tenants.length} organization{user.tenants.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Tenant List */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {user.tenants
                .sort((a, b) => {
                  // Sort by: current first, then default, then by name
                  if (a.tenant.id === currentTenantId) return -1;
                  if (b.tenant.id === currentTenantId) return 1;
                  if (a.isDefault && !b.isDefault) return -1;
                  if (b.isDefault && !a.isDefault) return 1;
                  return a.tenant.displayName.localeCompare(b.tenant.displayName);
                })
                .map((userTenant) => (
                  <button
                    key={userTenant.tenant.id}
                    onClick={() => handleTenantSelect(userTenant.tenant.id)}
                    disabled={userTenant.tenant.id === currentTenantId}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: userTenant.tenant.id === currentTenantId 
                        ? theme.colors.primary + '10' 
                        : 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${theme.colors.border}`,
                      cursor: userTenant.tenant.id === currentTenantId ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (userTenant.tenant.id !== currentTenantId) {
                        e.currentTarget.style.backgroundColor = theme.colors.muted;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (userTenant.tenant.id !== currentTenantId) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {/* Tenant Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: theme.colors.foreground
                        }}>
                          {userTenant.tenant.displayName}
                        </span>
                        
                        
                        {userTenant.isDefault && userTenant.tenant.id !== currentTenantId && (
                          <Badge 
                            variant="secondary" 
                            style={{ fontSize: '0.625rem' }}
                          >
                            Default
                          </Badge>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                        color: theme.colors.mutedForeground
                      }}>
                        <span style={{
                          color: getPlanColor(userTenant.tenant.plan),
                          textTransform: 'capitalize',
                          fontWeight: '500'
                        }}>
                          {userTenant.tenant.plan}
                        </span>
                        
                        {userTenant.tenant.tokens && (
                          <span style={{
                            color: theme.colors.primary,
                            fontWeight: '600'
                          }}>
                            {userTenant.tenant.tokens.current.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(userTenant.tenant.status)
                      }} />
                    </div>
                  </button>
                ))
              }
            </div>

            {/* Footer */}
            <div style={{
              padding: '0.75rem 1rem',
              borderTop: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.muted + '50'
            }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                style={{
                  width: '100%',
                  fontSize: '0.75rem',
                  color: theme.colors.mutedForeground,
                  justifyContent: 'center'
                }}
              >
                <Icon name="plus" size={12} />
                Request access to new organization
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};