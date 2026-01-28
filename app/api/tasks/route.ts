import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    // Read from static tasks JSON file
    const tasksPath = join('/home/claudebot/clawd', 'todays-tasks.json');
    const fileContent = readFileSync(tasksPath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json({
      tasks: data.tasks || [],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error reading tasks file:', error);
    
    return NextResponse.json({
      tasks: [],
      lastUpdated: new Date().toISOString(),
      error: 'Failed to read tasks file'
    }, { status: 500 });
  }
}
