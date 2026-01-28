"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, Calendar, MessageSquare, Github, DollarSign, 
  Users, Activity, Clock, ExternalLink, RefreshCw,
  AlertCircle, CheckCircle, TrendingUp
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface DashboardData {
  gmail: {
    unreadCount: number;
    threads: Array<{
      id: string;
      from: string;
      subject: string;
      date: string;
    }>;
    lastChecked: string;
  };
  calendar: {
    events: Array<{
      summary: string;
      start: { dateTime: string };
      end: { dateTime: string };
      location?: string;
    }>;
  };
  slack: {
    mentionCount: number;
    mentions: any[];
    recentMessages: any[];
  };
  github: {
    openPRs: number;
    repos: any[];
  };
  financial: {
    cash: number;
    monthlyBurn: number;
    runway: number;
    lastUpdated: string;
  };
  toolchat: {
    activeUsers: number;
    whiteLabels: number;
    supportTickets: number;
  };
  dasbot: {
    activeSubAgents: number;
    scheduledCrons: number;
    completedToday: number;
    recentTasks: any[];
  };
  timestamp: string;
}

function formatTimeRemaining(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff < 0) return "Past";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MissionControl() {
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="p-8 bg-red-950/50 border-red-900">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-center">{error}</p>
          <Button onClick={fetchData} className="mt-4 w-full">Retry</Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const urgentEmails = data.gmail.threads.slice(0, 5);
  const upcomingEvents = data.calendar.events.slice(0, 3);
  const runwayDays = Math.floor(data.financial.runway * 30);
  const runwayColor = runwayDays < 60 ? 'text-red-400' : runwayDays < 120 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-slate-400 mt-1">
            Last updated: {formatTime(lastRefresh.toISOString())}
          </p>
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm"
          className="border-slate-700 hover:bg-slate-800"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="border-blue-600 hover:bg-blue-950"
          onClick={() => window.open('https://mail.google.com', '_blank')}
        >
          <Mail className="h-4 w-4 mr-2" />
          Check Email
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-purple-600 hover:bg-purple-950"
          onClick={() => window.open('https://web.whatsapp.com', '_blank')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-green-600 hover:bg-green-950"
          onClick={() => window.open('https://app.slack.com/client/T08DF2TBMA7/C0A2QMXGB6D', '_blank')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Slack (Sansa)
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="border-orange-600 hover:bg-orange-950"
          onClick={() => window.open('https://github.com/dschwartzAI', '_blank')}
        >
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Inbox Monitoring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Email</h2>
              </div>
              <Badge variant={data.gmail.unreadCount > 10 ? "destructive" : "secondary"}>
                {data.gmail.unreadCount} unread
              </Badge>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {urgentEmails.map((email) => (
                  <div 
                    key={email.id} 
                    className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.id}`, '_blank')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{email.from}</p>
                        <p className="text-slate-300 text-sm truncate">{email.subject}</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {email.date.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Slack */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Slack - Sansa Team</h2>
              </div>
              {data.slack.mentionCount > 0 && (
                <Badge variant="destructive">
                  {data.slack.mentionCount} mentions
                </Badge>
              )}
            </div>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {data.slack.recentMessages.length > 0 ? (
                  data.slack.recentMessages.map((msg, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-800/50 text-sm">
                      <p className="text-slate-400 truncate">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No recent messages</p>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Calendar */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, idx) => {
                  const startTime = event.start.dateTime;
                  const timeRemaining = formatTimeRemaining(startTime);
                  const isUrgent = new Date(startTime).getTime() - Date.now() < 2 * 60 * 60 * 1000;
                  
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg ${isUrgent ? 'bg-yellow-950/30 border border-yellow-900/50' : 'bg-slate-800/50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{event.summary}</p>
                          {event.location && (
                            <p className="text-sm text-slate-400">{event.location}</p>
                          )}
                          <p className="text-sm text-slate-500 mt-1">
                            {formatDate(startTime)} at {formatTime(startTime)}
                          </p>
                        </div>
                        <Badge variant={isUrgent ? "destructive" : "secondary"} className="whitespace-nowrap">
                          {timeRemaining}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-center py-8">No upcoming events</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Business Health & Status */}
        <div className="space-y-6">
          {/* Financial Health */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-semibold">Financial</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Cash</p>
                <p className="text-3xl font-bold text-green-400">
                  ${data.financial.cash.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Burn Rate</p>
                  <p className="text-lg font-semibold text-orange-400">
                    ${data.financial.monthlyBurn.toLocaleString()}/mo
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Runway</p>
                  <p className={`text-lg font-semibold ${runwayColor}`}>
                    {runwayDays} days
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* ToolChat Metrics */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold">ToolChat.ai</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Users</span>
                <span className="font-semibold text-blue-400">{data.toolchat.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">White Labels</span>
                <span className="font-semibold text-purple-400">{data.toolchat.whiteLabels}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Support Tickets</span>
                <Badge variant={data.toolchat.supportTickets > 0 ? "destructive" : "secondary"}>
                  {data.toolchat.supportTickets}
                </Badge>
              </div>
            </div>
          </Card>

          {/* GitHub */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Github className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-semibold">GitHub</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Open PRs</span>
                <Badge variant={data.github.openPRs > 0 ? "destructive" : "secondary"}>
                  {data.github.openPRs}
                </Badge>
              </div>
              {data.github.repos.map((repo, idx) => (
                <div key={idx} className="text-sm">
                  <p className="text-slate-400 truncate">{repo.name}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* DasBot Activity */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">DasBot</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Sub-Agents</span>
                <Badge variant={data.dasbot.activeSubAgents > 0 ? "default" : "secondary"}>
                  {data.dasbot.activeSubAgents}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Scheduled Crons</span>
                <span className="font-semibold">{data.dasbot.scheduledCrons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Completed Today</span>
                <span className="font-semibold text-green-400">{data.dasbot.completedToday}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
