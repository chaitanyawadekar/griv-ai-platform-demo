import React, { useState } from 'react';
import './App.css';

// Import types
import { Screen, SOP, Employee, Workitem, Contact } from './types';

// Import data
import { theme } from './data/theme';
import { sops, employees, sampleWorkitems, sampleContacts } from './data/sampleData';

// Import UI components
import { Button, Icon, Modal } from './components/ui';

// Import screen components
import { SettingsScreen } from './components/screens/SettingsScreen';

const App: React.FC = () => {
  // Navigation state
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Data state
  const [sopsState, setSopsState] = useState<SOP[]>(sops);
  const [employeesState] = useState<Employee[]>(employees);
  const [workitems] = useState<Workitem[]>(sampleWorkitems);
  const [contacts] = useState<Contact[]>(sampleContacts);

  // Modal states
  const [showCreateSOP, setShowCreateSOP] = useState(false);
  const [showEditSOP, setShowEditSOP] = useState(false);
  const [showManageSOPSteps, setShowManageSOPSteps] = useState(false);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showCreateWorkitem, setShowCreateWorkitem] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);

  // Selection states
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const navigationItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: 'dashboard' },
    { id: 'workitems' as Screen, label: 'Workitems', icon: 'workitems' },
    { id: 'contacts' as Screen, label: 'Contacts', icon: 'contacts' },
    { id: 'workflows' as Screen, label: 'Workflows', icon: 'workflows' },
    { id: 'analytics' as Screen, label: 'Analytics', icon: 'analytics' }
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'settings':
        return (
          <SettingsScreen
            sops={sopsState}
            setSops={setSopsState}
            employees={employeesState}
            setShowCreateSOP={setShowCreateSOP}
            setShowEditSOP={setShowEditSOP}
            setShowManageSOPSteps={setShowManageSOPSteps}
            setShowConditionBuilder={setShowConditionBuilder}
            setSelectedSOP={setSelectedSOP}
            setShowAddEmployee={setShowAddEmployee}
            setShowEditEmployee={setShowEditEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        );
      case 'dashboard':
      default:
        return (
          <div style={{
            padding: '2rem',
            backgroundColor: theme.colors.background,
            minHeight: 'calc(100vh - 64px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: theme.colors.foreground,
                  margin: '0 0 0.5rem 0'
                }}>
                  Dashboard
                </h1>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0,
                  fontSize: '0.875rem'
                }}>
                  Welcome to your Griv AI Platform dashboard
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={() => setShowCreateWorkitem(true)}>
                  <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
                  Create Workitem
                </Button>
                <Button onClick={() => setShowCreateContact(true)} variant="outline">
                  <Icon name="plus" size={16} />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Recent Workitems
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {workitems.length} active workitems
                </p>
              </div>

              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Contacts
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {contacts.length} total contacts
                </p>
              </div>

              <div style={{
                backgroundColor: theme.colors.card,
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.foreground,
                  margin: '0 0 1rem 0'
                }}>
                  Active SOPs
                </h3>
                <p style={{
                  color: theme.colors.mutedForeground,
                  margin: 0
                }}>
                  {sopsState.filter(sop => sop.status === 'active').length} active procedures
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: theme.colors.card,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.warning} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '1.25rem',
            color: 'white'
          }}>
            G
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: 0,
            color: theme.colors.foreground
          }}>
            Griv AI Platform
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                border: 'none',
                backgroundColor: activeScreen === item.id ? theme.colors.secondary : 'transparent',
                color: theme.colors.foreground,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeScreen !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.primaryForeground,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              A
            </div>
            <Icon name="chevronDown" size={16} color={theme.colors.mutedForeground} />
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              boxShadow: theme.shadow.md,
              minWidth: '180px',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem' }}>
                <button
                  onClick={() => {
                    setActiveScreen('settings');
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.foreground,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="settings" size={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    console.log('Logout');
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.foreground,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon name="logout" size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {renderScreen()}

      {/* Modals */}
      <Modal
        show={showCreateSOP}
        onClose={() => setShowCreateSOP(false)}
        title="Create New SOP"
        size="lg"
      >
        <div>
          <p>SOP creation form would go here...</p>
        </div>
      </Modal>

      <Modal
        show={showCreateWorkitem}
        onClose={() => setShowCreateWorkitem(false)}
        title="Create New Workitem"
        size="lg"
      >
        <div>
          <p>Workitem creation form would go here...</p>
        </div>
      </Modal>

      <Modal
        show={showCreateContact}
        onClose={() => setShowCreateContact(false)}
        title="Add New Contact"
        size="lg"
      >
        <div>
          <p>Contact creation form would go here...</p>
        </div>
      </Modal>
    </div>
  );
};

export default App;