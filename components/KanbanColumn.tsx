"use client";

import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

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
        return "border-slate-600/70 bg-slate-900/40";
      case "in-progress":
        return "border-blue-500/60 bg-blue-950/20";
      case "waiting":
        return "border-yellow-500/60 bg-yellow-950/20";
      case "done":
        return "border-green-500/60 bg-green-950/20";
      case "scheduled":
        return "border-purple-500/60 bg-purple-950/20";
      default:
        return "border-slate-600/70 bg-slate-900/40";
    }
  };

  const getHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case "backlog":
        return "text-slate-200";
      case "in-progress":
        return "text-blue-300";
      case "waiting":
        return "text-yellow-300";
      case "done":
        return "text-green-300";
      case "scheduled":
        return "text-purple-300";
      default:
        return "text-slate-200";
    }
  };

  const getCountColor = (status: TaskStatus) => {
    switch (status) {
      case "backlog":
        return "bg-slate-800/80 text-slate-300";
      case "in-progress":
        return "bg-blue-900/50 text-blue-300 border border-blue-500/30";
      case "waiting":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30";
      case "done":
        return "bg-green-900/50 text-green-300 border border-green-500/30";
      case "scheduled":
        return "bg-purple-900/50 text-purple-300 border border-purple-500/30";
      default:
        return "bg-slate-800/80 text-slate-300";
    }
  };

  return (
    <div
      className={`flex flex-col min-w-[340px] max-w-[340px] rounded-xl border-2 ${getColumnColor(
        status
      )} backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl`}
      style={{ height: 'calc(100vh - 180px)' }}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-700/60">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold ${getHeaderColor(status)} flex items-center gap-2.5`}>
            <span className="text-2xl">{icon}</span>
            <span>{title}</span>
          </h2>
          <span className={`text-sm font-bold tabular-nums px-3 py-1.5 rounded-md shadow-sm ${getCountColor(status)}`}>
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-slate-600">
        {columnTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            <div className="text-3xl mb-2 opacity-30">{icon}</div>
            <div>No tasks</div>
          </div>
        ) : (
          columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
