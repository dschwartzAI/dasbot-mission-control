"use client";

import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Clock, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoardV3 } from "./KanbanBoardV3";
import { EmailWidget } from "./EmailWidget";
import { CalendarWidget } from "./CalendarWidget";
import { ActivityFeed } from "./ActivityFeed";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface DashboardData {
  emails: {
    unreadCount: number;
    importantCount: number;
    threads: Array<{
      id: string;
      from: string;
      subject: string;
      date: string;
    }>;
  };
  calendar: {
    events: Array<{
      summary: string;
      start: { dateTime: string };
      end: { dateTime: string };
      location?: string;
    }>;
  };
  taskStats: {
    thisWeek: number;
    inProgress: number;
    total: number;
    completion: number;
    recentTasks: any[];
  };
  activity: Array<{
    type: 'completed' | 'started';
    title: string;
    timestamp: string;
  }>;
  timestamp: string;
}

export function MissionControlV3() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const json = await response.json();
      setData(json);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Convert recent tasks to Kanban format
  const kanbanTasks = (data.taskStats.recentTasks || []).map((task: any, idx: number) => {
    let status: 'recurring' | 'backlog' | 'in-progress' | 'review' = 'backlog';
    if (task.status === 'done') status = 'review';
    else if (task.status === 'in-progress') status = 'in-progress';
    else if (task.recurring) status = 'recurring';
    
    return {
      id: task.id || `task-${idx}`,
      title: task.title || task.description || 'Untitled Task',
      description: task.description,
      status,
      priority: task.priority || 'medium',
      tags: task.tags || [],
      assignee: task.assignee || 'DasBot',
      timestamp: task.timestamp || task.createdAt,
    };
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Stats Bar */}
      <header className="border-b border-border/50 backdrop-blur">
        <div className="px-6 py-4">
          {/* Top Row: Title + Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-purple">
                Mission Control
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {data.taskStats.thisWeek}
              </p>
            </div>
            
            <div className="stat-card accent-glow">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {data.taskStats.inProgress}
              </p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-xs text-muted-foreground">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {data.taskStats.total}
              </p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">Completion</span>
              </div>
              <p className="text-2xl font-bold text-accent">
                {data.taskStats.completion}%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Kanban Board (80% width) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            <KanbanBoardV3 tasks={kanbanTasks} />
          </div>
          
          {/* Bottom: Email + Calendar */}
          <div className="border-t border-border/50 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <EmailWidget
                threads={data.emails.threads}
                importantCount={data.emails.importantCount}
                unreadCount={data.emails.unreadCount}
              />
              <CalendarWidget events={data.calendar.events} />
            </div>
          </div>
        </div>

        {/* Right: Activity Feed (20% width) */}
        <div className="w-80 border-l border-border/50 p-4">
          <ActivityFeed items={data.activity} />
        </div>
      </div>
    </div>
  );
}
