import React, { useState, useEffect } from 'react';
import { Theme, Widget, AIInsight } from '../../types';
import { sampleWidgets, sampleAIInsights } from '../../data/sampleData';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { WidgetDataProvider } from '../../utils/widgetDataProvider';
import { AddWidgetModal } from '../modals/AddWidgetModal';

interface OverviewScreenProps {
  theme: Theme;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ theme }) => {
  const [widgets, setWidgets] = useState<Widget[]>(sampleWidgets);
  const [insights] = useState<AIInsight[]>(sampleAIInsights);
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(true);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showWidgetMenu, setShowWidgetMenu] = useState<string | null>(null);
  
  // Close widget menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (showWidgetMenu) {
        setShowWidgetMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showWidgetMenu]);

  const handleAddWidget = () => {
    setShowAddWidgetModal(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    setShowDeleteConfirm(null);
  };


  // Drag and Drop functions
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, widget: Widget) => {
    setDraggedWidget(widget);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', widget.id);
    
    // Add some visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedWidget(null);
    setDragOverIndex(null);
    
    // Reset visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedWidget) return;
    
    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget.id);
    if (draggedIndex === targetIndex) return;
    
    // Create new widgets array with reordered items
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(draggedIndex, 1);
    
    // Adjust target index if we're moving forward
    const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newWidgets.splice(adjustedTargetIndex, 0, movedWidget);
    
    setWidgets(newWidgets);
    setDraggedWidget(null);
    setDragOverIndex(null);
  };



  const renderMetricCard = (widget: Widget) => {
    const widgetData = WidgetDataProvider.getWidgetData(widget);
    
    const trend = widgetData.summary.filterPercentage ? 
      `+${Math.floor(widgetData.summary.filterPercentage)}%` : 
      '+0%';
    
    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{
            backgroundColor: widget.config.color + '20',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Icon name={widget.config.icon || 'activity'} size={20} color={widget.config.color} />
          </div>
        </div>
        
        <div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: theme.colors.foreground,
            marginBottom: '4px'
          }}>
            {widgetData.aggregatedValue}
          </div>
          <div style={{
            fontSize: '14px',
            color: theme.colors.mutedForeground,
            marginBottom: '8px'
          }}>
            {widget.title}
          </div>
          <div style={{
            fontSize: '12px',
            color: theme.colors.mutedForeground,
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{widgetData.filteredData.length} of {widgetData.rawData.length}</span>
            {widget.dataSource.conditions && widget.dataSource.conditions.length > 0 && (
              <Badge variant="secondary" style={{ fontSize: '10px' }}>
                {widget.dataSource.conditions.length} filter{widget.dataSource.conditions.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {widget.config.showTrend && (
            <div style={{
              fontSize: '12px',
              color: trend.startsWith('+') ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Icon 
                name={trend.startsWith('+') ? 'trendingUp' : 'trendingDown'} 
                size={12} 
              />
              {trend} filtered
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChart = (widget: Widget) => {
    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
        </div>
        
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.muted,
          borderRadius: '8px',
          color: theme.colors.mutedForeground,
          fontSize: '14px',
          minHeight: 0
        }}>
          {widget.config.chartType?.toUpperCase()} Chart - {widget.title}
        </div>
      </div>
    );
  };

  const renderProgressBar = (widget: Widget) => {
    const progress = 68; // Mock progress value
    
    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{
            backgroundColor: widget.config.color + '20',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Icon name={widget.config.icon || 'target'} size={20} color={widget.config.color} />
          </div>
        </div>
        
        <div>
          <div style={{
            fontSize: '14px',
            color: theme.colors.mutedForeground,
            marginBottom: '8px'
          }}>
            {widget.title}
          </div>
          <div style={{
            backgroundColor: theme.colors.muted,
            borderRadius: '8px',
            height: '8px',
            marginBottom: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: widget.config.color,
              height: '100%',
              width: `${progress}%`,
              borderRadius: '8px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '12px',
            color: theme.colors.foreground,
            fontWeight: '600'
          }}>
            {progress}% completed
          </div>
        </div>
      </div>
    );
  };

  const renderActivityFeed = (widget: Widget) => {
    const activities = [
      { time: '2 min ago', action: 'Completed workitem', item: 'Tech Solutions Lead' },
      { time: '15 min ago', action: 'Created contact', item: 'Mumbai Manufacturing' },
      { time: '1 hour ago', action: 'Updated status', item: 'Service Quality Issues' },
      { time: '2 hours ago', action: 'Assigned workitem', item: 'Feature Enhancement' }
    ];

    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {activities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              borderBottom: index < activities.length - 1 ? `1px solid ${theme.colors.border}` : 'none'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  color: theme.colors.foreground,
                  marginBottom: '2px'
                }}>
                  {activity.action} <span style={{ fontWeight: '600' }}>{activity.item}</span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: theme.colors.mutedForeground
                }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuickActions = (widget: Widget) => {
    const actions = [
      { icon: 'plus', label: 'New Workitem', color: '#3b82f6' },
      { icon: 'users', label: 'Add Contact', color: '#10b981' },
      { icon: 'calendar', label: 'Schedule Meeting', color: '#f59e0b' },
      { icon: 'fileText', label: 'Create Report', color: '#8b5cf6' }
    ];

    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => console.log(`Quick action: ${action.label}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              <Icon name={action.icon} size={14} color={action.color} />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonalSchedule = (widget: Widget) => {
    const schedule = [
      { time: '9:00 AM', task: 'Team standup meeting', type: 'meeting' },
      { time: '10:30 AM', task: 'Review high-priority leads', type: 'work' },
      { time: '12:00 PM', task: 'Lunch break', type: 'break' },
      { time: '2:00 PM', task: 'Client presentation prep', type: 'work' },
      { time: '4:00 PM', task: 'Follow up with prospects', type: 'calls' }
    ];

    return (
      <div style={{
        backgroundColor: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        boxShadow: theme.shadow.sm,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {schedule.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 0',
              borderBottom: index < schedule.length - 1 ? `1px solid ${theme.colors.border}` : 'none'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme.colors.mutedForeground,
                minWidth: '60px'
              }}>
                {item.time}
              </div>
              <div style={{
                flex: 1,
                fontSize: '14px',
                color: theme.colors.foreground
              }}>
                {item.task}
              </div>
              <Badge 
                variant={item.type === 'meeting' ? 'default' : item.type === 'work' ? 'secondary' : 'warning'}
                style={{ fontSize: '10px' }}
              >
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metric_card':
        return renderMetricCard(widget);
      case 'chart':
        return renderChart(widget);
      case 'progress_bar':
        return renderProgressBar(widget);
      case 'activity_feed':
        return renderActivityFeed(widget);
      case 'quick_actions':
        return renderQuickActions(widget);
      case 'table':
        return renderPersonalSchedule(widget);
      default:
        return <div>Unknown widget type</div>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return theme.colors.mutedForeground;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return 'trendingUp';
      case 'anomaly': return 'alertTriangle';
      case 'prediction': return 'brain';
      case 'recommendation': return 'lightBulb';
      default: return 'info';
    }
  };

  return (
    <>
      <style>
        {`
          .widget-container:hover .widget-controls {
            opacity: 1 !important;
          }
          .widget-container:hover {
            cursor: default !important;
          }
        `}
      </style>
      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 64px)', 
        gap: '20px', 
        padding: '20px',
        backgroundColor: theme.colors.background,
        overflow: 'hidden'
    }}>
      {/* Main Dashboard Area */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minWidth: 0,
        paddingRight: '4px',
        height: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: theme.colors.foreground, margin: '0 0 8px 0' }}>
              Good morning! 👋
            </h1>
            <p style={{ fontSize: '16px', color: theme.colors.mutedForeground, margin: 0 }}>
              Here's what's happening with your day and work
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <Button 
              onClick={handleAddWidget}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Icon name="plus" size={16} />
              Add Widget
            </Button>
            <p style={{ fontSize: '14px', color: theme.colors.mutedForeground, margin: 0, fontStyle: 'italic' }}>
              💡 Drag widgets to reorder them
            </p>
          </div>
        </div>

        {/* Robust 2D Drag & Drop Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isInsightsPanelOpen ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gridAutoRows: '180px',
          gap: '20px',
          width: '100%',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}>
          {widgets.map((widget, index) => {
            // Determine widget grid sizing
            let colSpan = 1;
            let rowSpan = 1;
            
            switch (widget.type) {
              case 'metric_card':
              case 'progress_bar':
              case 'quick_actions':
                colSpan = 1;
                rowSpan = 1;
                break;
              case 'chart':
                colSpan = isInsightsPanelOpen ? 2 : 2; // 2 columns
                rowSpan = 2; // 2 rows (360px tall)
                break;
              case 'activity_feed':
              case 'table':
                colSpan = isInsightsPanelOpen ? 3 : 2; // Full width when panel open
                rowSpan = 2; // 2 rows (360px tall)
                break;
            }
            
            const isDragOver = dragOverIndex === index;
            const isDragging = draggedWidget?.id === widget.id;
            
            return (
              <div
                key={widget.id}
                className="widget-container"
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  position: 'relative',
                  cursor: isDragging ? 'grabbing' : 'default',
                  transform: isDragging ? 'scale(0.95) rotate(2deg)' : 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isDragOver ? `0 0 0 3px ${theme.colors.primary}40` : 'none',
                  opacity: isDragging ? 0.7 : 1,
                  zIndex: isDragging ? 1000 : 1
                }}
              >
                {/* Widget Controls - Three Dots Menu (Hidden by default, shown on hover) */}
                <div
                  className="widget-controls"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10,
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none'
                  }}
                >
                  {/* Three dots menu trigger */}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowWidgetMenu(showWidgetMenu === widget.id ? null : widget.id);
                    }}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: theme.colors.background,
                      cursor: 'pointer',
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: theme.shadow.sm,
                      pointerEvents: 'auto'
                    }}
                  >
                    <Icon name="moreVertical" size={16} color={theme.colors.mutedForeground} />
                  </div>
                  
                  {/* Dropdown Menu */}
                  {showWidgetMenu === widget.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        marginTop: '4px',
                        backgroundColor: theme.colors.background,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        boxShadow: theme.shadow.md,
                        overflow: 'hidden',
                        minWidth: '120px',
                        pointerEvents: 'auto'
                      }}
                    >
                      {/* Edit Option */}
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowWidgetMenu(null);
                          // TODO: Add edit functionality
                          console.log('Edit widget:', widget.id);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: `1px solid ${theme.colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: theme.colors.foreground,
                          backgroundColor: 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.muted}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon name="edit" size={16} color={theme.colors.mutedForeground} />
                        Edit
                      </div>
                      
                      {/* Delete Option */}
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowWidgetMenu(null);
                          setShowDeleteConfirm(widget.id);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: '#ef4444',
                          backgroundColor: 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon name="trash" size={16} color="#ef4444" />
                        Delete
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Drop indicator */}
                {isDragOver && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      border: `3px dashed ${theme.colors.primary}`,
                      borderRadius: '12px',
                      pointerEvents: 'none',
                      zIndex: 5,
                      backgroundColor: `${theme.colors.primary}10`
                    }}
                  />
                )}
                
                {renderWidget(widget)}
              </div>
            );
          })}
        </div>
        
      </div>

      {/* AI Insights Sidebar */}
      {isInsightsPanelOpen ? (
        <div style={{ 
          width: '320px',
          flexShrink: 0,
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100%',
          boxShadow: theme.shadow.md,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon name="brain" size={20} color="#ff8c00" />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
                AI Insights
              </h2>
            </div>
            <div
              onClick={() => setIsInsightsPanelOpen(false)}
              style={{
                padding: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.muted;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Collapse AI Insights"
            >
              <Icon name="chevronRight" size={16} color={theme.colors.mutedForeground} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {insights.map((insight) => (
              <div
                key={insight.id}
                style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    backgroundColor: getPriorityColor(insight.priority) + '20',
                    padding: '6px',
                    borderRadius: '6px',
                    flexShrink: 0
                  }}>
                    <Icon 
                      name={getInsightIcon(insight.type)} 
                      size={16} 
                      color={getPriorityColor(insight.priority)} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: theme.colors.foreground, 
                        margin: 0,
                        flex: 1
                      }}>
                        {insight.title}
                      </h4>
                      <Badge 
                        variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'warning' : 'secondary'}
                        style={{ fontSize: '10px' }}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <p style={{ 
                      fontSize: '12px', 
                      color: theme.colors.mutedForeground, 
                      margin: '0 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {insight.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <div style={{
                        fontSize: '11px',
                        color: theme.colors.mutedForeground,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Icon name="zap" size={10} />
                        {insight.confidence}% confident
                      </div>
                      {insight.actionable && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button variant="outline" style={{ fontSize: '12px' }}>
              View All Insights
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsInsightsPanelOpen(true)}
          style={{
            width: '48px',
            flexShrink: 0,
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '16px 4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: theme.shadow.sm,
            transition: 'all 0.3s ease',
            gap: '12px',
            height: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.muted;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.card;
          }}
          title="Expand AI Insights"
        >
          <Icon name="brain" size={18} color="#ff8c00" />
          <div style={{ 
            transform: 'rotate(-90deg)',
            fontSize: '9px',
            fontWeight: '600',
            color: theme.colors.mutedForeground,
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px',
            marginTop: '8px'
          }}>
            INSIGHTS
          </div>
          <div style={{ marginTop: '12px' }}>
            <Icon name="chevronLeft" size={12} color={theme.colors.mutedForeground} />
          </div>
        </div>
      )}

      {/* Enhanced Add Widget Modal */}
      <AddWidgetModal
        show={showAddWidgetModal}
        onClose={() => setShowAddWidgetModal(false)}
        onCreate={(widget) => {
          setWidgets([...widgets, widget]);
          setShowAddWidgetModal(false);
        }}
        theme={theme}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Widget"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Icon name="alertTriangle" size={24} color="#ef4444" />
          </div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: theme.colors.foreground,
            margin: '0 0 0.5rem 0'
          }}>
            Are you sure?
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5'
          }}>
            This action cannot be undone. This will permanently delete the widget from your dashboard.
          </p>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center'
          }}>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDeleteWidget(showDeleteConfirm)}
              style={{ backgroundColor: '#ef4444' }}
            >
              <Icon name="trash" size={14} color="white" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};