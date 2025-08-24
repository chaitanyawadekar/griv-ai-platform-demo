import React, { useState } from 'react';
import { Theme, Widget, AIInsight } from '../../types';
import { sampleWidgets, sampleAIInsights } from '../../data/sampleData';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface OverviewScreenProps {
  theme: Theme;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({ theme }) => {
  const [widgets] = useState<Widget[]>(sampleWidgets);
  const [insights] = useState<AIInsight[]>(sampleAIInsights);
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(true);
  
  // Future widget configuration functionality
  const handleAddWidget = () => {
    console.log('Add widget functionality to be implemented');
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
        padding: '24px',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme.shadow.sm
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
        padding: '24px',
        height: widget.config.chartType === 'pie' ? '240px' : '300px',
        boxShadow: theme.shadow.sm
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
          height: 'calc(100% - 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.muted,
          borderRadius: '8px',
          color: theme.colors.mutedForeground,
          fontSize: '14px'
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
        padding: '24px',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme.shadow.sm
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
        padding: '24px',
        height: '320px',
        boxShadow: theme.shadow.sm
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
        
        <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
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
        padding: '24px',
        height: '140px',
        boxShadow: theme.shadow.sm
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
        padding: '24px',
        height: '240px',
        boxShadow: theme.shadow.sm
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
        
        <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
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
    <div style={{ display: 'flex', height: '100vh', gap: '24px', padding: '24px' }}>
      {/* Main Dashboard Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: theme.colors.foreground, margin: '0 0 8px 0' }}>
              Good morning! 👋
            </h1>
            <p style={{ fontSize: '16px', color: theme.colors.mutedForeground, margin: 0 }}>
              Here's what's happening with your day and work
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

        {/* Widgets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '20px',
          gridAutoRows: '80px',
          marginBottom: '24px'
        }}>
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                gridColumn: `span ${widget.position.w}`,
                gridRow: `span ${widget.position.h}`,
              }}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Sidebar */}
      {isInsightsPanelOpen ? (
        <div style={{ 
          width: '350px', 
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          padding: '24px',
          overflowY: 'auto',
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
            width: '56px',
            backgroundColor: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '20px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: theme.shadow.sm,
            transition: 'all 0.3s ease',
            gap: '16px'
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
    </div>
  );
};