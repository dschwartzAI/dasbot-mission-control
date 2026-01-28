"use client";

import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Clock, Calendar, Terminal } from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [open, setOpen] = useState(false);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 bg-slate-900/50 border-slate-700/50 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-sm font-medium text-slate-100">
                {task.title}
              </CardTitle>
              {task.priority && (
                <Badge className={`${getPriorityColor(task.priority)} text-xs px-1.5 py-0.5`}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-400 line-clamp-2">
              {task.description}
            </p>

            {task.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {task.tags?.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-slate-800/50 text-slate-300 border-slate-600"
                >
                  {tag}
                </Badge>
              ))}
              {task.tags && task.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-slate-800/50 text-slate-300 border-slate-600"
                >
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              {task.estimatedCompletion && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(task.estimatedCompletion)}</span>
                </div>
              )}
              {task.scheduledFor && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.scheduledFor)}</span>
                </div>
              )}
              {task.subagentSession && (
                <div className="flex items-center gap-1 text-cyan-400">
                  <Terminal className="w-3 h-3" />
                  <span>Agent</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            {task.priority && (
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-slate-400">
            {task.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {task.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Progress</span>
                <span className="text-cyan-400 font-mono">{task.progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {task.startedAt && (
              <div>
                <div className="text-slate-500 mb-1">Started</div>
                <div className="text-slate-300 font-mono">
                  {new Date(task.startedAt).toLocaleString()}
                </div>
              </div>
            )}
            {task.estimatedCompletion && (
              <div>
                <div className="text-slate-500 mb-1">Est. Completion</div>
                <div className="text-slate-300 font-mono">
                  {new Date(task.estimatedCompletion).toLocaleString()}
                </div>
              </div>
            )}
            {task.completedAt && (
              <div>
                <div className="text-slate-500 mb-1">Completed</div>
                <div className="text-slate-300 font-mono">
                  {new Date(task.completedAt).toLocaleString()}
                </div>
              </div>
            )}
            {task.scheduledFor && (
              <div>
                <div className="text-slate-500 mb-1">Scheduled For</div>
                <div className="text-slate-300 font-mono">
                  {new Date(task.scheduledFor).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {task.subagentSession && (
            <div>
              <div className="text-slate-500 mb-2">Sub-agent Session</div>
              <code className="text-xs bg-slate-800 text-cyan-400 px-3 py-2 rounded block">
                {task.subagentSession}
              </code>
            </div>
          )}

          {task.tags && task.tags.length > 0 && (
            <div>
              <div className="text-slate-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-slate-800/50 text-slate-300 border-slate-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {task.links && task.links.length > 0 && (
            <div>
              <div className="text-slate-500 mb-2">Links</div>
              <div className="space-y-2">
                {task.links.map((link, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start bg-slate-800/50 border-slate-600 hover:bg-slate-800 hover:border-cyan-500/50"
                    asChild
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="flex-1 text-left">{link.label}</span>
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-700/50 border-slate-600"
                      >
                        {link.type}
                      </Badge>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
