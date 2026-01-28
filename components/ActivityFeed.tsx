"use client";

import { Activity, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ActivityItem {
  type: 'completed' | 'started';
  title: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const formatTime = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timestampStr;
    }
  };

  return (
    <Card className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Recent Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="activity-item">
              <div className="flex items-start gap-2">
                {item.type === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground/90 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTime(item.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              No recent activity
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
