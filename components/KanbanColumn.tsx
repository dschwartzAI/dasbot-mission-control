"use client";

import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanColumnProps {
  title: string;
  icon: string;
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ title, icon, status, tasks }: KanbanColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case "backlog":
        return "border-slate-600";
      case "in-progress":
        return "border-blue-500/50";
      case "waiting":
        return "border-yellow-500/50";
      case "done":
        return "border-green-500/50";
      case "scheduled":
        return "border-purple-500/50";
      default:
        return "border-slate-600";
    }
  };

  return (
    <div
      className={`flex flex-col h-full min-w-[320px] max-w-[320px] bg-slate-900/30 rounded-lg border-2 ${getColumnColor(
        status
      )} backdrop-blur`}
    >
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <span>{icon}</span>
            <span>{title}</span>
          </h2>
          <span className="text-sm font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
            {columnTasks.length}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {columnTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No tasks
            </div>
          ) : (
            columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
