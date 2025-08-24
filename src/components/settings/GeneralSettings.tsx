import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { theme } from '../../data/theme';

export const GeneralSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: 'Demo Organization',
    organizationType: 'Government',
    timeZone: 'Asia/Kolkata (GMT+5:30)',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    email: 'admin@organization.com',
    phone: '+91-98765-43210',
    address: '123 Government Street, New Delhi, India',
    website: 'https://organization.gov.in'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving general settings:', formData);
    // Here you would typically save to backend
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: theme.colors.foreground,
          margin: '0 0 0.5rem 0'
        }}>
          General Settings
        </h3>
        <p style={{
          color: theme.colors.mutedForeground,
          margin: 0,
          fontSize: '0.875rem'
        }}>
          Configure basic organization settings and preferences
        </p>
      </div>

      {/* Organization Information */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: theme.colors.muted,
        borderRadius: '0.5rem',
        border: `1px solid ${theme.colors.border}`
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: theme.colors.foreground,
          margin: '0 0 1rem 0'
        }}>
          Organization Information
        </h4>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Organization Name *
            </label>
            <Input
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Organization Type *
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => handleInputChange('organizationType', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Private Company">Private Company</option>
              <option value="Educational Institution">Educational Institution</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem' 
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="organization@example.com"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91-XXXXX-XXXXX"
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Website
            </label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: theme.colors.muted,
        borderRadius: '0.5rem',
        border: `1px solid ${theme.colors.border}`
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: theme.colors.foreground,
          margin: '0 0 1rem 0'
        }}>
          Regional Settings
        </h4>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Time Zone
            </label>
            <select
              value={formData.timeZone}
              onChange={(e) => handleInputChange('timeZone', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
              <option value="America/New_York (GMT-5:00)">America/New_York (GMT-5:00)</option>
              <option value="Europe/London (GMT+0:00)">Europe/London (GMT+0:00)</option>
              <option value="Asia/Dubai (GMT+4:00)">Asia/Dubai (GMT+4:00)</option>
              <option value="Asia/Singapore (GMT+8:00)">Asia/Singapore (GMT+8:00)</option>
              <option value="Australia/Sydney (GMT+10:00)">Australia/Sydney (GMT+10:00)</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
              <option value="Marathi">मराठी (Marathi)</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Date Format
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) => handleInputChange('dateFormat', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '0.5rem',
                backgroundColor: theme.colors.input,
                color: theme.colors.foreground,
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="INR">₹ Indian Rupee (INR)</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
              <option value="GBP">£ British Pound (GBP)</option>
              <option value="AED">د.إ UAE Dirham (AED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        paddingTop: '1rem',
        borderTop: `1px solid ${theme.colors.border}`
      }}>
        <Button onClick={handleSave} style={{ minWidth: '120px' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};