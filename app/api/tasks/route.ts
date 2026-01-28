import { NextResponse } from 'next/server';

const GATEWAY_API_URL = process.env.GATEWAY_API_URL || 'https://quiet-human-discounted-million.trycloudflare.com';
const GATEWAY_API_TOKEN = process.env.GATEWAY_API_TOKEN || 'dasbot-mission-control-2026';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'waiting' | 'done' | 'scheduled';
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  tags: string[];
  links?: Array<{ label: string; url: string; type?: string }>;
  startedAt?: string;
  estimatedCompletion?: string;
  completedAt?: string;
}

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (GATEWAY_API_TOKEN) {
      headers['Authorization'] = `Bearer ${GATEWAY_API_TOKEN}`;
    }

    // Fetch sessions, cron jobs, and completed tasks in parallel
    const [sessionsRes, cronRes, completedRes] = await Promise.all([
      fetch(`${GATEWAY_API_URL}/sessions`, { headers, cache: 'no-store' }),
      fetch(`${GATEWAY_API_URL}/cron`, { headers, cache: 'no-store' }),
      fetch(`${GATEWAY_API_URL}/completed`, { headers, cache: 'no-store' })
    ]);

    if (!sessionsRes.ok || !cronRes.ok || !completedRes.ok) {
      throw new Error('Failed to fetch from Gateway API');
    }

    const sessionsData = await sessionsRes.json();
    const cronData = await cronRes.json();
    const completedData = await completedRes.json();

    // Transform sessions -> in-progress tasks
    const sessionTasks: Task[] = (sessionsData.sessions || [])
      .filter((s: any) => s.label && s.key.includes('subagent'))
      .map((s: any) => ({
        id: s.key,
        title: s.label || 'Unnamed Task',
        description: `Sub-agent running (${((s.totalTokens || 0) / 1000).toFixed(1)}K tokens)`,
        status: 'in-progress' as const,
        priority: 'medium' as const,
        progress: s.abortedLastRun ? 50 : 75,
        tags: [s.model?.split('/')[1] || 'claude', 'sub-agent'],
        startedAt: new Date(s.updatedAt).toISOString(),
      }));

    // Transform cron jobs -> scheduled tasks
    const cronTasks: Task[] = (cronData.jobs || []).map((j: any) => ({
      id: j.id,
      title: j.name,
      description: j.payload?.message?.substring(0, 100) + '...' || 'Scheduled task',
      status: 'scheduled' as const,
      priority: 'low' as const,
      tags: [j.schedule?.expr || 'cron', j.enabled ? 'enabled' : 'disabled'],
      estimatedCompletion: j.state?.nextRunAtMs 
        ? new Date(j.state.nextRunAtMs).toISOString()
        : undefined,
    }));

    // Get completed tasks from the file
    const completedTasks: Task[] = completedData.tasks || [];

    return NextResponse.json({
      tasks: [...sessionTasks, ...cronTasks, ...completedTasks],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching tasks from Gateway API:', error);
    
    // Return empty state on error
    return NextResponse.json({
      tasks: [],
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch from Gateway API'
    }, { status: 500 });
  }
}
