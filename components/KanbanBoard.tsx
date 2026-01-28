"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { KanbanColumn } from "./KanbanColumn";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTasks = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        setLastUpdated(new Date(data.lastUpdated));
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { title: "Backlog", icon: "🆕", status: "backlog" as const },
    { title: "In Progress", icon: "🔄", status: "in-progress" as const },
    { title: "Waiting", icon: "⏸️", status: "waiting" as const },
    { title: "Done (Today)", icon: "✅", status: "done" as const },
    { title: "Scheduled", icon: "📅", status: "scheduled" as const },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                DasBot Mission Control
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasks}
              disabled={isRefreshing}
              className="bg-slate-800/50 border-slate-600 hover:bg-slate-800 hover:border-cyan-500/50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <div className="h-full px-6 py-6 min-w-max">
          <div className="flex gap-4 h-full">
            {columns.map((column) => (
              <KanbanColumn
                key={column.status}
                title={column.title}
                icon={column.icon}
                status={column.status}
                tasks={tasks}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>{tasks.length} total tasks</span>
            <span>•</span>
            <span>
              {tasks.filter((t) => t.status === "in-progress").length} active
            </span>
            <span>•</span>
            <span>
              {tasks.filter((t) => t.status === "done").length} completed today
            </span>
          </div>
          <div className="font-mono">
            Built with Next.js + shadcn/ui
          </div>
        </div>
      </footer>
    </div>
  );
}
