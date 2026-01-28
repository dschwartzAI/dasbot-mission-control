"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'recurring' | 'backlog' | 'in-progress' | 'review';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  assignee?: string;
  timestamp?: string;
  dueDate?: string;
}

interface KanbanBoardV3Props {
  tasks: Task[];
}

export function KanbanBoardV3({ tasks }: KanbanBoardV3Props) {
  const columns = [
    { id: 'recurring', title: 'Recurring', color: 'bg-blue-500/10 border-blue-500/20' },
    { id: 'backlog', title: 'Backlog', color: 'bg-slate-500/10 border-slate-500/20' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-primary/10 border-primary/20' },
    { id: 'review', title: 'Review', color: 'bg-green-500/10 border-green-500/20' },
  ];

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter(task => task.status === columnId);
  };

  const formatTime = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timestampStr;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-primary';
    }
  };

  return (
    <div className="h-full flex gap-4 overflow-x-auto scrollbar-thin pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksForColumn(column.id);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 flex flex-col"
          >
            {/* Column Header */}
            <div className={`kanban-column-header ${column.color} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>
            
            {/* Column Content */}
            <div className="flex-1 kanban-column rounded-b-lg p-3 space-y-3 overflow-y-auto scrollbar-thin">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`task-card p-3 border-l-2 ${getPriorityColor(task.priority)} cursor-pointer group`}
                >
                  {/* Task Title */}
                  <h4 className="text-sm font-medium text-foreground/95 mb-1 group-hover:text-primary transition-colors">
                    {task.title}
                  </h4>
                  
                  {/* Task Description */}
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Footer: Assignee & Timestamp */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                      )}
                    </div>
                    {task.timestamp && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTime(task.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
