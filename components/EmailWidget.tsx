"use client";

import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmailThread {
  id: string;
  from: string;
  subject: string;
  date: string;
}

interface EmailWidgetProps {
  threads: EmailThread[];
  importantCount: number;
  unreadCount: number;
}

export function EmailWidget({ threads, importantCount, unreadCount }: EmailWidgetProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="glass-panel p-4 h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Important Emails</h3>
        </div>
        <div className="flex items-center gap-2">
          {importantCount > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-0">
              {importantCount}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {unreadCount} total
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {threads.length > 0 ? (
          threads.map((email) => (
            <div
              key={email.id}
              className="task-card p-3 cursor-pointer group"
              onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.id}`, '_blank')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground/90 truncate">
                    {email.from}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {email.subject}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(email.date)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No important emails</p>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-border/50">
        <button
          onClick={() => window.open('https://mail.google.com', '_blank')}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
        >
          Open Gmail →
        </button>
      </div>
    </Card>
  );
}
