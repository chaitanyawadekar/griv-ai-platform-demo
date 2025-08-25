import React, { useState } from 'react';
import { Theme, Widget, AIInsight } from '../../types';
import { sampleWidgets, sampleAIInsights } from '../../data/sampleData';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

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
  
  // Widget form state
  const [widgetForm, setWidgetForm] = useState({
    title: '',
    type: 'metric_card' as Widget['type'],
    dataSource: 'workitems' as 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom',
    chartType: 'bar' as 'line' | 'bar' | 'pie' | 'area' | 'donut',
    color: '#3b82f6',
    icon: 'briefcase',
    showTrend: true,
    timeRange: '7d' as '7d' | '30d' | '90d' | '1y' | 'all'
  });
  
  const handleAddWidget = () => {
    setShowAddWidgetModal(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    setShowDeleteConfirm(null);
  };

  const handleCreateWidget = () => {
    // Determine grid size based on widget type
    let width = 3;
    let height = 1;
    
    switch (widgetForm.type) {
      case 'metric_card':
      case 'progress_bar':
        width = 3;
        height = 1;
        break;
      case 'chart':
      case 'activity_feed':
      case 'table':
        width = 6;
        height = 2;
        break;
      case 'quick_actions':
        width = 4;
        height = 1;
        break;
      default:
        width = 3;
        height = 1;
    }

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      title: widgetForm.title || `New ${widgetForm.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      type: widgetForm.type,
      position: { x: 0, y: 0, w: width, h: height },
      dataSource: {
        type: widgetForm.dataSource,
        aggregation: 'count',
        timeRange: widgetForm.timeRange
      },
      config: {
        chartType: widgetForm.type === 'chart' ? widgetForm.chartType : undefined,
        showTrend: widgetForm.showTrend,
        color: widgetForm.color,
        icon: widgetForm.icon,
        refreshInterval: 15
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setWidgets([...widgets, newWidget]);
    setShowAddWidgetModal(false);
    setWidgetForm({
      title: '',
      type: 'metric_card',
      dataSource: 'workitems',
      chartType: 'bar',
      color: '#3b82f6',
      icon: 'briefcase',
      showTrend: true,
      timeRange: '7d'
    });
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
    const mockData = {
      widget_1: { value: 24, trend: '+15%' },
      widget_7: { value: 8, trend: '+25%' }
    };
    
    const data = mockData[widget.id as keyof typeof mockData] || { value: 0, trend: '+0%' };
    
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            backgroundColor: widget.config.color + '20',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Icon name={widget.config.icon || 'activity'} size={20} color={widget.config.color} />
          </div>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
        
        <div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: theme.colors.foreground,
            marginBottom: '4px'
          }}>
            {data.value}
          </div>
          <div style={{
            fontSize: '14px',
            color: theme.colors.mutedForeground,
            marginBottom: '8px'
          }}>
            {widget.title}
          </div>
          {widget.config.showTrend && (
            <div style={{
              fontSize: '12px',
              color: data.trend.startsWith('+') ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Icon 
                name={data.trend.startsWith('+') ? 'trendingUp' : 'trendingDown'} 
                size={12} 
              />
              {data.trend} this week
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            backgroundColor: widget.config.color + '20',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Icon name={widget.config.icon || 'target'} size={20} color={widget.config.color} />
          </div>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.colors.foreground, margin: 0 }}>
            {widget.title}
          </h3>
          <Icon 
            name="moreVertical" 
            size={16} 
            color={theme.colors.mutedForeground} 
            style={{ cursor: 'pointer' }} 
          />
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
            <p style={{ fontSize: '14px', color: theme.colors.mutedForeground, margin: '4px 0 0 0', fontStyle: 'italic' }}>
              💡 Drag widgets to reorder them
            </p>
          </div>
          <Button 
            onClick={handleAddWidget}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Icon name="plus" size={16} />
            Add Widget
          </Button>
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
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transform: isDragging ? 'scale(0.95) rotate(2deg)' : 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isDragOver ? `0 0 0 3px ${theme.colors.primary}40` : 'none',
                  opacity: isDragging ? 0.7 : 1,
                  zIndex: isDragging ? 1000 : 1
                }}
              >
                {/* Widget Controls */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10,
                    display: 'flex',
                    gap: '4px',
                    opacity: 0.8,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                  {/* Delete button */}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteConfirm(widget.id);
                    }}
                    style={{
                      padding: '4px',
                      borderRadius: '4px',
                      backgroundColor: theme.colors.muted,
                      cursor: 'pointer',
                      border: '1px solid ' + theme.colors.border
                    }}
                  >
                    <Icon name="trash" size={12} color="#ef4444" />
                  </div>
                  
                  {/* Drag handle */}
                  <div
                    style={{
                      padding: '4px',
                      borderRadius: '4px',
                      backgroundColor: theme.colors.muted,
                      cursor: 'grab',
                      border: '1px solid ' + theme.colors.border
                    }}
                  >
                    <Icon name="moreVertical" size={12} color={theme.colors.mutedForeground} />
                  </div>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      {/* Add Widget Modal */}
      <Modal
        show={showAddWidgetModal}
        onClose={() => setShowAddWidgetModal(false)}
        title="Add New Widget"
        size="lg"
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: theme.colors.foreground,
              marginBottom: '0.5rem'
            }}>
              Widget Title
            </label>
            <Input
              value={widgetForm.title}
              onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })}
              placeholder="Enter widget title"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Widget Type *
              </label>
              <select
                value={widgetForm.type}
                onChange={(e) => setWidgetForm({ ...widgetForm, type: e.target.value as Widget['type'] })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="metric_card">Metric Card</option>
                <option value="chart">Chart</option>
                <option value="progress_bar">Progress Bar</option>
                <option value="activity_feed">Activity Feed</option>
                <option value="quick_actions">Quick Actions</option>
                <option value="table">Table</option>
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
                Data Source *
              </label>
              <select
                value={widgetForm.dataSource}
                onChange={(e) => setWidgetForm({ ...widgetForm, dataSource: e.target.value as 'workitems' | 'contacts' | 'sops' | 'employees' | 'custom' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="workitems">Workitems</option>
                <option value="contacts">Contacts</option>
                <option value="sops">SOPs</option>
                <option value="employees">Employees</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {widgetForm.type === 'chart' && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Chart Type
              </label>
              <select
                value={widgetForm.chartType}
                onChange={(e) => setWidgetForm({ ...widgetForm, chartType: e.target.value as 'line' | 'bar' | 'pie' | 'area' | 'donut' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="area">Area Chart</option>
                <option value="donut">Donut Chart</option>
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.foreground,
                marginBottom: '0.5rem'
              }}>
                Color
              </label>
              <input
                type="color"
                value={widgetForm.color}
                onChange={(e) => setWidgetForm({ ...widgetForm, color: e.target.value })}
                style={{
                  width: '100%',
                  height: '45px',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  cursor: 'pointer'
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
                Icon
              </label>
              <select
                value={widgetForm.icon}
                onChange={(e) => setWidgetForm({ ...widgetForm, icon: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="briefcase">Briefcase</option>
                <option value="users">Users</option>
                <option value="target">Target</option>
                <option value="trendingUp">Trending Up</option>
                <option value="calendar">Calendar</option>
                <option value="fileText">File Text</option>
                <option value="zap">Zap</option>
                <option value="activity">Activity</option>
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
                Time Range
              </label>
              <select
                value={widgetForm.timeRange}
                onChange={(e) => setWidgetForm({ ...widgetForm, timeRange: e.target.value as '7d' | '30d' | '90d' | '1y' | 'all' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: theme.colors.background,
                  color: theme.colors.foreground,
                  fontSize: '0.875rem'
                }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="checkbox"
              id="showTrend"
              checked={widgetForm.showTrend}
              onChange={(e) => setWidgetForm({ ...widgetForm, showTrend: e.target.checked })}
              style={{
                width: '16px',
                height: '16px'
              }}
            />
            <label
              htmlFor="showTrend"
              style={{
                fontSize: '0.875rem',
                color: theme.colors.foreground,
                cursor: 'pointer'
              }}
            >
              Show trend indicators
            </label>
          </div>

          <div style={{
            backgroundColor: theme.colors.secondary,
            padding: '1rem',
            borderRadius: '6px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: theme.colors.foreground
            }}>
              Preview
            </h4>
            <div style={{
              fontSize: '0.75rem',
              color: theme.colors.mutedForeground,
              marginBottom: '0.75rem'
            }}>
              Grid Size: {(() => {
                switch (widgetForm.type) {
                  case 'metric_card':
                  case 'progress_bar':
                    return 'Small (1 column)';
                  case 'chart':
                  case 'activity_feed':
                  case 'table':
                    return 'Large (Full width or 2 columns)';
                  case 'quick_actions':
                    return 'Medium (1 column)';
                  default:
                    return 'Small (1 column)';
                }
              })()}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: theme.colors.card,
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{
                backgroundColor: widgetForm.color + '20',
                padding: '6px',
                borderRadius: '6px'
              }}>
                <Icon name={widgetForm.icon} size={16} color={widgetForm.color} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: theme.colors.foreground
                }}>
                  {widgetForm.title || `New ${widgetForm.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: theme.colors.mutedForeground
                }}>
                  {widgetForm.dataSource} • {widgetForm.timeRange === '7d' ? 'Last 7 days' : widgetForm.timeRange === '30d' ? 'Last 30 days' : widgetForm.timeRange === '90d' ? 'Last 90 days' : widgetForm.timeRange === '1y' ? 'Last year' : 'All time'}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            paddingTop: '1rem',
            borderTop: `1px solid ${theme.colors.border}`
          }}>
            <Button
              variant="outline"
              onClick={() => setShowAddWidgetModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWidget}
            >
              <Icon name="plus" size={14} color="white" />
              Create Widget
            </Button>
          </div>
        </div>
      </Modal>

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
  );
};