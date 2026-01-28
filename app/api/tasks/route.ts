import { NextResponse } from "next/server";
import { MissionControlData, Task } from "@/types/task";

const GATEWAY_URL = process.env.GATEWAY_URL || '';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || '';

interface GatewaySession {
  key: string;
  label?: string;
  totalTokens?: number;
  updatedAt: number;
  model?: string;
}

interface CronJob {
  id: string;
  name: string;
  payload: {
    message: string;
  };
  state: {
    nextRunAtMs: number;
  };
  schedule: {
    expr: string;
  };
}

async function fetchWithAuth(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function GET() {
  const tasks: Task[] = [];
  let errors: string[] = [];

  try {
    // Try to fetch sessions from Gateway
    try {
      const sessionsResponse = await fetchWithAuth(`${GATEWAY_URL}/api/sessions?limit=10`);
      
      if (sessionsResponse.ok) {
        const contentType = sessionsResponse.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const sessionsData = await sessionsResponse.json();
          const sessions: GatewaySession[] = sessionsData.sessions || [];
          
          // Transform sessions → In Progress tasks
          const sessionTasks = sessions
            .filter(s => s.label)
            .map(s => ({
              id: s.key,
              title: s.label || 'Untitled Session',
              status: 'in-progress' as const,
              description: `Sub-agent (${s.totalTokens || 0} tokens)`,
              startedAt: new Date(s.updatedAt).toISOString(),
              tags: s.model ? [s.model] : [],
              subagentSession: s.key,
            }));
          
          tasks.push(...sessionTasks);
        } else {
          errors.push('Sessions API returned non-JSON response');
        }
      } else {
        errors.push(`Sessions API returned ${sessionsResponse.status}`);
      }
    } catch (err) {
      errors.push(`Sessions fetch error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Try to fetch cron jobs from Gateway
    try {
      const cronResponse = await fetchWithAuth(`${GATEWAY_URL}/api/cron`);
      
      if (cronResponse.ok) {
        const contentType = cronResponse.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const cronData = await cronResponse.json();
          const cronJobs: CronJob[] = cronData.jobs || [];
          
          // Transform cron → Scheduled tasks
          const cronTasks = cronJobs.map(j => ({
            id: j.id,
            title: j.name,
            status: 'scheduled' as const,
            description: j.payload?.message?.substring(0, 100) || 'Scheduled task',
            estimatedCompletion: new Date(j.state.nextRunAtMs).toISOString(),
            tags: j.schedule?.expr ? [j.schedule.expr] : [],
          }));
          
          tasks.push(...cronTasks);
        } else {
          errors.push('Cron API returned non-JSON response');
        }
      } else {
        errors.push(`Cron API returned ${cronResponse.status}`);
      }
    } catch (err) {
      errors.push(`Cron fetch error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Add mock data if no real tasks were loaded (for testing)
    if (tasks.length === 0 && GATEWAY_URL) {
      tasks.push({
        id: 'mock-1',
        title: '🔧 Gateway API Integration Pending',
        status: 'waiting',
        description: errors.length > 0 ? `Errors: ${errors.join('; ')}` : 'Waiting for Gateway API connection to be configured',
        tags: ['system', 'setup'],
      });
    }

    const data: MissionControlData = {
      tasks,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Gateway:", error);
    
    // Return error info in development, empty in production
    return NextResponse.json({
      tasks: [{
        id: 'error-1',
        title: '⚠️ API Error',
        status: 'waiting',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        tags: ['error'],
      }],
      lastUpdated: new Date().toISOString(),
    });
  }
}
