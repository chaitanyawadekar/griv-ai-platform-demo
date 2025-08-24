import React from 'react';
import { 
  TableProps, 
  TableRowProps, 
  TableCellProps, 
  TableHeaderProps, 
  TableHeadProps, 
  TableBodyProps 
} from '../../types';
import { theme } from '../../data/theme';

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      {children}
    </table>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead style={{ backgroundColor: theme.colors.muted }}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (
    <tbody>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, style, onMouseEnter, onMouseLeave }) => {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: `1px solid ${theme.colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onMouseEnter={onMouseEnter || ((e) => {
        if (onClick && !onMouseEnter) {
          e.currentTarget.style.backgroundColor = theme.colors.muted;
        }
      })}
      onMouseLeave={onMouseLeave || ((e) => {
        if (onClick && !onMouseLeave) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      })}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<TableHeadProps> = ({ children, onClick, style }) => {
  return (
    <th
      onClick={onClick}
      style={{
        padding: '0.75rem',
        textAlign: 'left',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: theme.colors.foreground,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableCellProps> = ({ children, style, onClick }) => {
  return (
    <td
      onClick={onClick}
      style={{
        padding: '0.75rem',
        fontSize: '0.875rem',
        color: theme.colors.foreground,
        verticalAlign: 'top',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </td>
  );
};