import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from the statically generated tasks.json file
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/tasks.json`, {
      cache: 'no-store' // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    
    // Return empty state if file not found
    return NextResponse.json({
      tasks: [],
      lastUpdated: new Date().toISOString()
    });
  }
}
