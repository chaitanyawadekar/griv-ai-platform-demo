import { Theme } from '../types';

export const theme: Theme = {
  colors: {
    background: '#f8fafc',
    foreground: '#0f172a',
    primary: 'rgb(234, 88, 12)', // Orange theme matching original
    primaryForeground: '#ffffff',
    secondary: '#f8fafc',
    secondaryForeground: '#0f172a',
    muted: '#f8fafc',
    mutedForeground: '#64748b',
    card: '#ffffff',
    cardForeground: '#0f172a',
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    border: '#e2e8f0',
    input: '#ffffff',
    ring: 'rgb(234, 88, 12)',
    success: '#22c55e',
    warning: '#f59e0b',
    destructive: '#ef4444',
    info: '#3b82f6'
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  }
};