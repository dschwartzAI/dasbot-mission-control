"use client";

import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
}

interface CalendarWidgetProps {
  events: CalendarEvent[];
}

export function CalendarWidget({ events }: CalendarWidgetProps) {
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return dateStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getTimeRemaining = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();
      
      if (diffMs < 0) return { text: "Past", urgent: false };
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffHours < 2) {
        return { text: `${diffMins}m`, urgent: true };
      }
      if (diffHours < 24) {
        return { text: `${diffHours}h`, urgent: false };
      }
      const diffDays = Math.floor(diffHours / 24);
      return { text: `${diffDays}d`, urgent: false };
    } catch {
      return { text: dateStr, urgent: false };
    }
  };

  return (
    <Card className="glass-panel p-4 h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">Upcoming Events</h3>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0">
          {events.length}
        </Badge>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {events.length > 0 ? (
          events.map((event, idx) => {
            const timeRemaining = getTimeRemaining(event.start.dateTime);
            
            return (
              <div
                key={idx}
                className={`task-card p-3 ${timeRemaining.urgent ? 'border-destructive/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/90 truncate">
                      {event.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.start.dateTime)} at {formatTime(event.start.dateTime)}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {event.location}
                      </p>
                    )}
                  </div>
                  <Badge 
                    variant={timeRemaining.urgent ? "destructive" : "secondary"}
                    className="text-xs px-2 py-0 whitespace-nowrap"
                  >
                    {timeRemaining.text}
                  </Badge>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-border/50">
        <button
          onClick={() => window.open('https://calendar.google.com', '_blank')}
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          Open Calendar →
        </button>
      </div>
    </Card>
  );
}
