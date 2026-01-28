export type TaskStatus = 'backlog' | 'in-progress' | 'waiting' | 'done' | 'scheduled';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress?: number; // 0-100
  startedAt?: string; // ISO timestamp
  estimatedCompletion?: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  scheduledFor?: string; // ISO timestamp
  links?: {
    label: string;
    url: string;
    type: 'file' | 'github' | 'session' | 'other';
  }[];
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  subagentSession?: string;
}

export interface MissionControlData {
  tasks: Task[];
  lastUpdated: string;
}
