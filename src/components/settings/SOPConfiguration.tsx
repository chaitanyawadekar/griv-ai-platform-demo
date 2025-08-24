import React from 'react';
import { SOP } from '../../types';
import { Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Icon } from '../ui';
import { theme } from '../../data/theme';

interface SOPConfigurationProps {
  sops: SOP[];
  setSops: React.Dispatch<React.SetStateAction<SOP[]>>;
  selectedSOPType: 'workitem' | 'contact';
  setSelectedSOPType: React.Dispatch<React.SetStateAction<'workitem' | 'contact'>>;
  setShowCreateSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditSOP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowManageSOPSteps: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSOP: React.Dispatch<React.SetStateAction<SOP | null>>;
}

export const SOPConfiguration: React.FC<SOPConfigurationProps> = ({
  sops,
  setSops,
  selectedSOPType,
  setSelectedSOPType,
  setShowCreateSOP,
  setShowEditSOP,
  setShowManageSOPSteps,
  setSelectedSOP
}) => {
  return (
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
          SOP Configuration
        </h3>
        <Button onClick={() => setShowCreateSOP(true)}>
          <Icon name="plus" size={16} color={theme.colors.primaryForeground} />
          Create SOP
        </Button>
      </div>

      {/* SOP Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.card,
          borderRadius: '0.5rem',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: theme.colors.mutedForeground, 
            margin: '0 0 0.5rem 0' 
          }}>
            Active SOPs
          </h4>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: theme.colors.foreground, 
            margin: 0 
          }}>
            {sops.filter(sop => sop.status === 'active').length}
          </p>
        </div>
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.card,
          borderRadius: '0.5rem',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: theme.colors.mutedForeground, 
            margin: '0 0 0.5rem 0' 
          }}>
            Total Steps
          </h4>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: theme.colors.foreground, 
            margin: 0 
          }}>
            {sops.reduce((total, sop) => total + sop.steps.length, 0)}
          </p>
        </div>
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.card,
          borderRadius: '0.5rem',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: theme.colors.mutedForeground, 
            margin: '0 0 0.5rem 0' 
          }}>
            Workitem SOPs
          </h4>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: theme.colors.foreground, 
            margin: 0 
          }}>
            {sops.filter(sop => sop.appliesTo === 'workitem').length}
          </p>
        </div>
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.card,
          borderRadius: '0.5rem',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: theme.colors.mutedForeground, 
            margin: '0 0 0.5rem 0' 
          }}>
            Contact SOPs
          </h4>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: theme.colors.foreground, 
            margin: 0 
          }}>
            {sops.filter(sop => sop.appliesTo === 'contact').length}
          </p>
        </div>
      </div>

      {/* SOP Type Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: theme.colors.foreground 
        }}>
          Filter by type:
        </span>
        <Button
          variant={selectedSOPType === 'workitem' ? 'default' : 'outline'}
          onClick={() => setSelectedSOPType('workitem')}
          style={{ height: '2rem', fontSize: '0.75rem' }}
        >
          Workitem SOPs
        </Button>
        <Button
          variant={selectedSOPType === 'contact' ? 'default' : 'outline'}
          onClick={() => setSelectedSOPType('contact')}
          style={{ height: '2rem', fontSize: '0.75rem' }}
        >
          Contact SOPs
        </Button>
      </div>

      {/* SOP Table */}
      <div style={{
        backgroundColor: theme.colors.card,
        borderRadius: '0.5rem',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden'
      }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sops
              .filter(sop => sop.appliesTo === selectedSOPType)
              .map((sop) => (
              <TableRow key={sop.id}>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '500' }}>{sop.name}</div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: theme.colors.mutedForeground,
                      marginTop: '0.25rem'
                    }}>
                      {sop.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={sop.appliesTo === 'workitem' ? 'default' : 'secondary'}>
                    {sop.appliesTo}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div style={{ fontSize: '0.75rem' }}>
                    {sop.conditions.length > 0 && (
                      <div>
                        {sop.conditions.slice(0, 2).map((condition, idx) => (
                          <div key={idx} style={{ marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: '500' }}>{condition.field}</span>
                            <span style={{ color: theme.colors.mutedForeground }}>
                              {' '}{condition.operator} {condition.value}
                            </span>
                          </div>
                        ))}
                        {sop.conditions.length > 2 && (
                          <span style={{ color: theme.colors.mutedForeground }}>
                            +{sop.conditions.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div>{sop.steps.length} total steps</div>
                    <div style={{ color: theme.colors.mutedForeground }}>
                      {sop.steps.filter(step => step.mandatory).length} mandatory
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    sop.status === 'active' ? 'default' : 
                    sop.status === 'draft' ? 'secondary' : 
                    'destructive'
                  }>
                    {sop.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div>v{sop.version}</div>
                    <div style={{ color: theme.colors.mutedForeground }}>
                      {new Date(sop.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSOP(sop);
                        setShowManageSOPSteps(true);
                      }}
                    >
                      <Icon name="checklist" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSOP(sop);
                        setShowEditSOP(true);
                      }}
                    >
                      <Icon name="edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSops(sops.filter(s => s.id !== sop.id));
                      }}
                    >
                      <Icon name="trash" size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};