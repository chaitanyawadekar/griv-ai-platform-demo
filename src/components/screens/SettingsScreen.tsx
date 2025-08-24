import React, { useState } from 'react';
import { SettingsTab, SOP, Employee } from '../../types';
import { Icon, Button } from '../ui';
import { SOPConfiguration } from '../settings/SOPConfiguration';
import { GeneralSettings } from '../settings/GeneralSettings';
import { FieldConfiguration } from '../settings/FieldConfiguration';
import { theme } from '../../data/theme';

interface SettingsScreenProps {
  sops: SOP[];
  setSops: React.Dispatch<React.SetStateAction<SOP[]>>;
  employees: Employee[];
  setShowCreateSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowManageSOPSteps: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBuilder: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSOP: React.Dispatch<React.SetStateAction<SOP | null>>;
  setShowAddEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  sops,
  setSops,
  employees,
  setShowCreateSOP,
  setShowEditSOP,
  setShowManageSOPSteps,
  setShowConditionBuilder,
  setSelectedSOP,
  setShowAddEmployee,
  setShowEditEmployee,
  setSelectedEmployee
}) => {
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [selectedSOPType, setSelectedSOPType] = useState<'workitem' | 'contact'>('workitem');

  const settingsTabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: 'settings' },
    { id: 'fields' as SettingsTab, label: 'Configuration', icon: 'fields' },
    { id: 'sops' as SettingsTab, label: 'SOP Configuration', icon: 'workflow' },
    { id: 'team' as SettingsTab, label: 'Team Management', icon: 'team' },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: 'integration' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'bell' },
    { id: 'security' as SettingsTab, label: 'Security', icon: 'shield' },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: 'star' }
  ];

  return (
    <div style={{
      padding: '2rem',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: theme.colors.background
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        borderBottom: `1px solid ${theme.colors.border}`,
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: theme.colors.foreground,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Icon name="settings" size={32} color={theme.colors.primary} />
          Settings
        </h1>
        <p style={{
          fontSize: '1rem',
          color: theme.colors.mutedForeground,
          margin: '0.5rem 0 0 0'
        }}>
          Manage your organization settings and preferences
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
        {/* Settings Navigation */}
        <div style={{
          minWidth: '240px',
          maxWidth: '240px',
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          height: 'fit-content'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  border: 'none',
                  backgroundColor: settingsTab === tab.id ? theme.colors.primary : 'transparent',
                  color: settingsTab === tab.id ? theme.colors.primaryForeground : theme.colors.foreground,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (settingsTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (settingsTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon name={tab.icon} size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div style={{ 
          flex: 1,
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '2rem'
        }}>
          {settingsTab === 'general' && (
            <GeneralSettings />
          )}

          {settingsTab === 'fields' && (
            <FieldConfiguration />
          )}

          {settingsTab === 'sops' && (
            <SOPConfiguration
              sops={sops}
              setSops={setSops}
              selectedSOPType={selectedSOPType}
              setSelectedSOPType={setSelectedSOPType}
              setShowCreateSOP={setShowCreateSOP}
              setShowEditSOP={setShowEditSOP}
              setShowManageSOPSteps={setShowManageSOPSteps}
              setSelectedSOP={setSelectedSOP}
            />
          )}

          {settingsTab === 'team' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: 0
                }}>
                  Team Management
                </h3>
                <Button onClick={() => setShowAddEmployee(true)}>
                  <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                  Add Employee
                </Button>
              </div>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Manage your team members, roles, and permissions. {employees.length} employees configured.
              </p>
            </div>
          )}

          {settingsTab === 'integrations' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Integrations
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Connect third-party services and APIs
              </p>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Notifications
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Configure notification preferences and delivery settings
              </p>
            </div>
          )}

          {settingsTab === 'security' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Security
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                Manage security settings, access controls, and authentication
              </p>
            </div>
          )}

          {settingsTab === 'billing' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: theme.colors.foreground,
                margin: 0
              }}>
                Billing
              </h3>
              <p style={{
                color: theme.colors.mutedForeground,
                margin: 0
              }}>
                View billing information, manage subscriptions, and payment methods
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};